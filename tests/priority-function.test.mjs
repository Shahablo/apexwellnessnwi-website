import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const foundingSource = await readFile(
  new URL("../functions/api/founding-consultation.js", import.meta.url),
  "utf8",
);
const prioritySource = await readFile(new URL("../functions/api/priority.js", import.meta.url), "utf8");
const { onRequest: onFoundingRequest } = await import(
  `data:text/javascript;base64,${Buffer.from(foundingSource).toString("base64")}`
);
const { onRequest: onPriorityRequest } = await import(
  `data:text/javascript;base64,${Buffer.from(prioritySource).toString("base64")}`
);

const ORIGIN = "https://apexwellnessnwi.com";
const CONSENT_VERSION = "founding-consultation-2026-09";
const VALID_PAYLOAD = {
  full_name: "  Ana   O'Neil  ",
  email: " ANA@Example.COM ",
  contact_consent: true,
  consent_version: CONSENT_VERSION,
  website: "",
  form_started_at: 0,
};

class MockStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
    this.params = [];
  }

  bind(...params) {
    this.params = params;
    return this;
  }

  async run() {
    if (!this.sql.includes("INSERT INTO founding_consultation_requests")) {
      throw new Error("Unexpected run statement");
    }

    const [
      id,
      fullName,
      email,
      requestKind,
      consentVersion,
      consentedAt,
      ipHash,
      userAgent,
      sourceOrigin,
      createdAt,
    ] = this.params;
    const duplicate = this.db.submissions.some((submission) => (
      submission.email.toLowerCase() === email.toLowerCase()
      && submission.requestKind === requestKind
    ));
    if (duplicate) {
      const existing = this.db.submissions.find((submission) => (
        submission.email.toLowerCase() === email.toLowerCase()
        && submission.requestKind === requestKind
      ));
      Object.assign(existing, {
        fullName,
        contactConsent: 1,
        consentVersion,
        consentedAt,
        ipHash,
        userAgent,
        sourceOrigin,
        createdAt,
      });
      return { success: true, meta: { changes: 1 } };
    }

    this.db.submissions.push({
      id,
      fullName,
      email,
      requestKind,
      contactConsent: 1,
      consentVersion,
      consentedAt,
      ipHash,
      userAgent,
      sourceOrigin,
      createdAt,
    });
    return { success: true, meta: { changes: 1 } };
  }
}

class MockDB {
  constructor() {
    this.submissions = [];
    this.rateCounters = new Map();
  }

  prepare(sql) {
    return new MockStatement(this, sql);
  }

  async batch(statements) {
    return statements.map((statement) => {
      if (statement.sql.includes("DELETE FROM priority_rate_limits")) {
        return { success: true, meta: { changes: 0 } };
      }

      assert.match(statement.sql, /INSERT INTO priority_rate_limits/);
      const [keyType, keyHash, windowStartedAt] = statement.params;
      const key = `${keyType}:${keyHash}:${windowStartedAt}`;
      const requestCount = (this.rateCounters.get(key) || 0) + 1;
      this.rateCounters.set(key, requestCount);
      return { success: true, results: [{ request_count: requestCount }] };
    });
  }
}

function env(db = new MockDB(), overrides = {}) {
  return {
    DB: db,
    IP_HASH_SALT: "test-salt-with-at-least-16-characters",
    FOUNDING_CONSENT_VERSION: CONSENT_VERSION,
    ...overrides,
  };
}

function request(payload = {}, options = {}) {
  const body = { ...VALID_PAYLOAD, form_started_at: Date.now() - 10_000, ...payload };
  const method = options.method || "POST";
  return new Request(options.url || `${ORIGIN}/api/founding-consultation`, {
    method,
    headers: {
      Origin: options.origin === undefined ? ORIGIN : options.origin,
      "Content-Type": options.contentType || "application/json",
      "CF-Connecting-IP": options.ip || "203.0.113.42",
      "User-Agent": "Founding consultation endpoint test",
      ...options.headers,
    },
    body: ["GET", "HEAD"].includes(method) ? undefined : JSON.stringify(body),
  });
}

async function call(req, testEnv = env()) {
  return onFoundingRequest({ request: req, env: testEnv });
}

test("rejects unsupported methods and answers valid preflights", async () => {
  const getResponse = await call(request({}, { method: "GET" }));
  assert.equal(getResponse.status, 405);
  assert.equal(getResponse.headers.get("Allow"), "POST, OPTIONS");

  const optionsResponse = await call(new Request(`${ORIGIN}/api/founding-consultation`, {
    method: "OPTIONS",
    headers: {
      Origin: ORIGIN,
      "Access-Control-Request-Method": "POST",
    },
  }));
  assert.equal(optionsResponse.status, 204);
  assert.equal(optionsResponse.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  assert.equal(optionsResponse.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
});

test("enforces an approved origin and HTTPS", async () => {
  const badOrigin = await call(request({}, { origin: "https://attacker.example" }));
  assert.equal(badOrigin.status, 403);
  assert.equal(badOrigin.headers.get("Access-Control-Allow-Origin"), null);

  const missingOrigin = await call(request({}, { origin: "" }));
  assert.equal(missingOrigin.status, 403);

  const plainHttp = await call(request({}, {
    url: "http://apexwellnessnwi.com/api/founding-consultation",
  }));
  assert.equal(plainHttp.status, 400);
});

test("accepts only the minimal consultation contract", async () => {
  const invalid = await call(request({
    full_name: "A",
    email: "not-an-email",
    contact_consent: false,
    accessibility_request: "yes",
  }));
  assert.equal(invalid.status, 422);
  assert.deepEqual((await invalid.json()).fields, [
    "full_name",
    "email",
    "contact_consent",
    "accessibility_request",
  ]);

  for (const prohibited of ["care_interest", "phone", "message", "request_kind", "utm_source"]) {
    const response = await call(request({ [prohibited]: "must not be accepted" }));
    assert.equal(response.status, 422, prohibited);
    assert.deepEqual((await response.json()).fields, ["form"], prohibited);
  }
});

test("requires the configured consent version and a strict boolean consent", async () => {
  const wrongVersion = await call(request({ consent_version: "priority-2026-09" }));
  assert.equal(wrongVersion.status, 422);
  assert.deepEqual((await wrongVersion.json()).fields, ["consent_version"]);

  const stringConsent = await call(request({ contact_consent: "true" }));
  assert.equal(stringConsent.status, 422);
  assert.deepEqual((await stringConsent.json()).fields, ["contact_consent"]);
});

test("rejects malformed and oversized bodies before parsing", async () => {
  const wrongType = await call(request({}, { contentType: "text/plain" }));
  assert.equal(wrongType.status, 415);

  const malformed = await call(new Request(`${ORIGIN}/api/founding-consultation`, {
    method: "POST",
    headers: {
      Origin: ORIGIN,
      "Content-Type": "application/json",
      "CF-Connecting-IP": "203.0.113.42",
    },
    body: "{not-json",
  }));
  assert.equal(malformed.status, 400);

  const oversized = await call(request({}, { headers: { "Content-Length": "9000" } }));
  assert.equal(oversized.status, 413);

  const streamedOversizedRequest = new Request(`${ORIGIN}/api/founding-consultation`, {
    method: "POST",
    headers: {
      Origin: ORIGIN,
      "Content-Type": "application/json",
      "CF-Connecting-IP": "203.0.113.42",
    },
    body: "x".repeat(9_000),
  });
  assert.equal(streamedOversizedRequest.headers.get("Content-Length"), null);
  assert.equal((await call(streamedOversizedRequest)).status, 413);
});

test("silently accepts the honeypot but rejects implausibly fast submissions without storage", async () => {
  const db = new MockDB();
  const testEnv = env(db);

  const honeypot = await call(request({ website: "https://spam.example" }), testEnv);
  const tooFast = await call(request({ form_started_at: Date.now() }), testEnv);
  assert.equal(honeypot.status, 200);
  assert.equal(tooFast.status, 422);
  assert.match((await tooFast.json()).message, /wait a moment/i);
  assert.equal(db.submissions.length, 0);
  assert.equal(db.rateCounters.size, 0);
});

test("accepts restored tabs and client clock drift instead of falsely discarding people", async () => {
  const oldTabDb = new MockDB();
  const futureClockDb = new MockDB();
  const tooOld = await call(
    request({ form_started_at: Date.now() - (25 * 60 * 60 * 1_000) }),
    env(oldTabDb),
  );
  const futureClock = await call(
    request({ form_started_at: Date.now() + (60 * 60 * 1_000) }),
    env(futureClockDb),
  );

  assert.equal(tooOld.status, 200);
  assert.equal(futureClock.status, 200);
  assert.equal(oldTabDb.submissions.length, 1);
  assert.equal(futureClockDb.submissions.length, 1);
});

test("normalizes and stores a Founding Patient consent record without raw IP", async () => {
  const db = new MockDB();
  const response = await call(request(), env(db));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(db.submissions.length, 1);

  const stored = db.submissions[0];
  assert.equal(stored.fullName, "Ana O'Neil");
  assert.equal(stored.email, "ana@example.com");
  assert.equal(stored.requestKind, "founding_consultation");
  assert.equal(stored.contactConsent, 1);
  assert.equal(stored.consentVersion, CONSENT_VERSION);
  assert.match(stored.consentedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.match(stored.ipHash, /^[a-f0-9]{64}$/);
  assert.notEqual(stored.ipHash, "203.0.113.42");
  assert.equal(stored.userAgent, "Founding consultation endpoint test");
});

test("derives the website-accessibility request kind from the optional boolean", async () => {
  const db = new MockDB();
  const response = await call(request({
    email: "accessibility@example.com",
    accessibility_request: true,
  }), env(db));

  assert.equal(response.status, 200);
  assert.equal(db.submissions.length, 1);
  assert.equal(db.submissions[0].requestKind, "website_accessibility");
});

test("includes hardened security headers on success and error responses", async () => {
  const successResponse = await call(request(), env(new MockDB()));
  const errorResponse = await call(request({ email: "invalid" }), env(new MockDB()));

  for (const response of [successResponse, errorResponse]) {
    assert.equal(response.headers.get("Content-Security-Policy"), "default-src 'none'; frame-ancestors 'none'");
    assert.equal(response.headers.get("Permissions-Policy"), "camera=(), geolocation=(), microphone=()");
    assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
    assert.equal(response.headers.get("Strict-Transport-Security"), "max-age=15552000; includeSubDomains");
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(response.headers.get("X-Frame-Options"), "DENY");
  }
});

test("refreshes repeat consent per email and request kind without disclosing membership", async () => {
  const db = new MockDB();
  const testEnv = env(db);
  const first = await call(request(), testEnv);
  const firstConsentTime = db.submissions[0].consentedAt;
  const duplicate = await call(request({
    full_name: "Ana Updated",
    email: "ana@example.com",
  }), testEnv);
  const accessibility = await call(request({
    email: "ana@example.com",
    accessibility_request: true,
  }), testEnv);

  assert.equal(first.status, 200);
  assert.equal(duplicate.status, 200);
  assert.deepEqual(await duplicate.json(), await first.json());
  assert.equal(accessibility.status, 200);
  assert.equal(db.submissions.length, 2);
  assert.equal(db.submissions[0].fullName, "Ana Updated");
  assert.ok(db.submissions[0].consentedAt >= firstConsentTime);
  assert.deepEqual(db.submissions.map(({ requestKind }) => requestKind), [
    "founding_consultation",
    "website_accessibility",
  ]);
});

test("rate limits repeated requests by normalized email", async () => {
  const db = new MockDB();
  const testEnv = env(db);
  let response;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    response = await call(request(), testEnv);
  }

  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("Retry-After")) > 0);
  assert.equal(db.submissions.length, 1);
});

test("rate limits repeated requests by IP even when email addresses differ", async () => {
  const db = new MockDB();
  const testEnv = env(db);
  let response;
  for (let attempt = 0; attempt < 11; attempt += 1) {
    response = await call(request({ email: `patient-${attempt}@example.com` }), testEnv);
  }

  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("Retry-After")) > 0);
  assert.equal(db.submissions.length, 10);
});

test("fails closed when required server configuration or client IP is missing", async () => {
  assert.equal((await call(request(), { IP_HASH_SALT: "long-enough-test-secret" })).status, 503);
  assert.equal((await call(request(), {
    DB: new MockDB(),
    FOUNDING_CONSENT_VERSION: CONSENT_VERSION,
  })).status, 503);
  assert.equal((await call(request(), {
    DB: new MockDB(),
    IP_HASH_SALT: "long-enough-test-secret",
  })).status, 503);
  assert.equal((await call(request(), env(new MockDB(), { FOUNDING_CONSENT_VERSION: "bad version" }))).status, 503);
  assert.equal((await call(request({}, { headers: { "CF-Connecting-IP": "" } }))).status, 503);
});

test("requires and validates Turnstile when its secret is configured", async () => {
  const originalFetch = globalThis.fetch;
  try {
    const missingToken = await call(request(), env(new MockDB(), {
      TURNSTILE_SECRET_KEY: "turnstile-secret",
    }));
    assert.equal(missingToken.status, 422);

    globalThis.fetch = async () => new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    const wrongHostnameDb = new MockDB();
    const wrongHostname = await call(
      request({ turnstile_token: "verified-token" }),
      env(wrongHostnameDb, { TURNSTILE_SECRET_KEY: "turnstile-secret" }),
    );
    assert.equal(wrongHostname.status, 422);
    assert.equal(wrongHostnameDb.submissions.length, 0);

    globalThis.fetch = async () => new Response(JSON.stringify({
      success: true,
      hostname: "apexwellnessnwi.com",
    }), { status: 200, headers: { "Content-Type": "application/json" } });
    const db = new MockDB();
    const valid = await call(
      request({ turnstile_token: "verified-token" }),
      env(db, { TURNSTILE_SECRET_KEY: "turnstile-secret" }),
    );
    assert.equal(valid.status, 200);
    assert.equal(db.submissions.length, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("retires the legacy Priority endpoint with a hardened 410 and no database work", async () => {
  const response = await onPriorityRequest({
    request: new Request(`${ORIGIN}/api/priority`, {
      method: "POST",
      headers: { Origin: ORIGIN, "Content-Type": "application/json" },
      body: JSON.stringify(VALID_PAYLOAD),
    }),
    env: env(),
  });

  assert.equal(response.status, 410);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  assert.match((await response.json()).message, /retired/i);
});

test("migration preserves legacy Priority rows and constrains the new request kinds", async () => {
  const migration1 = await readFile(new URL("../migrations/0001_priority.sql", import.meta.url), "utf8");
  const migration2 = await readFile(
    new URL("../migrations/0002_founding_consultations.sql", import.meta.url),
    "utf8",
  );
  const database = new DatabaseSync(":memory:");

  try {
    database.exec(migration1);
    database.prepare(`
      INSERT INTO priority_submissions (
        id, full_name, email, care_interest, consent, consent_version,
        consented_at, ip_hash, user_agent, source_origin, created_at
      ) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
    `).run(
      "legacy-id",
      "Legacy Patient",
      "legacy@example.com",
      "not_sure",
      "priority-2026-09",
      "2026-09-01T00:00:00.000Z",
      "a".repeat(64),
      "migration test",
      ORIGIN,
      "2026-09-01T00:00:00.000Z",
    );

    database.exec(migration2);
    assert.equal(
      database.prepare("SELECT email FROM priority_submissions WHERE id = ?").get("legacy-id").email,
      "legacy@example.com",
    );

    const insertFounding = database.prepare(`
      INSERT INTO founding_consultation_requests (
        id, full_name, email, request_kind, contact_consent, consent_version,
        consented_at, ip_hash, user_agent, source_origin, created_at
      ) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
    `);
    insertFounding.run(
      "founding-id",
      "Founding Patient",
      "founding@example.com",
      "founding_consultation",
      CONSENT_VERSION,
      "2026-09-02T00:00:00.000Z",
      "b".repeat(64),
      "migration test",
      ORIGIN,
      "2026-09-02T00:00:00.000Z",
    );
    assert.throws(() => insertFounding.run(
      "invalid-kind-id",
      "Invalid Kind",
      "invalid@example.com",
      "other",
      CONSENT_VERSION,
      "2026-09-02T00:00:00.000Z",
      "c".repeat(64),
      "migration test",
      ORIGIN,
      "2026-09-02T00:00:00.000Z",
    ), /constraint/i);
  } finally {
    database.close();
  }
});

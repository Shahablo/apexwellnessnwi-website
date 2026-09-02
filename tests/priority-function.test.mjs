import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const source = await readFile(new URL("../functions/api/priority.js", import.meta.url), "utf8");
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

const ORIGIN = "https://apexwellnessnwi.com";
const VALID_PAYLOAD = {
  full_name: "  Ana   O'Neil  ",
  email: " ANA@Example.COM ",
  care_interest: "weight_management",
  consent: true,
  consent_version: "priority-2026-09",
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
    if (!this.sql.includes("INSERT INTO priority_submissions")) {
      throw new Error("Unexpected run statement");
    }

    const [id, fullName, email, careInterest, consentVersion, consentedAt, ipHash, userAgent, sourceOrigin, createdAt] = this.params;
    if (this.db.submissions.some((submission) => submission.email.toLowerCase() === email.toLowerCase())) {
      return { success: true, meta: { changes: 0 } };
    }

    this.db.submissions.push({
      id,
      fullName,
      email,
      careInterest,
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
    CONSENT_VERSION: "priority-2026-09",
    ...overrides,
  };
}

function request(payload = {}, options = {}) {
  const body = { ...VALID_PAYLOAD, form_started_at: Date.now() - 10_000, ...payload };
  return new Request(options.url || `${ORIGIN}/api/priority`, {
    method: options.method || "POST",
    headers: {
      Origin: options.origin === undefined ? ORIGIN : options.origin,
      "Content-Type": options.contentType || "application/json",
      "CF-Connecting-IP": options.ip || "203.0.113.42",
      "User-Agent": "Priority endpoint test",
      ...options.headers,
    },
    body: ["GET", "HEAD"].includes(options.method) ? undefined : JSON.stringify(body),
  });
}

async function call(req, testEnv = env()) {
  return onRequest({ request: req, env: testEnv });
}

test("rejects unsupported methods and answers valid preflights", async () => {
  const getResponse = await call(request({}, { method: "GET" }));
  assert.equal(getResponse.status, 405);
  assert.equal(getResponse.headers.get("Allow"), "POST, OPTIONS");

  const optionsResponse = await call(new Request(`${ORIGIN}/api/priority`, {
    method: "OPTIONS",
    headers: {
      Origin: ORIGIN,
      "Access-Control-Request-Method": "POST",
    },
  }));
  assert.equal(optionsResponse.status, 204);
  assert.equal(optionsResponse.headers.get("Access-Control-Allow-Origin"), ORIGIN);
});

test("enforces an approved origin and HTTPS", async () => {
  const badOrigin = await call(request({}, { origin: "https://attacker.example" }));
  assert.equal(badOrigin.status, 403);
  assert.equal(badOrigin.headers.get("Access-Control-Allow-Origin"), null);

  const plainHttp = await call(request({}, { url: "http://apexwellnessnwi.com/api/priority" }));
  assert.equal(plainHttp.status, 400);
});

test("rejects invalid, extra, and oversized input", async () => {
  const invalid = await call(request({
    full_name: "A",
    email: "not-an-email",
    care_interest: "my private medical history",
    consent: false,
    extra_notes: "must not be accepted",
  }));
  assert.equal(invalid.status, 422);
  assert.deepEqual((await invalid.json()).fields, ["form"]);

  const oversized = await call(request({}, { headers: { "Content-Length": "9000" } }));
  assert.equal(oversized.status, 413);

  const streamedOversizedRequest = new Request(`${ORIGIN}/api/priority`, {
    method: "POST",
    headers: {
      Origin: ORIGIN,
      "Content-Type": "application/json",
      "CF-Connecting-IP": "203.0.113.42",
    },
    body: "x".repeat(9_000),
  });
  assert.equal(streamedOversizedRequest.headers.get("Content-Length"), null);
  const streamedOversized = await call(streamedOversizedRequest);
  assert.equal(streamedOversized.status, 413);
});

test("silently accepts honeypot and implausibly fast bot submissions without storing them", async () => {
  const db = new MockDB();
  const testEnv = env(db);

  const honeypot = await call(request({ website: "https://spam.example" }), testEnv);
  const tooFast = await call(request({ form_started_at: Date.now() }), testEnv);
  assert.equal(honeypot.status, 200);
  assert.equal(tooFast.status, 200);
  assert.equal(db.submissions.length, 0);
  assert.equal(db.rateCounters.size, 0);
});

test("normalizes and stores a valid consent record without retaining the raw IP", async () => {
  const db = new MockDB();
  const response = await call(request(), env(db));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(db.submissions.length, 1);

  const stored = db.submissions[0];
  assert.equal(stored.fullName, "Ana O'Neil");
  assert.equal(stored.email, "ana@example.com");
  assert.equal(stored.careInterest, "weight_management");
  assert.equal(stored.consentVersion, "priority-2026-09");
  assert.match(stored.consentedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.match(stored.ipHash, /^[a-f0-9]{64}$/);
  assert.notEqual(stored.ipHash, "203.0.113.42");
  assert.equal(stored.userAgent, "Priority endpoint test");
});

test("accepts the website and accessibility care-interest category", async () => {
  const db = new MockDB();
  const response = await call(request({
    email: "accessibility@example.com",
    care_interest: "website_or_accessibility",
  }), env(db));

  assert.equal(response.status, 200);
  assert.equal(db.submissions.length, 1);
  assert.equal(db.submissions[0].careInterest, "website_or_accessibility");
});

test("includes hardened security headers on API success and error responses", async () => {
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

test("returns the same success response for a duplicate email and stores one row", async () => {
  const db = new MockDB();
  const testEnv = env(db);
  const first = await call(request(), testEnv);
  const duplicate = await call(request({ email: "ana@example.com" }), testEnv);

  assert.equal(first.status, 200);
  assert.equal(duplicate.status, 200);
  assert.deepEqual(await duplicate.json(), await first.json());
  assert.equal(db.submissions.length, 1);
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

test("fails closed when required server bindings are missing", async () => {
  const withoutDb = await call(request(), { IP_HASH_SALT: "long-enough-test-secret" });
  assert.equal(withoutDb.status, 503);

  const withoutSalt = await call(request(), { DB: new MockDB() });
  assert.equal(withoutSalt.status, 503);
});

test("requires and validates Turnstile when its secret is configured", async () => {
  const originalFetch = globalThis.fetch;
  try {
    const missingToken = await call(request(), env(new MockDB(), { TURNSTILE_SECRET_KEY: "turnstile-secret" }));
    assert.equal(missingToken.status, 422);

    globalThis.fetch = async () => new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    const missingHostnameDb = new MockDB();
    const missingHostname = await call(
      request({ turnstile_token: "verified-token" }),
      env(missingHostnameDb, { TURNSTILE_SECRET_KEY: "turnstile-secret" }),
    );
    assert.equal(missingHostname.status, 422);
    assert.equal(missingHostnameDb.submissions.length, 0);

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

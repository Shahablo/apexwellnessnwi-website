import assert from "node:assert/strict";
import { createHash, webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { renderLaunchEmail } from "../src/launch-email-copy.mjs";
import { onRequest as signup } from "../functions/api/founding-consultation.js";
import {
  handleLaunchEmailAction,
  handleLaunchEmailWebhook,
  linkToken,
  runLaunchEmailQueue,
} from "../src/launch-email.mjs";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const ORIGIN = "https://apexwellnessnwi.com";
const CONSENT_VERSION = "launch-list-split-2026-10-26";

test("branded launch emails retain action, consent and plain-text fallbacks", () => {
  const verify = renderLaunchEmail("verify", {
    verify: ORIGIN + "/api/launch-email/verify?id=test&token=sample",
  });
  assert.match(verify.htmlContent, /apex-icon-as-a-email-20261026\.png/);
  assert.match(verify.htmlContent, /Confirm my email/);
  assert.match(verify.htmlContent, /id=test&amp;token=sample/);
  assert.match(verify.textContent, /id=test&token=sample/);
  assert.match(verify.htmlContent, /width="410" alt="Apex Wellness"/);
  assert.match(verify.htmlContent, /padding:22px 30px 18px 14px/);
  assert.match(verify.htmlContent, /margin-left:-30px/);
  assert.match(verify.htmlContent, /Confirm your email\.<\/h1>/);
  assert.doesNotMatch(verify.htmlContent, /One more step|Merrillville, Indiana/);
  assert.match(verify.textContent, /appointment requests become available/);
  assert.doesNotMatch(verify.htmlContent + verify.textContent, /\bthanks\b/i);
  for (const stage of ["welcome", "day3", "day10"]) {
    const email = renderLaunchEmail(stage, {
      unsubscribe: ORIGIN + "/api/launch-email/unsubscribe?id=test&token=sample",
    });
    assert.match(email.htmlContent, /apex-icon-as-a-email-20261026\.png/);
    assert.match(email.htmlContent, /<a href="https:\/\/apexwellnessnwi\.com\/api\/launch-email\/unsubscribe/);
    assert.match(email.textContent, /Unsubscribe from opening updates:/);
    assert.match(email.htmlContent, /8550 Broadway, Suite B/);
    assert.doesNotMatch(email.htmlContent, /before-the-doors-open-apex-wellness/);
    assert.doesNotMatch(email.htmlContent, /Physician-led care|Atif|Wajeeh/);
    assert.match(email.htmlContent, /width="410" alt="Apex Wellness"/);
    assert.match(email.htmlContent, /padding:22px 30px 18px 14px/);
    assert.match(email.htmlContent, /margin-left:-30px/);
    assert.doesNotMatch(email.htmlContent, /Merrillville, Indiana/);
    if (stage === "welcome") {
      assert.match(email.textContent, /The Apex name is on the door in Merrillville/);
      assert.match(email.textContent, /Appointment requests are coming soon/);
      assert.match(email.textContent, /share pricing when it's published/);
      assert.match(email.textContent, /does not book a visit or reserve one of the first 100 assessments/);
      assert.doesNotMatch(email.htmlContent + email.textContent, /\bthanks\b/i);
      assert.doesNotMatch(email.htmlContent + email.textContent, /one step at a time|behind-the-scenes updates/i);
    }
  }
});

test("confirmation page styling is built from same-origin Apex assets", async () => {
  const css = await readFile(new URL("../public/assets/launch-email-action.css", import.meta.url), "utf8");
  const logo = await readFile(new URL("../public/assets/images/apex-icon-as-a-email-20261026.png", import.meta.url));
  assert.match(css, /#f6f4ed/);
  assert.match(css, /#183d36/);
  assert.match(css, /#785331/);
  assert.match(css, /button:focus-visible/);
  assert.ok(logo.length > 0);
  assert.equal(createHash('sha256').update(logo).digest('hex'), '1b5861c133a1b76024034091aece894cb4de69db8cccfee7a6a800168f5a02bf');
  assert.doesNotMatch(css, /@import|url\(|javascript:/i);
});

class Statement {
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
    const statement = this.db.sqlite.prepare(this.sql);
    if (/\bRETURNING\b/i.test(this.sql)) {
      return { success: true, results: statement.all(...this.params) };
    }
    const result = statement.run(...this.params);
    return { success: true, results: [], meta: { changes: Number(result.changes) } };
  }
  async first() {
    return this.db.sqlite.prepare(this.sql).get(...this.params) || null;
  }
  async all() {
    return { success: true, results: this.db.sqlite.prepare(this.sql).all(...this.params) };
  }
}

class TestD1 {
  constructor() {
    this.sqlite = new DatabaseSync(":memory:");
  }
  prepare(sql) {
    return new Statement(this, sql);
  }
  async batch(statements) {
    this.sqlite.exec("BEGIN");
    try {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      this.sqlite.exec("COMMIT");
      return results;
    } catch (error) {
      this.sqlite.exec("ROLLBACK");
      throw error;
    }
  }
  row(sql, ...params) {
    return this.sqlite.prepare(sql).get(...params);
  }
  rows(sql, ...params) {
    return this.sqlite.prepare(sql).all(...params);
  }
  close() {
    this.sqlite.close();
  }
}

async function database() {
  const db = new TestD1();
  for (const number of ["0001_priority", "0002_founding_consultations", "0005_launch_list_phone", "0006_launch_email"]) {
    db.sqlite.exec(await readFile(new URL("../migrations/" + number + ".sql", import.meta.url), "utf8"));
  }
  return db;
}

function environment(db, overrides = {}) {
  return {
    DB: db,
    IP_HASH_SALT: "test-ip-salt-with-at-least-32-characters",
    FOUNDING_CONSENT_VERSION: CONSENT_VERSION,
    LAUNCH_EMAIL_ENABLED: "true",
    LAUNCH_EMAIL_FOLLOWUPS_ENABLED: "true",
    LAUNCH_EMAIL_HASH_SALT: "test-email-salt-with-at-least-32-characters",
    LAUNCH_EMAIL_TOKEN_SECRET: "test-token-secret-with-at-least-32-characters",
    BREVO_API_KEY: "test-key-with-at-least-16-characters",
    BREVO_WEBHOOK_TOKEN: "test-webhook-token-with-at-least-32-characters",
    BREVO_SENDER_EMAIL: "hello@apexwellnessnwi.com",
    BREVO_REPLY_TO_EMAIL: "shahab@apexwellnessnwi.com",
    ...overrides,
  };
}

function signupRequest(payload = {}) {
  const body = {
    full_name: "Apex Test",
    email: "test@example.net",
    phone: "(219) 555-0123",
    phone_followup_consent: false,
    phone_followup_consent_version: "launch-manual-call-2026-10-26",
    contact_consent: true,
    consent_version: CONSENT_VERSION,
    accessibility_request: false,
    form_started_at: Date.now() - 10_000,
    ...payload,
  };
  if (body.accessibility_request === true) {
    delete body.phone_followup_consent;
    delete body.phone_followup_consent_version;
  }
  return new Request(ORIGIN + "/api/founding-consultation", {
    method: "POST",
    headers: {
      Origin: ORIGIN,
      "CF-Connecting-IP": "203.0.113.31",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function actionRequest(path, id, token, method = "POST") {
  if (method === "GET") return new Request(ORIGIN + path + "?id=" + id + "&token=" + token);
  return new Request(ORIGIN + path, {
    method,
    body: new URLSearchParams({ id, token }),
  });
}

test("delivery stays off by default and cannot import an old or support request", async () => {
  const db = await database();
  try {
    const off = environment(db, { LAUNCH_EMAIL_ENABLED: "false" });
    const disabledSignup = await signup({ request: signupRequest(), env: off });
    assert.equal(disabledSignup.status, 200);
    assert.equal((await disabledSignup.json()).verification_pending, undefined);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM founding_consultation_requests").n, 1);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_email_subscriptions").n, 0);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_list_consent_events").n, 1);
    assert.deepEqual(await runLaunchEmailQueue(off), { processed: 0, disabled: true });

    const support = environment(db);
    assert.equal((await signup({
      request: signupRequest({ accessibility_request: true, phone: undefined }),
      env: support,
    })).status, 200);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_email_subscriptions").n, 0);

    const newSignup = await signup({ request: signupRequest(), env: support });
    assert.equal(newSignup.status, 200);
    assert.equal((await newSignup.json()).verification_pending, true);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_email_subscriptions").n, 1);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_list_consent_events").n, 2);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_email_outbox").n, 1);
    assert.equal(db.row("SELECT stage FROM launch_email_outbox").stage, "verify");
  } finally {
    db.close();
  }
});

test("verification is double opt-in, deduplicated, and phone never enters Brevo", async () => {
  const db = await database();
  try {
    const env = environment(db);
    assert.equal((await signup({ request: signupRequest(), env })).status, 200);
    const request = db.row("SELECT * FROM founding_consultation_requests WHERE request_kind = 'founding_consultation'");
    assert.equal(request.phone, "+12195550123");
    assert.equal(request.phone_followup_consent, 0);
    assert.equal(request.phone_followup_consent_version, "launch-manual-call-2026-10-26");
    const verify = db.row("SELECT * FROM launch_email_outbox WHERE stage = 'verify'");
    const token = await linkToken(env.LAUNCH_EMAIL_TOKEN_SECRET, "verify", verify.id);
    const get = await handleLaunchEmailAction(
      actionRequest("/api/launch-email/verify", verify.id, token, "GET"), env,
    );
    const getHtml = await get.text();
    assert.match(getHtml, /Confirm your email/);
    assert.match(getHtml, /assets\/launch-email-action\.css/);
    assert.match(getHtml, /assets\/images\/apex-icon-as-a-email-20261026\.png/);
    assert.doesNotMatch(getHtml, /class="eyebrow"|Merrillville, Indiana/);
    assert.match(getHtml, /<form method="post" action="\/api\/launch-email\/verify">/);
    assert.match(getHtml, /Coming soon[\s\S]*8550 Broadway, Suite B/);
    assert.doesNotMatch(getHtml, /<script\b/i);
    assert.equal(get.headers.get("Content-Security-Policy"),
      "default-src 'none'; style-src 'self'; img-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
    assert.equal(get.headers.get("Referrer-Policy"), "no-referrer");
    assert.equal(get.headers.get("Cache-Control"), "no-store");
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "pending");
    assert.equal((await handleLaunchEmailAction(
      actionRequest("/api/launch-email/verify", verify.id, "a".repeat(43)), env,
    )).status, 200);
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "pending");

    const sent = [];
    const fakeBrevo = async (_url, options) => {
      sent.push(JSON.parse(options.body));
      return new Response(JSON.stringify({ messageId: "<test-message@apexwellnessnwi.com>" }), { status: 201 });
    };
    assert.deepEqual((await runLaunchEmailQueue(env, new Date(), fakeBrevo)).outcomes, ["accepted"]);
    assert.equal(sent[0].to[0].email, "test@example.net");
    assert.equal(sent[0].to[0].contactPixelTrackingConsent, false);
    assert.equal(JSON.stringify(sent[0]).includes("2195550123"), false);
    assert.equal(JSON.stringify(sent[0]).includes("Apex Test"), false);
    assert.equal(db.row("SELECT status FROM launch_email_outbox WHERE stage = 'verify'").status, "accepted");

    const confirmed = await handleLaunchEmailAction(
      actionRequest("/api/launch-email/verify", verify.id, token), env,
    );
    assert.equal(confirmed.status, 200);
    const confirmedHtml = await confirmed.text();
    assert.match(confirmedHtml, /You're confirmed/);
    assert.match(confirmedHtml, /Appointment requests are coming soon; no visit has been booked/);
    assert.doesNotMatch(confirmedHtml, /\bThanks\b/);
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "confirmed");
    assert.deepEqual(db.rows("SELECT stage FROM launch_email_outbox WHERE stage != 'verify' ORDER BY stage")
      .map((row) => row.stage), ["day10", "day3", "welcome"]);
    assert.equal((await runLaunchEmailQueue(env, new Date(), fakeBrevo)).outcomes.includes("accepted"), true);
    assert.equal(sent.length, 2);
    assert.equal(sent[1].subject, "You're on the Apex Wellness Launch List");

    const originalCreated = request.created_at;
    assert.equal((await signup({
      request: signupRequest({ phone_followup_consent: true }), env,
    })).status, 200);
    assert.equal(db.row("SELECT created_at FROM founding_consultation_requests WHERE email = 'test@example.net'").created_at, originalCreated);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_email_outbox WHERE stage = 'verify'").n, 1);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_list_consent_events").n, 2);
    assert.deepEqual(db.rows("SELECT phone_followup_consent FROM launch_list_consent_events ORDER BY rowid")
      .map((row) => row.phone_followup_consent), [0, 1]);
  } finally {
    db.close();
  }
});

test("unsubscribe suppresses pending follow-ups and resubmission does not re-enroll", async () => {
  const db = await database();
  try {
    const env = environment(db);
    await signup({ request: signupRequest(), env });
    const verify = db.row("SELECT id FROM launch_email_outbox WHERE stage = 'verify'");
    await handleLaunchEmailAction(
      actionRequest("/api/launch-email/verify", verify.id,
        await linkToken(env.LAUNCH_EMAIL_TOKEN_SECRET, "verify", verify.id)), env,
    );
    const subscription = db.row("SELECT id FROM launch_email_subscriptions");
    const token = await linkToken(env.LAUNCH_EMAIL_TOKEN_SECRET, "unsubscribe", subscription.id);
    const unsubscribeGet = await handleLaunchEmailAction(
      actionRequest("/api/launch-email/unsubscribe", subscription.id, token, "GET"), env,
    );
    const unsubscribeHtml = await unsubscribeGet.text();
    assert.match(unsubscribeHtml, /assets\/launch-email-action\.css/);
    assert.match(unsubscribeHtml, /<form method="post" action="\/api\/launch-email\/unsubscribe">/);
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "confirmed");
    const unsubscribed = await handleLaunchEmailAction(
      actionRequest("/api/launch-email/unsubscribe", subscription.id, token), env,
    );
    const unsubscribedHtml = await unsubscribed.text();
    assert.match(unsubscribedHtml, /Your opening-update emails have stopped/);
    assert.match(unsubscribedHtml, /We'll miss having you along/);
    assert.match(unsubscribedHtml, /<a href="\/">Visit Apex Wellness<\/a>/);
    assert.doesNotMatch(unsubscribedHtml, /resubscribe|<script\b|\bThanks\b/i);
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "unsubscribed");
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_email_suppressions").n, 1);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_email_outbox WHERE status = 'pending'").n, 0);
    await signup({ request: signupRequest(), env });
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "unsubscribed");
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_email_outbox WHERE stage = 'verify'").n, 1);
  } finally {
    db.close();
  }
});

test("confirmation and unsubscribe remain available while sending is paused or Brevo key is missing", async () => {
  const db = await database();
  try {
    const env = environment(db);
    await signup({ request: signupRequest(), env });
    const verify = db.row("SELECT id FROM launch_email_outbox WHERE stage = 'verify'");
    env.LAUNCH_EMAIL_ENABLED = "false";
    env.BREVO_API_KEY = undefined;
    const verifyToken = await linkToken(env.LAUNCH_EMAIL_TOKEN_SECRET, "verify", verify.id);
    assert.equal((await handleLaunchEmailAction(
      actionRequest("/api/launch-email/verify", verify.id, verifyToken), env,
    )).status, 200);
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "confirmed");
    const subscription = db.row("SELECT id FROM launch_email_subscriptions");
    const unsubscribeToken = await linkToken(env.LAUNCH_EMAIL_TOKEN_SECRET, "unsubscribe", subscription.id);
    assert.equal((await handleLaunchEmailAction(
      actionRequest("/api/launch-email/unsubscribe", subscription.id, unsubscribeToken), env,
    )).status, 200);
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "unsubscribed");
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_email_suppressions").n, 1);
    assert.deepEqual(await runLaunchEmailQueue(env), { processed: 0, disabled: true });
  } finally {
    db.close();
  }
});

test("authenticated bounce webhook still suppresses recipients when sending is paused", async () => {
  const db = await database();
  try {
    const env = environment(db);
    await signup({ request: signupRequest(), env });
    const verify = db.row("SELECT id FROM launch_email_outbox WHERE stage = 'verify'");
    env.LAUNCH_EMAIL_ENABLED = "false";
    env.BREVO_API_KEY = undefined;
    const callback = new Request(ORIGIN + "/api/launch-email/webhook", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.BREVO_WEBHOOK_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "hardBounce", tags: ["apex-launch-" + verify.id],
        "message-id": "paused-callback", ts_epoch: Date.now(),
      }),
    });
    assert.equal((await handleLaunchEmailWebhook(callback, env)).status, 204);
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "suppressed");
    assert.equal(db.row("SELECT reason FROM launch_email_suppressions").reason, "hard_bounce");
  } finally {
    db.close();
  }
});

test("documented Brevo hard-bounce and invalid-email payloads suppress later sends", async () => {
  for (const [event, reason] of [["hard_bounce", "hard_bounce"], ["invalid_email", "invalid"]]) {
    const db = await database();
    try {
      const env = environment(db);
      await signup({ request: signupRequest(), env });
      const verify = db.row("SELECT id FROM launch_email_outbox WHERE stage = 'verify'");
      const callback = new Request(ORIGIN + "/api/launch-email/webhook", {
        method: "POST",
        headers: { Authorization: "Bearer " + env.BREVO_WEBHOOK_TOKEN, "Content-Type": "application/json" },
        body: JSON.stringify({
          event, tags: ["apex-launch-" + verify.id],
          "message-id": "brevo-" + event, ts_epoch: Date.now(),
        }),
      });
      assert.equal((await handleLaunchEmailWebhook(callback, env)).status, 204);
      assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "suppressed");
      assert.equal(db.row("SELECT reason FROM launch_email_suppressions").reason, reason);
      assert.equal(db.row("SELECT status FROM launch_email_outbox WHERE id = ?", verify.id).status, "suppressed");
    } finally {
      db.close();
    }
  }
});

test("documented Brevo unsubscribe tag string suppresses without a stored provider message ID", async () => {
  const db = await database();
  try {
    const env = environment(db);
    await signup({ request: signupRequest(), env });
    const verify = db.row("SELECT id FROM launch_email_outbox WHERE stage = 'verify'");
    const callback = new Request(ORIGIN + "/api/launch-email/webhook", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.BREVO_WEBHOOK_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "unsubscribed", tag: JSON.stringify(["apex-launch-" + verify.id]),
        "message-id": "brevo-unsubscribe", ts_epoch: Date.now(),
      }),
    });
    assert.equal((await handleLaunchEmailWebhook(callback, env)).status, 204);
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "unsubscribed");
    assert.equal(db.row("SELECT reason FROM launch_email_suppressions").reason, "unsubscribe");
    assert.equal(db.row("SELECT status FROM launch_email_outbox WHERE id = ?", verify.id).status, "suppressed");
  } finally {
    db.close();
  }
});

test("repeat signup retains legacy source consent version and time", async () => {
  const db = await database();
  try {
    const off = environment(db, { LAUNCH_EMAIL_ENABLED: "false" });
    assert.equal((await signup({ request: signupRequest(), env: off })).status, 200);
    db.sqlite.exec("DELETE FROM launch_list_consent_events");
    db.sqlite.prepare(
      "UPDATE founding_consultation_requests SET consent_version = ?, consented_at = ?, "
        + "phone_followup_consent = NULL, phone_followup_consent_version = NULL, phone_followup_recorded_at = NULL",
    ).run("legacy-launch-list-2026-10-20", "2026-10-20T15:00:00.000Z");
    assert.equal((await signup({ request: signupRequest(), env: environment(db) })).status, 200);
    const original = db.row("SELECT consent_version, consented_at FROM founding_consultation_requests");
    assert.equal(original.consent_version, "legacy-launch-list-2026-10-20");
    assert.equal(original.consented_at, "2026-10-20T15:00:00.000Z");
    const renewed = db.row("SELECT email_consent_version, phone_followup_consent FROM launch_list_consent_events");
    assert.equal(renewed.email_consent_version, CONSENT_VERSION);
    assert.equal(renewed.phone_followup_consent, 0);
    assert.equal(db.row("SELECT consent_version FROM launch_email_subscriptions").consent_version, CONSENT_VERSION);
  } finally {
    db.close();
  }
});

test("transient provider error retries with the same idempotency key; webhook suppression stops more sends", async () => {
  const db = await database();
  try {
    const env = environment(db);
    await signup({ request: signupRequest(), env });
    const verify = db.row("SELECT id FROM launch_email_outbox WHERE stage = 'verify'");
    const first = await runLaunchEmailQueue(env, new Date(), async () => { throw new Error("network failure"); });
    assert.deepEqual(first.outcomes, ["retry"]);
    assert.equal(db.row("SELECT status FROM launch_email_outbox WHERE id = ?", verify.id).status, "pending");
    const sent = [];
    const later = new Date(Date.now() + 70_000);
    await runLaunchEmailQueue(env, later, async (_url, options) => {
      sent.push(JSON.parse(options.body));
      return new Response(JSON.stringify({ messageId: "test-123" }), { status: 201 });
    });
    assert.equal(sent.length, 1);
    assert.equal(sent[0].headers.IdempotencyKey, verify.id);
    const callback = new Request(ORIGIN + "/api/launch-email/webhook", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.BREVO_WEBHOOK_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "hardBounce",
        "message-id": "test-123",
        tags: ["apex-launch-" + verify.id],
        ts_epoch: Date.now(),
      }),
    });
    assert.equal((await handleLaunchEmailWebhook(callback, env)).status, 204);
    assert.equal(db.row("SELECT status FROM launch_email_subscriptions").status, "suppressed");
    assert.equal(db.row("SELECT reason FROM launch_email_suppressions").reason, "hard_bounce");
  } finally {
    db.close();
  }
});

test("missing sending configuration or migration never claims a successful signup", async () => {
  const db = await database();
  try {
    const noSecret = environment(db, { BREVO_API_KEY: undefined });
    assert.equal((await signup({ request: signupRequest(), env: noSecret })).status, 503);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM founding_consultation_requests").n, 0);
  } finally {
    db.close();
  }

  const withoutMigration = new TestD1();
  try {
    for (const number of ["0001_priority", "0002_founding_consultations", "0005_launch_list_phone"]) {
      withoutMigration.sqlite.exec(
        await readFile(new URL("../migrations/" + number + ".sql", import.meta.url), "utf8"),
      );
    }
    assert.equal((await signup({
      request: signupRequest(), env: environment(withoutMigration),
    })).status, 500);
    assert.equal(withoutMigration.row("SELECT COUNT(*) AS n FROM founding_consultation_requests").n, 0);
  } finally {
    withoutMigration.close();
  }
});

test("Day 3 and Day 10 follow-ups wait for confirmation and respect their independent hold", async () => {
  const db = await database();
  try {
    const env = environment(db, { LAUNCH_EMAIL_FOLLOWUPS_ENABLED: "false" });
    await signup({ request: signupRequest(), env });
    const verify = db.row("SELECT id FROM launch_email_outbox WHERE stage = 'verify'");
    await handleLaunchEmailAction(
      actionRequest("/api/launch-email/verify", verify.id,
        await linkToken(env.LAUNCH_EMAIL_TOKEN_SECRET, "verify", verify.id)), env,
    );
    const sent = [];
    const fakeBrevo = async (_url, options) => {
      sent.push(JSON.parse(options.body));
      return new Response(JSON.stringify({ messageId: "id-" + sent.length }), { status: 201 });
    };
    const now = new Date();
    await runLaunchEmailQueue(env, now, fakeBrevo);
    assert.deepEqual(sent.map((item) => item.subject), ["You're on the Apex Wellness Launch List"]);
    assert.match(sent[0].htmlContent, /<a href="https:\/\/apexwellnessnwi\.com\/api\/launch-email\/unsubscribe/);
    await runLaunchEmailQueue(env, new Date(now.getTime() + 11 * 86_400_000), fakeBrevo);
    assert.equal(sent.length, 1);
    env.LAUNCH_EMAIL_FOLLOWUPS_ENABLED = "true";
    await runLaunchEmailQueue(env, new Date(now.getTime() + 4 * 86_400_000), fakeBrevo);
    assert.equal(sent[1].subject, "Appointment requests are coming soon");
    await runLaunchEmailQueue(env, new Date(now.getTime() + 11 * 86_400_000), fakeBrevo);
    assert.equal(sent[2].subject, "Where you'll find Apex Wellness");
  } finally {
    db.close();
  }
});

test("webhook requires the configured bearer token", async () => {
  const db = await database();
  try {
    const env = environment(db);
    await signup({ request: signupRequest(), env });
    const verify = db.row("SELECT id FROM launch_email_outbox WHERE stage = 'verify'");
    const callback = new Request(ORIGIN + "/api/launch-email/webhook", {
      method: "POST",
      headers: { Authorization: "Bearer wrong", "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "hardBounce", tags: ["apex-launch-" + verify.id], "message-id": "forged",
      }),
    });
    assert.equal((await handleLaunchEmailWebhook(callback, env)).status, 403);
    assert.equal(db.row("SELECT COUNT(*) AS n FROM launch_email_suppressions").n, 0);
  } finally {
    db.close();
  }
});

test("a delayed ambiguous retry is held instead of risking a second delivery", async () => {
  const db = await database();
  try {
    const env = environment(db);
    await signup({ request: signupRequest(), env });
    const verify = db.row("SELECT id FROM launch_email_outbox WHERE stage = 'verify'");
    await runLaunchEmailQueue(env, new Date(), async () => { throw new Error("uncertain provider result"); });
    const delayed = new Date(Date.now() + 40 * 60_000);
    const outcome = await runLaunchEmailQueue(env, delayed, async () => {
      throw new Error("must not retry after idempotency window");
    });
    assert.deepEqual(outcome.outcomes, ["ambiguous"]);
    assert.equal(db.row("SELECT status FROM launch_email_outbox WHERE id = ?", verify.id).status, "ambiguous");
  } finally {
    db.close();
  }
});

test("Brevo's duplicate idempotency response waits for webhook reconciliation", async () => {
  const db = await database();
  try {
    const env = environment(db);
    await signup({ request: signupRequest(), env });
    const verify = db.row("SELECT id FROM launch_email_outbox WHERE stage = 'verify'");
    await runLaunchEmailQueue(env, new Date(), async () => { throw new Error("lost response"); });
    const later = new Date(Date.now() + 70_000);
    const outcome = await runLaunchEmailQueue(env, later, async () => new Response(
      JSON.stringify({ code: "duplicate_parameter" }), { status: 400 },
    ));
    assert.deepEqual(outcome.outcomes, ["ambiguous"]);
    assert.equal(db.row("SELECT status FROM launch_email_outbox WHERE id = ?", verify.id).status, "ambiguous");
    const webhook = new Request(ORIGIN + "/api/launch-email/webhook", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.BREVO_WEBHOOK_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "delivered", tags: ["apex-launch-" + verify.id],
        "message-id": "previously-accepted", ts_epoch: Date.now(),
      }),
    });
    assert.equal((await handleLaunchEmailWebhook(webhook, env)).status, 204);
    assert.equal(db.row("SELECT status FROM launch_email_outbox WHERE id = ?", verify.id).status, "delivered");
  } finally {
    db.close();
  }
});

test("the daily cap counts first attempts even after later suppression", async () => {
  const db = await database();
  try {
    const env = environment(db);
    await signup({ request: signupRequest(), env });
    const subscription = db.row("SELECT id FROM launch_email_subscriptions");
    const now = new Date();
    const insert = db.sqlite.prepare(
      "INSERT INTO launch_email_outbox "
        + "(id, subscription_id, stage, dedupe_key, due_at, status, attempts, first_attempt_at, created_at, updated_at) "
        + "VALUES (?, ?, 'day3', ?, ?, 'suppressed', 1, ?, ?, ?)",
    );
    for (let index = 0; index < 250; index += 1) {
      const id = crypto.randomUUID();
      insert.run(id, subscription.id, "synthetic-" + index, now.toISOString(),
        now.toISOString(), now.toISOString(), now.toISOString());
    }
    let sends = 0;
    const outcome = await runLaunchEmailQueue(env, now, async () => {
      sends += 1;
      return new Response("{}", { status: 201 });
    });
    assert.equal(outcome.dailyCap, true);
    assert.equal(sends, 0);
    assert.equal(db.row("SELECT status FROM launch_email_outbox WHERE stage = 'verify'").status, "pending");
  } finally {
    db.close();
  }
});

import { renderLaunchEmail } from "./launch-email-copy.mjs";

const ORIGIN = "https://apexwellnessnwi.com";
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
const VERIFY_LIFETIME_MS = 24 * 60 * 60 * 1_000;
const RETRY_WINDOW_MS = 25 * 60 * 1_000;
const DAILY_CAP = 250; // Below Brevo Free's published 300-message daily allowance.
const BATCH_SIZE = 20;

const SIGNUP_SUBSCRIPTION_SQL = [
  "INSERT INTO launch_email_subscriptions (",
  "  id, request_id, email_hash, status, consent_version, consented_at, created_at, updated_at",
  ") SELECT ?, r.id, ?, 'pending', ?, ?, ?, ?",
  "FROM founding_consultation_requests r",
  "WHERE r.email = ? AND r.request_kind = 'founding_consultation'",
  "ON CONFLICT(email_hash) DO UPDATE SET",
  "  request_id = excluded.request_id,",
  "  consent_version = excluded.consent_version,",
  "  consented_at = excluded.consented_at,",
  "  updated_at = excluded.updated_at",
  "WHERE launch_email_subscriptions.status IN ('pending', 'confirmed')",
].join("\n");

const SIGNUP_CONSENT_EVENT_SQL = [
  "INSERT INTO launch_list_consent_events (",
  "  id, request_id, email_consent, email_consent_version, phone_followup_consent,",
  "  phone_followup_consent_version, recorded_at",
  ") SELECT ?, r.id, 1, ?, ?, ?, ?",
  "FROM founding_consultation_requests r",
  "WHERE r.email = ? AND r.request_kind = 'founding_consultation'",
].join("\n");

const SIGNUP_VERIFY_SQL = [
  "INSERT INTO launch_email_outbox (",
  "  id, subscription_id, stage, dedupe_key, due_at, expires_at, status, created_at, updated_at",
  ") SELECT ?, s.id, 'verify', ?, ?, ?, 'pending', ?, ?",
  "FROM launch_email_subscriptions s",
  "WHERE s.email_hash = ? AND s.status = 'pending'",
  "  AND NOT EXISTS (SELECT 1 FROM launch_email_suppressions x WHERE x.email_hash = s.email_hash)",
  "  AND NOT EXISTS (",
  "    SELECT 1 FROM launch_email_outbox o",
  "    WHERE o.subscription_id = s.id AND o.stage = 'verify'",
  "      AND o.expires_at > ?",
  "      AND o.status IN ('pending', 'claimed', 'accepted', 'delivered', 'ambiguous')",
  "  )",
  "ON CONFLICT(dedupe_key) DO NOTHING",
].join("\n");

const STAGE_INSERT_SQL = [
  "INSERT INTO launch_email_outbox (",
  "  id, subscription_id, stage, dedupe_key, due_at, status, created_at, updated_at",
  ") SELECT ?, s.id, ?, ?, ?, 'pending', ?, ?",
  "FROM launch_email_subscriptions s",
  "WHERE s.id = ? AND s.status = 'confirmed'",
  "  AND NOT EXISTS (SELECT 1 FROM launch_email_suppressions x WHERE x.email_hash = s.email_hash)",
  "ON CONFLICT(dedupe_key) DO NOTHING",
].join("\n");

function textResponse(status, message) {
  return new Response(status === 204 ? null : message, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function page(title, explanation, path, id, token, button) {
  const form = path
    ? '<form method="post" action="' + path + '">'
      + '<input type="hidden" name="id" value="' + id + '">'
      + '<input type="hidden" name="token" value="' + token + '">'
      + '<button type="submit">' + button + "</button></form>"
    : "";
  return new Response(
    '<!doctype html><html lang="en"><meta charset="utf-8">'
      + '<meta name="viewport" content="width=device-width,initial-scale=1">'
      + "<title>" + title + " | Apex Wellness</title>"
      + '<main><h1>' + title + "</h1><p>" + explanation + "</p>" + form + "</main></html>",
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
        "Content-Type": "text/html; charset=utf-8",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

function validId(value) {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function validTokenShape(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{43}$/.test(value);
}

async function readLimitedText(request, maxBytes) {
  const declared = request.headers.get("Content-Length");
  if (declared !== null && (!Number.isInteger(Number(declared)) || Number(declared) > maxBytes)) {
    return null;
  }
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

function bytesToBase64Url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  try {
    const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4));
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function linkToken(secret, purpose, id) {
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(purpose + ":" + id));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function verifyLinkToken(secret, purpose, id, token) {
  if (!validId(id) || !validTokenShape(token)) return false;
  const signature = base64UrlToBytes(token);
  if (!signature || signature.length !== 32) return false;
  return crypto.subtle.verify(
    "HMAC",
    await hmacKey(secret),
    signature,
    new TextEncoder().encode(purpose + ":" + id),
  );
}

function safeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function lookupHash(env, email) {
  return sha256(env.LAUNCH_EMAIL_HASH_SALT + ":launch-list:" + email.toLowerCase());
}

export function launchEmailEnabled(env) {
  return env?.LAUNCH_EMAIL_ENABLED === "true";
}

export function launchEmailConfigured(env) {
  return launchEmailEnabled(env)
    && typeof env?.LAUNCH_EMAIL_HASH_SALT === "string" && env.LAUNCH_EMAIL_HASH_SALT.length >= 32
    && typeof env?.LAUNCH_EMAIL_TOKEN_SECRET === "string" && env.LAUNCH_EMAIL_TOKEN_SECRET.length >= 32
    && typeof env?.BREVO_API_KEY === "string" && env.BREVO_API_KEY.length >= 16
    && typeof env?.BREVO_WEBHOOK_TOKEN === "string" && env.BREVO_WEBHOOK_TOKEN.length >= 32
    && /^[^\s@]+@apexwellnessnwi\.com$/i.test(env?.BREVO_SENDER_EMAIL || "")
    && /^[^\s@]+@apexwellnessnwi\.com$/i.test(env?.BREVO_REPLY_TO_EMAIL || "")
    && typeof env?.DB?.prepare === "function" && typeof env.DB.batch === "function";
}

// Existing recipient actions must remain available when sending is paused or
// Brevo credentials are unavailable. They depend only on local D1 and the
// stable link secret, not the provider's send configuration.
function launchEmailActionConfigured(env) {
  return typeof env?.LAUNCH_EMAIL_TOKEN_SECRET === "string"
    && env.LAUNCH_EMAIL_TOKEN_SECRET.length >= 32
    && typeof env?.DB?.prepare === "function" && typeof env.DB.batch === "function";
}

function launchEmailWebhookConfigured(env) {
  return typeof env?.BREVO_WEBHOOK_TOKEN === "string"
    && env.BREVO_WEBHOOK_TOKEN.length >= 32
    && typeof env?.DB?.prepare === "function" && typeof env.DB.batch === "function";
}

// This is called only for a fresh, valid Launch List form submission, never for
// appointment, accessibility, Pexy, or historical records. D1 batch is atomic.
export async function recordLaunchSignup(
  env, requestStatement, email, consentVersion, phoneConsent, phoneConsentVersion,
  now = new Date(), queueEmail = false,
) {
  const nowIso = now.toISOString();
  const consentEventId = crypto.randomUUID();
  const statements = [
    requestStatement,
    env.DB.prepare(SIGNUP_CONSENT_EVENT_SQL).bind(
      consentEventId, consentVersion, phoneConsent ? 1 : 0,
      phoneConsentVersion, nowIso, email,
    ),
  ];
  if (queueEmail) {
    const emailHash = await lookupHash(env, email);
    const dayKey = Math.floor(now.getTime() / 86_400_000);
    statements.push(
      env.DB.prepare(SIGNUP_SUBSCRIPTION_SQL).bind(
        crypto.randomUUID(), emailHash, consentVersion, nowIso, nowIso, nowIso, email,
      ),
      env.DB.prepare(SIGNUP_VERIFY_SQL).bind(
        crypto.randomUUID(), emailHash + ":verify:" + dayKey, nowIso,
        new Date(now.getTime() + VERIFY_LIFETIME_MS).toISOString(),
        nowIso, nowIso, emailHash, nowIso,
      ),
    );
  }
  await env.DB.batch(statements);
}

async function confirmSubscription(env, id, token, now = new Date()) {
  if (!(await verifyLinkToken(env.LAUNCH_EMAIL_TOKEN_SECRET, "verify", id, token))) return false;
  const verification = await env.DB.prepare(
    "SELECT o.subscription_id, o.expires_at, s.status FROM launch_email_outbox o "
      + "JOIN launch_email_subscriptions s ON s.id = o.subscription_id "
      + "WHERE o.id = ? AND o.stage = 'verify'",
  ).bind(id).first();
  if (!verification || verification.expires_at <= now.toISOString()
    || !["pending", "confirmed"].includes(verification.status)) return false;
  const subscriptionId = verification.subscription_id;
  const nowIso = now.toISOString();
  const stageRows = [
    ["welcome", nowIso],
    ["day3", new Date(now.getTime() + 3 * 86_400_000).toISOString()],
    ["day10", new Date(now.getTime() + 10 * 86_400_000).toISOString()],
  ];
  await env.DB.batch([
    env.DB.prepare(
      "UPDATE launch_email_subscriptions SET status = 'confirmed', confirmed_at = COALESCE(confirmed_at, ?), "
        + "updated_at = ? WHERE id = ? AND status = 'pending' "
        + "AND NOT EXISTS (SELECT 1 FROM launch_email_suppressions x "
        + "WHERE x.email_hash = launch_email_subscriptions.email_hash)",
    ).bind(nowIso, nowIso, subscriptionId),
    env.DB.prepare(
      "UPDATE launch_email_outbox SET status = 'suppressed', updated_at = ? "
        + "WHERE subscription_id = ? AND stage = 'verify' AND status = 'pending'",
    ).bind(nowIso, subscriptionId),
    ...stageRows.map(([stage, dueAt]) => env.DB.prepare(STAGE_INSERT_SQL).bind(
      crypto.randomUUID(), stage, subscriptionId + ":" + stage, dueAt,
      nowIso, nowIso, subscriptionId,
    )),
  ]);
  return true;
}

async function unsubscribe(env, id, token, now = new Date()) {
  if (!(await verifyLinkToken(env.LAUNCH_EMAIL_TOKEN_SECRET, "unsubscribe", id, token))) return false;
  const nowIso = now.toISOString();
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO launch_email_suppressions (email_hash, reason, created_at) "
        + "SELECT email_hash, 'unsubscribe', ? FROM launch_email_subscriptions WHERE id = ? "
        + "ON CONFLICT(email_hash) DO NOTHING",
    ).bind(nowIso, id),
    env.DB.prepare(
      "UPDATE launch_email_subscriptions SET status = 'unsubscribed', updated_at = ? WHERE id = ?",
    ).bind(nowIso, id),
    env.DB.prepare(
      "UPDATE launch_email_outbox SET status = 'suppressed', updated_at = ? "
        + "WHERE subscription_id = ? AND status IN ('pending', 'claimed')",
    ).bind(nowIso, id),
  ]);
  return true;
}

export async function handleLaunchEmailAction(request, env) {
  if (!launchEmailActionConfigured(env)) return textResponse(503, "Email confirmation is unavailable.");
  const url = new URL(request.url);
  if (url.protocol !== "https:" || url.hostname !== "apexwellnessnwi.com") {
    return textResponse(400, "Invalid request.");
  }
  const isVerify = url.pathname === "/api/launch-email/verify";
  const isUnsubscribe = url.pathname === "/api/launch-email/unsubscribe";
  if (!isVerify && !isUnsubscribe) return textResponse(404, "Not found.");
  let id;
  let token;
  if (request.method === "GET") {
    id = url.searchParams.get("id");
    token = url.searchParams.get("token");
    if (!validId(id) || !validTokenShape(token)) return page("Link unavailable", "This link cannot be used.", null);
    return isVerify
      ? page("Confirm your email", "Confirm to receive Apex opening updates.", url.pathname, id, token, "Confirm email")
      : page("Unsubscribe", "Stop Apex opening-update emails.", url.pathname, id, token, "Unsubscribe");
  }
  if (request.method !== "POST") return textResponse(405, "Method not allowed.");
  if (!/^application\/x-www-form-urlencoded(?:;|$)/i.test(request.headers.get("Content-Type") || "")) {
    return textResponse(415, "Unsupported request.");
  }
  const body = await readLimitedText(request, 2_048);
  if (body === null) return textResponse(413, "Request too large.");
  try {
    const form = new URLSearchParams(body);
    id = form.get("id");
    token = form.get("token");
  } catch {
    return textResponse(400, "Invalid request.");
  }
  const succeeded = isVerify
    ? await confirmSubscription(env, id, token)
    : await unsubscribe(env, id, token);
  if (!succeeded) return page("Link unavailable", "This link has expired or cannot be used.", null);
  return isVerify
    ? page("You're confirmed", "Thanks. You'll receive Apex opening updates when they're ready.", null)
    : page("You're unsubscribed", "Apex opening-update emails have stopped.", null);
}

function dueRowsSql(includeFollowups) {
  return "SELECT o.*, s.email_hash, s.status AS subscription_status, r.email "
    + "FROM launch_email_outbox o "
    + "JOIN launch_email_subscriptions s ON s.id = o.subscription_id "
    + "JOIN founding_consultation_requests r ON r.id = s.request_id "
    + "WHERE o.status = 'pending' AND o.due_at <= ? "
    + (includeFollowups ? "" : "AND o.stage IN ('verify', 'welcome') ")
    + "ORDER BY o.due_at LIMIT ?";
}

async function suppressOutbox(db, id, nowIso) {
  await db.prepare(
    "UPDATE launch_email_outbox SET status = 'suppressed', updated_at = ? "
      + "WHERE id = ? AND status IN ('pending', 'claimed')",
  ).bind(nowIso, id).run();
}

async function retryOrStop(db, row, now, statusCode = null) {
  const elapsed = now.getTime() - new Date(row.first_attempt_at || now).getTime();
  const attempts = Number(row.attempts);
  const retryable = attempts < 4 && elapsed < RETRY_WINDOW_MS;
  const delayMs = [60_000, 5 * 60_000, 15 * 60_000][Math.min(attempts - 1, 2)];
  const nowIso = now.toISOString();
  await db.prepare(
    "UPDATE launch_email_outbox SET status = ?, due_at = ?, lease_until = NULL, "
      + "last_http_status = ?, updated_at = ? WHERE id = ? AND status = 'claimed'",
  ).bind(
    retryable ? "pending" : "ambiguous",
    retryable ? new Date(now.getTime() + delayMs).toISOString() : nowIso,
    statusCode, nowIso, row.id,
  ).run();
}

async function sendOne(env, row, now, sendFetch) {
  const nowIso = now.toISOString();
  if (row.first_attempt_at
    && (now.getTime() - new Date(row.first_attempt_at).getTime() >= RETRY_WINDOW_MS
      || Number(row.attempts) >= 4)) {
    await env.DB.prepare(
      "UPDATE launch_email_outbox SET status = 'ambiguous', updated_at = ? "
        + "WHERE id = ? AND status = 'pending'",
    ).bind(nowIso, row.id).run();
    return "ambiguous";
  }
  const suppression = await env.DB.prepare(
    "SELECT 1 FROM launch_email_suppressions WHERE email_hash = ?",
  ).bind(row.email_hash).first();
  const shouldSend = row.stage === "verify"
    ? row.subscription_status === "pending" && row.expires_at > nowIso
    : row.subscription_status === "confirmed";
  if (!shouldSend || suppression) {
    await suppressOutbox(env.DB, row.id, nowIso);
    return "suppressed";
  }
  if ((row.stage === "day3" || row.stage === "day10")
    && env.LAUNCH_EMAIL_FOLLOWUPS_ENABLED !== "true") return "held";

  const claimed = await env.DB.prepare(
    "UPDATE launch_email_outbox SET status = 'claimed', attempts = attempts + 1, "
      + "first_attempt_at = COALESCE(first_attempt_at, ?), lease_until = ?, updated_at = ? "
      + "WHERE id = ? AND status = 'pending' RETURNING attempts, first_attempt_at",
  ).bind(nowIso, new Date(now.getTime() + 2 * 60_000).toISOString(), nowIso, row.id).first();
  if (!claimed) return "skipped";
  row.attempts = claimed.attempts;
  row.first_attempt_at = claimed.first_attempt_at;

  // Check suppression again after claiming, before contacting the provider.
  const current = await env.DB.prepare(
    "SELECT s.status, x.reason FROM launch_email_subscriptions s "
      + "LEFT JOIN launch_email_suppressions x ON x.email_hash = s.email_hash WHERE s.id = ?",
  ).bind(row.subscription_id).first();
  const stillEligible = row.stage === "verify" ? current?.status === "pending" : current?.status === "confirmed";
  if (!stillEligible || current?.reason) {
    await suppressOutbox(env.DB, row.id, nowIso);
    return "suppressed";
  }

  const verifyToken = row.stage === "verify"
    ? await linkToken(env.LAUNCH_EMAIL_TOKEN_SECRET, "verify", row.id) : null;
  const unsubscribeToken = row.stage !== "verify"
    ? await linkToken(env.LAUNCH_EMAIL_TOKEN_SECRET, "unsubscribe", row.subscription_id) : null;
  const links = {
    verify: verifyToken
      ? ORIGIN + "/api/launch-email/verify?id=" + row.id + "&token=" + verifyToken : null,
    unsubscribe: unsubscribeToken
      ? ORIGIN + "/api/launch-email/unsubscribe?id=" + row.subscription_id + "&token=" + unsubscribeToken : null,
  };
  const content = renderLaunchEmail(row.stage, links);
  const body = {
    sender: { name: "Apex Wellness", email: env.BREVO_SENDER_EMAIL },
    replyTo: { email: env.BREVO_REPLY_TO_EMAIL },
    // Brevo honors this after per-contact pixel consent is enabled on the
    // account; account configuration is an explicit activation gate.
    to: [{ email: row.email, contactPixelTrackingConsent: false }],
    subject: content.subject,
    textContent: content.textContent,
    htmlContent: content.htmlContent,
    tags: ["apex-launch-" + row.id],
    headers: { IdempotencyKey: row.id },
  };
  let response;
  try {
    response = await sendFetch(BREVO_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify(body),
    });
  } catch {
    await retryOrStop(env.DB, row, now);
    return "retry";
  }
  if (response.status === 201) {
    let providerId = null;
    try {
      const receipt = await response.json();
      if (typeof receipt.messageId === "string" && receipt.messageId.length <= 255) {
        providerId = receipt.messageId;
      }
    } catch {
      // API acceptance is still recorded; delivery requires a later webhook.
    }
    await env.DB.prepare(
      "UPDATE launch_email_outbox SET status = 'accepted', provider_message_id = ?, "
        + "lease_until = NULL, last_http_status = 201, updated_at = ? "
        + "WHERE id = ? AND status = 'claimed'",
    ).bind(providerId, nowIso, row.id).run();
    return "accepted";
  }
  if (response.status === 400) {
    let code = null;
    try {
      const error = await response.json();
      code = error?.code;
    } catch {
      // Treat unknown 400 responses as non-retryable below.
    }
    if (code === "duplicate_parameter") {
      // Brevo says this idempotency key was already processed. The original
      // response may have been lost; await a tagged webhook or manual review.
      await env.DB.prepare(
        "UPDATE launch_email_outbox SET status = 'ambiguous', lease_until = NULL, "
          + "last_http_status = 400, updated_at = ? WHERE id = ? AND status = 'claimed'",
      ).bind(nowIso, row.id).run();
      return "ambiguous";
    }
  }
  if (response.status === 429 || response.status >= 500) {
    await retryOrStop(env.DB, row, now, response.status);
    return "retry";
  }
  await env.DB.prepare(
    "UPDATE launch_email_outbox SET status = 'failed', lease_until = NULL, "
      + "last_http_status = ?, updated_at = ? WHERE id = ? AND status = 'claimed'",
  ).bind(response.status, nowIso, row.id).run();
  return "failed";
}

export async function runLaunchEmailQueue(env, now = new Date(), sendFetch = fetch) {
  if (!launchEmailConfigured(env)) return { processed: 0, disabled: true };
  const nowIso = now.toISOString();
  const cutoff = new Date(now.getTime() - RETRY_WINDOW_MS).toISOString();
  await env.DB.batch([
    env.DB.prepare(
      "UPDATE launch_email_outbox SET status = 'pending', due_at = ?, lease_until = NULL, updated_at = ? "
        + "WHERE status = 'claimed' AND lease_until < ? AND first_attempt_at > ? AND attempts < 4",
    ).bind(nowIso, nowIso, nowIso, cutoff),
    env.DB.prepare(
      "UPDATE launch_email_outbox SET status = 'ambiguous', lease_until = NULL, updated_at = ? "
        + "WHERE status = 'claimed' AND lease_until < ? "
        + "AND (first_attempt_at <= ? OR attempts >= 4)",
    ).bind(nowIso, nowIso, cutoff),
  ]);
  const dayStart = nowIso.slice(0, 10) + "T00:00:00.000Z";
  const countRow = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM launch_email_outbox "
      + "WHERE first_attempt_at >= ?",
  ).bind(dayStart).first();
  const available = Math.max(0, DAILY_CAP - Number(countRow?.count || 0));
  if (available === 0) return { processed: 0, dailyCap: true };
  const due = await env.DB.prepare(
    dueRowsSql(env.LAUNCH_EMAIL_FOLLOWUPS_ENABLED === "true"),
  ).bind(nowIso, Math.min(BATCH_SIZE, available)).all();
  const outcomes = [];
  for (const row of due.results || []) {
    outcomes.push(await sendOne(env, row, now, sendFetch));
  }
  return { processed: outcomes.length, outcomes };
}

export async function handleLaunchEmailWebhook(request, env) {
  if (!launchEmailWebhookConfigured(env)) return textResponse(503, "Unavailable.");
  if (new URL(request.url).protocol !== "https:") return textResponse(400, "Invalid request.");
  if (request.method !== "POST") return textResponse(405, "Method not allowed.");
  if (!safeEqual(request.headers.get("Authorization"), "Bearer " + env.BREVO_WEBHOOK_TOKEN)) {
    return textResponse(403, "Forbidden.");
  }
  if (!/^application\/json(?:;|$)/i.test(request.headers.get("Content-Type") || "")) {
    return textResponse(415, "Unsupported request.");
  }
  const body = await readLimitedText(request, 16_384);
  if (body === null) return textResponse(413, "Too large.");
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return textResponse(400, "Invalid payload.");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return textResponse(400, "Invalid payload.");
  }
  const event = payload.event;
  const eventTypes = new Set(["delivered", "hardBounce", "spam", "unsubscribed", "invalid", "blocked"]);
  if (!eventTypes.has(event)) return textResponse(204, "");
  const messageId = typeof payload["message-id"] === "string" ? payload["message-id"] : null;
  const tag = Array.isArray(payload.tags)
    ? payload.tags.find((value) => typeof value === "string" && /^apex-launch-[0-9a-f-]{36}$/i.test(value))
    : null;
  const outboxId = tag?.slice("apex-launch-".length) || null;
  if (!messageId && !outboxId) return textResponse(204, "");
  const nowIso = new Date().toISOString();
  const fingerprint = await sha256([event, messageId || "", outboxId || "", String(payload.ts_epoch || "")].join("|"));
  const row = await env.DB.prepare(
    "SELECT o.id, s.email_hash FROM launch_email_outbox o "
      + "JOIN launch_email_subscriptions s ON s.id = o.subscription_id "
      + "WHERE (o.id = ? OR (o.provider_message_id IS NOT NULL AND o.provider_message_id = ?)) LIMIT 1",
  ).bind(outboxId, messageId).first();
  if (!row) return textResponse(204, "");
  await env.DB.prepare(
    "INSERT INTO launch_email_webhook_events (fingerprint, outbox_id, event_type, created_at) "
      + "VALUES (?, ?, ?, ?) ON CONFLICT(fingerprint) DO NOTHING",
  ).bind(fingerprint, row.id, event, nowIso).run();
  if (event === "delivered") {
    await env.DB.prepare(
      "UPDATE launch_email_outbox SET status = 'delivered', updated_at = ? "
        + "WHERE id = ? AND status IN ('claimed', 'accepted', 'ambiguous')",
    ).bind(nowIso, row.id).run();
    return textResponse(204, "");
  }
  const reason = event === "hardBounce" ? "hard_bounce" : event;
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO launch_email_suppressions (email_hash, reason, created_at) VALUES (?, ?, ?) "
        + "ON CONFLICT(email_hash) DO NOTHING",
    ).bind(row.email_hash, reason, nowIso),
    env.DB.prepare(
      "UPDATE launch_email_subscriptions SET status = ?, updated_at = ? WHERE email_hash = ?",
    ).bind(event === "unsubscribed" ? "unsubscribed" : "suppressed", nowIso, row.email_hash),
    env.DB.prepare(
      "UPDATE launch_email_outbox SET status = 'suppressed', updated_at = ? "
        + "WHERE subscription_id = (SELECT id FROM launch_email_subscriptions WHERE email_hash = ?) "
        + "AND status IN ('pending', 'claimed')",
    ).bind(nowIso, row.email_hash),
  ]);
  return textResponse(204, "");
}

const ALLOWED_ORIGINS = new Set([
  "https://apexwellnessnwi.com",
  "https://www.apexwellnessnwi.com",
]);

const ALLOWED_HOSTNAMES = new Set([
  "apexwellnessnwi.com",
  "www.apexwellnessnwi.com",
]);

const ALLOWED_FIELDS = new Set([
  "full_name",
  "email",
  "contact_consent",
  "consent_version",
  "accessibility_request",
  "website",
  "form_started_at",
  "turnstile_token",
]);

const MAX_BODY_BYTES = 8 * 1024;
const MIN_FORM_TIME_MS = 750;
const RATE_WINDOW_MS = 60 * 60 * 1_000;
const IP_RATE_LIMIT = 10;
const EMAIL_RATE_LIMIT = 5;
const RATE_LIMIT_RETENTION_MS = 2 * RATE_WINDOW_MS;

const RATE_LIMIT_SQL = `
  INSERT INTO priority_rate_limits (
    key_type,
    key_hash,
    window_started_at,
    request_count,
    updated_at
  ) VALUES (?, ?, ?, 1, ?)
  ON CONFLICT (key_type, key_hash, window_started_at)
  DO UPDATE SET
    request_count = request_count + 1,
    updated_at = excluded.updated_at
  RETURNING request_count
`;

const INSERT_REQUEST_SQL = `
  INSERT INTO founding_consultation_requests (
    id,
    full_name,
    email,
    request_kind,
    contact_consent,
    consent_version,
    consented_at,
    ip_hash,
    user_agent,
    source_origin,
    created_at
  ) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
  ON CONFLICT (email, request_kind) DO UPDATE SET
    full_name = excluded.full_name,
    contact_consent = excluded.contact_consent,
    consent_version = excluded.consent_version,
    consented_at = excluded.consented_at,
    ip_hash = excluded.ip_hash,
    user_agent = excluded.user_agent,
    source_origin = excluded.source_origin,
    created_at = excluded.created_at
`;

const PRUNE_RATE_LIMITS_SQL = `
  DELETE FROM priority_rate_limits
  WHERE window_started_at < ?
`;

function responseHeaders(origin, extra = {}) {
  const headers = {
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "Content-Type": "application/json; charset=utf-8",
    "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=15552000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    ...extra,
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }

  return headers;
}

function json(origin, status, body, extraHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(origin, extraHeaders),
  });
}

function success(origin) {
  return json(origin, 200, {
    ok: true,
    message: "Thank you. Your request was received.",
  });
}

function failure(origin, status, message, fields, extraHeaders) {
  const body = { ok: false, message };
  if (fields?.length) body.fields = fields;
  return json(origin, status, body, extraHeaders);
}

function normalizeText(value) {
  return value.normalize("NFC").replace(/\s+/gu, " ").trim();
}

function normalizeName(value) {
  if (typeof value !== "string") return null;
  const name = normalizeText(value);
  if (name.length < 2 || name.length > 100) return null;
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .,'\u2019-]*$/u.test(name)) return null;
  return name;
}

function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.normalize("NFC").trim().toLowerCase();
  if (email.length < 3 || email.length > 254) return null;
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(email)) {
    return null;
  }
  return email;
}

function normalizeUserAgent(value) {
  if (!value) return "unknown";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 512) || "unknown";
}

function validatePayload(payload, expectedConsentVersion) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { fields: ["form"] };
  }

  const keys = Object.keys(payload);
  if (keys.some((key) => !ALLOWED_FIELDS.has(key))) {
    return { fields: ["form"] };
  }

  const fields = [];
  const fullName = normalizeName(payload.full_name);
  const email = normalizeEmail(payload.email);
  const consentVersion = typeof payload.consent_version === "string"
    && /^[A-Za-z0-9][A-Za-z0-9._-]{0,39}$/.test(payload.consent_version)
    ? payload.consent_version
    : null;
  const accessibilityRequest = payload.accessibility_request === undefined
    ? false
    : payload.accessibility_request;

  if (!fullName) fields.push("full_name");
  if (!email) fields.push("email");
  if (payload.contact_consent !== true) fields.push("contact_consent");
  if (!consentVersion || consentVersion !== expectedConsentVersion) fields.push("consent_version");
  if (typeof accessibilityRequest !== "boolean") fields.push("accessibility_request");
  if (payload.website !== undefined && typeof payload.website !== "string") fields.push("website");
  if (payload.website?.length > 200) fields.push("website");
  if (!Number.isSafeInteger(payload.form_started_at)) fields.push("form_started_at");
  if (payload.turnstile_token !== undefined
    && (typeof payload.turnstile_token !== "string" || payload.turnstile_token.length > 2_048)) {
    fields.push("turnstile_token");
  }

  return {
    fields: [...new Set(fields)],
    value: fields.length ? null : {
      fullName,
      email,
      requestKind: accessibilityRequest ? "website_accessibility" : "founding_consultation",
      consentVersion,
      website: (payload.website || "").trim(),
      formStartedAt: payload.form_started_at,
      turnstileToken: payload.turnstile_token?.trim() || "",
    },
  };
}

function isTooFast(value, now) {
  const elapsed = now - value.formStartedAt;
  return elapsed >= 0 && elapsed < MIN_FORM_TIME_MS;
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function resultCount(result) {
  const value = result?.results?.[0]?.request_count;
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

async function consumeRateLimits(db, ipHash, emailHash, now, nowIso) {
  const windowStartedAt = Math.floor(now / RATE_WINDOW_MS) * RATE_WINDOW_MS;
  const statements = [
    db.prepare(RATE_LIMIT_SQL).bind("ip", ipHash, windowStartedAt, nowIso),
    db.prepare(RATE_LIMIT_SQL).bind("email", emailHash, windowStartedAt, nowIso),
    db.prepare(PRUNE_RATE_LIMITS_SQL).bind(windowStartedAt - RATE_LIMIT_RETENTION_MS),
  ];
  const results = await db.batch(statements);
  const ipCount = resultCount(results?.[0]);
  const emailCount = resultCount(results?.[1]);

  if (ipCount === null || emailCount === null) {
    throw new Error("D1 did not return rate-limit counters");
  }

  return {
    limited: ipCount > IP_RATE_LIMIT || emailCount > EMAIL_RATE_LIMIT,
    retryAfter: Math.max(1, Math.ceil((windowStartedAt + RATE_WINDOW_MS - now) / 1_000)),
  };
}

async function verifyTurnstile(secret, token, remoteIp) {
  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: remoteIp,
  });

  let turnstileResponse;
  try {
    turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch {
    return { available: false, valid: false };
  }

  if (!turnstileResponse.ok) return { available: false, valid: false };

  try {
    const result = await turnstileResponse.json();
    const hostnameAllowed = typeof result.hostname === "string" && ALLOWED_HOSTNAMES.has(result.hostname);
    return { available: true, valid: result.success === true && hostnameAllowed };
  } catch {
    return { available: false, valid: false };
  }
}

async function readJsonBody(request) {
  const declaredLength = request.headers.get("Content-Length");
  if (declaredLength !== null) {
    const length = Number(declaredLength);
    if (!Number.isInteger(length) || length < 0 || length > MAX_BODY_BYTES) {
      return { error: "too_large" };
    }
  }

  if (!request.body) return { error: "invalid_json" };

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return { error: "too_large" };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  chunks.forEach((chunk) => {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  });

  try {
    return { value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) };
  } catch {
    return { error: "invalid_json" };
  }
}

async function handlePost(context, origin) {
  const { request, env } = context;
  const contentType = request.headers.get("Content-Type") || "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    return failure(origin, 415, "Submit the form as JSON.");
  }

  if (!env?.DB || typeof env.DB.prepare !== "function" || typeof env.DB.batch !== "function"
    || typeof env.IP_HASH_SALT !== "string" || env.IP_HASH_SALT.length < 16
    || typeof env.FOUNDING_CONSENT_VERSION !== "string"
    || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,39}$/.test(env.FOUNDING_CONSENT_VERSION)) {
    return failure(origin, 503, "Consultation requests are temporarily unavailable. Please try again later.");
  }

  const remoteIp = request.headers.get("CF-Connecting-IP")?.trim();
  if (!remoteIp || remoteIp.length > 64) {
    return failure(origin, 503, "Consultation requests are temporarily unavailable. Please try again later.");
  }

  const parsed = await readJsonBody(request);
  if (parsed.error === "too_large") {
    return failure(origin, 413, "The submitted form is too large.");
  }
  if (parsed.error) {
    return failure(origin, 400, "The submitted form could not be read.");
  }

  const validation = validatePayload(parsed.value, env.FOUNDING_CONSENT_VERSION);
  if (validation.fields.length) {
    return failure(origin, 422, "Please check the highlighted fields and try again.", validation.fields);
  }

  const now = Date.now();
  if (validation.value.website) return success(origin);
  if (isTooFast(validation.value, now)) {
    return failure(origin, 422, "Please wait a moment and try again.", ["form_started_at"]);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    if (!validation.value.turnstileToken) {
      return failure(origin, 422, "Please complete the security check and try again.", ["turnstile_token"]);
    }
    const turnstile = await verifyTurnstile(
      env.TURNSTILE_SECRET_KEY,
      validation.value.turnstileToken,
      remoteIp,
    );
    if (!turnstile.available) {
      return failure(origin, 503, "The security check is temporarily unavailable. Please try again.");
    }
    if (!turnstile.valid) {
      return failure(origin, 422, "Please complete the security check and try again.", ["turnstile_token"]);
    }
  }

  const nowIso = new Date(now).toISOString();
  const ipHash = await sha256(`${env.IP_HASH_SALT}:founding-consultation:ip:${remoteIp}`);
  const emailHash = await sha256(`${env.IP_HASH_SALT}:founding-consultation:email:${validation.value.email}`);
  const rate = await consumeRateLimits(env.DB, ipHash, emailHash, now, nowIso);

  if (rate.limited) {
    return failure(
      origin,
      429,
      "Too many requests were received. Please wait and try again.",
      undefined,
      { "Retry-After": String(rate.retryAfter) },
    );
  }

  await env.DB.prepare(INSERT_REQUEST_SQL).bind(
    crypto.randomUUID(),
    validation.value.fullName,
    validation.value.email,
    validation.value.requestKind,
    validation.value.consentVersion,
    nowIso,
    ipHash,
    normalizeUserAgent(request.headers.get("User-Agent")),
    origin,
    nowIso,
  ).run();

  // Duplicate email/request-kind pairs refresh the consent record and receive the
  // same response, avoiding membership disclosure while preserving renewed consent.
  return success(origin);
}

export async function onRequest(context) {
  const { request } = context;
  const origin = request.headers.get("Origin") || "";

  if (new URL(request.url).protocol !== "https:") {
    return failure(origin, 400, "A secure HTTPS connection is required.");
  }

  if (!ALLOWED_ORIGINS.has(origin)) {
    return failure("", 403, "This request is not allowed.");
  }

  if (request.method === "OPTIONS") {
    const requestedMethod = request.headers.get("Access-Control-Request-Method");
    if (requestedMethod && requestedMethod.toUpperCase() !== "POST") {
      return failure(origin, 405, "This method is not allowed.", undefined, { Allow: "POST, OPTIONS" });
    }
    return new Response(null, {
      status: 204,
      headers: responseHeaders(origin, {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Max-Age": "600",
      }),
    });
  }

  if (request.method !== "POST") {
    return failure(origin, 405, "This method is not allowed.", undefined, { Allow: "POST, OPTIONS" });
  }

  try {
    return await handlePost(context, origin);
  } catch (error) {
    console.error("Founding consultation endpoint failure", error instanceof Error ? error.message : "unknown error");
    return failure(origin, 500, "Consultation requests are temporarily unavailable. Please try again later.");
  }
}

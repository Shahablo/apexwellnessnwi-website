const ALLOWED_ORIGINS = new Set([
  'https://apexwellnessnwi.com',
  'https://www.apexwellnessnwi.com',
]);
const ALLOWED_HOSTNAMES = new Set(['apexwellnessnwi.com', 'www.apexwellnessnwi.com']);
const ALLOWED_FIELDS = new Set([
  'full_name', 'email', 'question', 'contact_consent', 'consent_version',
  'form_started_at', 'website', 'turnstile_token',
]);
const CONSENT_VERSION = 'pexy-followup-2026-10-26';
const MAX_BODY_BYTES = 4 * 1024;
const MIN_FORM_TIME_MS = 750;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const IP_RATE_LIMIT = 10;
const EMAIL_RATE_LIMIT = 5;

const RATE_LIMIT_SQL = `
  INSERT INTO priority_rate_limits (
    key_type, key_hash, window_started_at, request_count, updated_at
  ) VALUES (?, ?, ?, 1, ?)
  ON CONFLICT (key_type, key_hash, window_started_at)
  DO UPDATE SET request_count = request_count + 1, updated_at = excluded.updated_at
  RETURNING request_count
`;
const PRUNE_RATE_LIMITS_SQL = `
  DELETE FROM priority_rate_limits WHERE window_started_at < ?
`;
const INSERT_QUESTION_SQL = `
  INSERT INTO pexy_followup_requests (
    id, full_name, email, question, contact_consent, consent_version,
    consented_at, ip_hash, source_origin, created_at
  ) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
`;

function headers(origin, extra = {}) {
  const result = {
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    'Content-Type': 'application/json; charset=utf-8',
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    ...extra,
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    result['Access-Control-Allow-Origin'] = origin;
    result.Vary = 'Origin';
  }
  return result;
}

function json(origin, status, body, extra) {
  return new Response(JSON.stringify(body), { status, headers: headers(origin, extra) });
}

function failure(origin, status, message, fields, extra) {
  return json(origin, status, { ok: false, message, ...(fields ? { fields } : {}) }, extra);
}

function normalizeName(value) {
  if (typeof value !== 'string') return null;
  const name = value.normalize('NFC').replace(/\s+/gu, ' ').trim();
  if (name.length < 2 || name.length > 100) return null;
  return /^[\p{L}\p{M}][\p{L}\p{M} .,'\u2019-]*$/u.test(name) ? name : null;
}

function normalizeEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.normalize('NFC').trim().toLowerCase();
  if (email.length < 3 || email.length > 254) return null;
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(email)
    ? email : null;
}

// This catches obvious personal medical details, not every possible sensitive
// disclosure. The separate form must also tell visitors not to enter them.
function looksSensitive(question) {
  return /\b(?:i\s+(?:have|had|take|took|was diagnosed|am taking)|my\s+(?:child|spouse)\s+(?:has|have|had|takes?|was diagnosed))\b/i.test(question)
    || /\b(?:my|our)\s+(?:symptoms?|diagnos(?:is|es)|labs?|test results?|medications?|prescriptions?|dose|medical (?:record|history)|treatment history|blood pressure)\b/i.test(question)
    || /\b(?:i|my child|my spouse)\s+(?:am|is|was)\s+(?:pregnant|diagnosed|taking medication)\b/i.test(question)
    || /\b(?:ssn|social security|date of birth|dob|insurance (?:number|id)|member id|medical record number)\b/i.test(question)
    || /\b(?:chest pain|trouble breathing|overdose|suicid\w*)\b/i.test(question)
    || /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(question)
    || /(?:\+?1[\s.-]?)?\(?[2-9]\d{2}\)?[\s.-]?[2-9]\d{2}[\s.-]?\d{4}/.test(question);
}

function validate(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return { fields: ['form'] };
  if (Object.keys(payload).some((key) => !ALLOWED_FIELDS.has(key))) return { fields: ['form'] };
  const fields = [];
  const fullName = normalizeName(payload.full_name);
  const email = normalizeEmail(payload.email);
  const question = typeof payload.question === 'string'
    ? payload.question.normalize('NFKC').replace(/\s+/gu, ' ').trim() : '';
  if (!fullName) fields.push('full_name');
  if (!email) fields.push('email');
  if (question.length < 8 || question.length > 500 || /[\u0000-\u001f\u007f]/.test(question)) fields.push('question');
  if (payload.contact_consent !== true) fields.push('contact_consent');
  if (payload.consent_version !== CONSENT_VERSION) fields.push('consent_version');
  if (!Number.isSafeInteger(payload.form_started_at)) fields.push('form_started_at');
  if (payload.website !== undefined && (typeof payload.website !== 'string' || payload.website.length > 200)) fields.push('website');
  if (payload.turnstile_token !== undefined &&
      (typeof payload.turnstile_token !== 'string' || payload.turnstile_token.length > 2048)) fields.push('turnstile_token');
  if (fields.length) return { fields: [...new Set(fields)] };
  if (looksSensitive(question)) return { fields: ['question'], sensitive: true };
  return {
    fields: [],
    value: {
      fullName, email, question,
      startedAt: payload.form_started_at,
      website: (payload.website || '').trim(),
      turnstileToken: payload.turnstile_token?.trim() || '',
    },
  };
}

async function readJson(request) {
  const declaredLength = request.headers.get('Content-Length');
  if (declaredLength !== null) {
    const length = Number(declaredLength);
    if (!Number.isInteger(length) || length < 0 || length > MAX_BODY_BYTES) return { error: 'too_large' };
  }
  if (!request.body) return { error: 'invalid' };
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        return { error: 'too_large' };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return { value: JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) };
  } catch {
    return { error: 'invalid' };
  }
}

async function sha256(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function verifyTurnstile(secret, token, remoteIp) {
  let response;
  try {
    response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: remoteIp }),
    });
  } catch {
    return { available: false, valid: false };
  }
  if (!response.ok) return { available: false, valid: false };
  try {
    const result = await response.json();
    return { available: true, valid: result.success === true && ALLOWED_HOSTNAMES.has(result.hostname) };
  } catch {
    return { available: false, valid: false };
  }
}

async function consumeRateLimits(db, ipHash, emailHash, now, nowIso) {
  const windowStart = Math.floor(now / RATE_WINDOW_MS) * RATE_WINDOW_MS;
  const results = await db.batch([
    db.prepare(RATE_LIMIT_SQL).bind('ip', ipHash, windowStart, nowIso),
    db.prepare(RATE_LIMIT_SQL).bind('email', emailHash, windowStart, nowIso),
    db.prepare(PRUNE_RATE_LIMITS_SQL).bind(windowStart - 2 * RATE_WINDOW_MS),
  ]);
  const ipCount = Number(results?.[0]?.results?.[0]?.request_count);
  const emailCount = Number(results?.[1]?.results?.[0]?.request_count);
  if (!Number.isFinite(ipCount) || !Number.isFinite(emailCount)) throw new Error('Missing rate counters');
  return {
    limited: ipCount > IP_RATE_LIMIT || emailCount > EMAIL_RATE_LIMIT,
    retryAfter: Math.max(1, Math.ceil((windowStart + RATE_WINDOW_MS - now) / 1000)),
  };
}

async function handlePost(request, env, origin) {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type') || '')) {
    return failure(origin, 415, 'Submit the form as JSON.');
  }
  if (!env?.DB || typeof env.DB.prepare !== 'function' || typeof env.DB.batch !== 'function' ||
      typeof env.IP_HASH_SALT !== 'string' || env.IP_HASH_SALT.length < 16) {
    return failure(origin, 503, 'Website question follow-up is temporarily unavailable. Please try again later.');
  }
  const remoteIp = request.headers.get('CF-Connecting-IP')?.trim();
  if (!remoteIp || remoteIp.length > 64) {
    return failure(origin, 503, 'Website question follow-up is temporarily unavailable. Please try again later.');
  }
  const parsed = await readJson(request);
  if (parsed.error === 'too_large') return failure(origin, 413, 'The submitted form is too large.');
  if (parsed.error) return failure(origin, 400, 'The submitted form could not be read.');
  const validation = validate(parsed.value);
  if (validation.fields.length) {
    return failure(origin, 422,
      validation.sensitive
        ? 'Please keep personal or medical details out of this website form.'
        : 'Please check the highlighted fields and try again.', validation.fields);
  }
  const now = Date.now();
  if (validation.value.website) return json(origin, 200, { ok: true, message: 'Thank you. Apex received your general website question for follow-up.' });
  const elapsed = now - validation.value.startedAt;
  if (elapsed < MIN_FORM_TIME_MS || elapsed > MAX_FORM_AGE_MS) {
    return failure(origin, 422, 'Please refresh the form and try again.', ['form_started_at']);
  }
  if (env.TURNSTILE_SECRET_KEY) {
    if (!validation.value.turnstileToken) {
      return failure(origin, 422, 'Please complete the security check and try again.', ['turnstile_token']);
    }
    const turnstile = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, validation.value.turnstileToken, remoteIp);
    if (!turnstile.available) return failure(origin, 503, 'The security check is temporarily unavailable. Please try again.');
    if (!turnstile.valid) return failure(origin, 422, 'Please complete the security check and try again.', ['turnstile_token']);
  }
  const nowIso = new Date(now).toISOString();
  const ipHash = await sha256(`${env.IP_HASH_SALT}:pexy-followup:ip:${remoteIp}`);
  const emailHash = await sha256(`${env.IP_HASH_SALT}:pexy-followup:email:${validation.value.email}`);
  const rate = await consumeRateLimits(env.DB, ipHash, emailHash, now, nowIso);
  if (rate.limited) {
    return failure(origin, 429, 'Too many requests were received. Please wait and try again.', undefined,
      { 'Retry-After': String(rate.retryAfter) });
  }
  await env.DB.prepare(INSERT_QUESTION_SQL).bind(
    crypto.randomUUID(), validation.value.fullName, validation.value.email,
    validation.value.question, CONSENT_VERSION, nowIso, ipHash, origin, nowIso,
  ).run();
  // There is no public read route or email forwarding. Review stays in restricted D1.
  return json(origin, 200, { ok: true, message: 'Thank you. Apex received your general website question for follow-up.' });
}

export async function onRequest({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  if (new URL(request.url).protocol !== 'https:') return failure(origin, 400, 'A secure HTTPS connection is required.');
  if (!ALLOWED_ORIGINS.has(origin)) return failure('', 403, 'This request is not allowed.');
  if (request.method === 'OPTIONS') {
    const requestedMethod = request.headers.get('Access-Control-Request-Method');
    if (requestedMethod && requestedMethod.toUpperCase() !== 'POST') {
      return failure(origin, 405, 'This method is not allowed.', undefined, { Allow: 'POST, OPTIONS' });
    }
    return new Response(null, { status: 204, headers: headers(origin, {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '600',
    }) });
  }
  if (request.method !== 'POST') return failure(origin, 405, 'This method is not allowed.', undefined, { Allow: 'POST, OPTIONS' });
  try {
    return await handlePost(request, env, origin);
  } catch {
    // D1 errors can contain submitted values. Never log the error or payload.
    console.error('Pexy follow-up endpoint failure');
    return failure(origin, 500, 'Website question follow-up is temporarily unavailable. Please try again later.');
  }
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFile } from 'node:fs/promises';
import { handleWorkerRequest } from '../src/worker.mjs';

const ORIGIN = 'https://apexwellnessnwi.com';
const migrationNames = [
  '0001_priority.sql', '0002_founding_consultations.sql',
  '0003_appointment_contact_requests.sql', '0004_pexy_followup_requests.sql',
];
const migrations = await Promise.all(migrationNames.map((file) =>
  readFile(new URL(`../migrations/${file}`, import.meta.url), 'utf8')));

function database() {
  const sqlite = new DatabaseSync(':memory:');
  migrations.forEach((sql) => sqlite.exec(sql));
  const db = {
    prepare(sql) {
      return {
        sql,
        values: [],
        bind(...values) { this.values = values; return this; },
        async run() { sqlite.prepare(sql).run(...this.values); return { success: true }; },
      };
    },
    async batch(statements) {
      return statements.map(({ sql, values }) => ({ results: sqlite.prepare(sql).all(...values) }));
    },
  };
  return { sqlite, env: { DB: db, IP_HASH_SALT: 'synthetic-test-salt-123456789' } };
}

function request(changes = {}, options = {}) {
  const body = {
    full_name: 'Apex Test',
    email: 'synthetic@example.com',
    question: 'Can you tell me about parking options?',
    contact_consent: true,
    consent_version: 'pexy-followup-2026-10-26',
    form_started_at: Date.now() - 10000,
    website: '',
    ...changes,
  };
  return new Request(`${options.protocol || 'https:'}//apexwellnessnwi.com/api/pexy-followup`, {
    method: options.method || 'POST',
    headers: {
      Origin: options.origin === undefined ? ORIGIN : options.origin,
      'Content-Type': options.contentType || 'application/json',
      'CF-Connecting-IP': options.ip || '192.0.2.25',
    },
    body: options.rawBody === undefined ? JSON.stringify(body) : options.rawBody,
  });
}

test('stores a consented general question separately and returns no private fields', async () => {
  const { sqlite, env } = database();
  try {
    const response = await handleWorkerRequest(request(), env);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), ORIGIN);
    const publicResponse = await response.text();
    assert.match(publicResponse, /received your general website question/);
    assert.doesNotMatch(publicResponse, /synthetic@example\.com|Apex Test|parking options/);

    const saved = sqlite.prepare('SELECT * FROM pexy_followup_requests').get();
    assert.equal(saved.full_name, 'Apex Test');
    assert.equal(saved.email, 'synthetic@example.com');
    assert.equal(saved.question, 'Can you tell me about parking options?');
    assert.equal(saved.contact_consent, 1);
    assert.equal(saved.consent_version, 'pexy-followup-2026-10-26');
    assert.equal(saved.status, 'new');
    assert.equal(saved.ip_hash.length, 64);
    assert.doesNotMatch(JSON.stringify(saved), /192\.0\.2\.25/);
    assert.equal(sqlite.prepare('SELECT count(*) AS n FROM founding_consultation_requests').get().n, 0);
    assert.equal(sqlite.prepare('SELECT count(*) AS n FROM appointment_contact_requests').get().n, 0);

    const second = await handleWorkerRequest(request({ question: 'When will additional details be announced?' }), env);
    assert.equal(second.status, 200);
    assert.equal(sqlite.prepare('SELECT count(*) AS n FROM pexy_followup_requests').get().n, 2);
  } finally { sqlite.close(); }
});

test('rejects missing consent, unsupported fields, obvious medical details, and unsafe origins', async () => {
  const { sqlite, env } = database();
  try {
    for (const change of [
      { contact_consent: false },
      { consent_version: 'launch-list-2026-09-21' },
      { care_interest: 'weight' },
      { symptoms: 'private' },
      { question: 'My lab results came back high. What should I do?' },
      { question: 'I have diabetes and wanted to ask a question.' },
      { question: 'I take insulin every morning. Is that okay?' },
      { question: 'I was diagnosed with a condition last week.' },
      { question: 'My child has a medical condition.' },
      { question: 'My spouse has high blood pressure.' },
      { question: 'My date of birth is January 1, 2000.' },
      { question: 'I have chest pain right now.' },
      { question: 'What about email me at other@example.com?' },
      { question: 'Short?' },
      { question: 'X'.repeat(501) },
      { full_name: 'a' },
      { email: 'bad-address' },
    ]) {
      const response = await handleWorkerRequest(request(change), env);
      assert.equal(response.status, 422, JSON.stringify(change));
    }
    assert.equal((await handleWorkerRequest(request({}, { origin: 'https://other.example' }), env)).status, 403);
    assert.equal((await handleWorkerRequest(request({}, { protocol: 'http:' }), env)).status, 400);
    assert.equal(sqlite.prepare('SELECT count(*) AS n FROM pexy_followup_requests').get().n, 0);
  } finally { sqlite.close(); }
});

test('enforces timing, honeypot, body cap, and rate limits before storage', async () => {
  const { sqlite, env } = database();
  try {
    assert.equal((await handleWorkerRequest(request({ form_started_at: Date.now() }), env)).status, 422);
    assert.equal((await handleWorkerRequest(request({ form_started_at: Date.now() - 25 * 60 * 60 * 1000 }), env)).status, 422);
    assert.equal((await handleWorkerRequest(request({ website: 'bot.example' }), env)).status, 200);
    assert.equal(sqlite.prepare('SELECT count(*) AS n FROM pexy_followup_requests').get().n, 0);
    assert.equal((await handleWorkerRequest(request({}, { rawBody: ' '.repeat(4097) }), env)).status, 413);
    assert.equal((await handleWorkerRequest(request({}, { contentType: 'text/plain' }), env)).status, 415);
    for (let i = 0; i < 5; i++) {
      assert.equal((await handleWorkerRequest(request({ question: `General question number ${i + 1} about Apex?` }), env)).status, 200);
    }
    const limited = await handleWorkerRequest(request(), env);
    assert.equal(limited.status, 429);
    assert.ok(limited.headers.get('Retry-After'));
    assert.equal(sqlite.prepare('SELECT count(*) AS n FROM pexy_followup_requests').get().n, 5);
  } finally { sqlite.close(); }
});

test('never reports receipt after D1 failure or missing security configuration', async () => {
  const { sqlite, env } = database();
  try {
    assert.equal((await handleWorkerRequest(request(), { ...env, IP_HASH_SALT: '' })).status, 503);
    assert.equal((await handleWorkerRequest(request(), { ...env, TURNSTILE_SECRET_KEY: 'synthetic-key' })).status, 422);
    const failed = await handleWorkerRequest(request(), {
      ...env,
      DB: { prepare() { throw new Error('synthetic with private values'); }, batch() {} },
    });
    assert.equal(failed.status, 500);
    assert.deepEqual((await failed.json()).ok, false);
    assert.equal(sqlite.prepare('SELECT count(*) AS n FROM pexy_followup_requests').get().n, 0);
  } finally { sqlite.close(); }
});

test('only POST and expected preflight can reach the queue', async () => {
  for (const method of ['GET', 'HEAD', 'PUT']) {
    const response = await handleWorkerRequest(new Request(`${ORIGIN}/api/pexy-followup`, {
      method, headers: { Origin: ORIGIN },
    }), {});
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('Allow'), 'POST, OPTIONS');
  }
  const preflight = await handleWorkerRequest(new Request(`${ORIGIN}/api/pexy-followup`, {
    method: 'OPTIONS',
    headers: { Origin: ORIGIN, 'Access-Control-Request-Method': 'POST' },
  }), {});
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('Access-Control-Allow-Methods'), 'POST, OPTIONS');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFile } from 'node:fs/promises';
import { handleWorkerRequest } from '../src/worker.mjs';
import { schedulingUrl } from '../src/visit-planner.mjs';

const origin = 'https://apexwellnessnwi.com';
const migrations = await Promise.all(['0001_priority.sql', '0002_founding_consultations.sql', '0003_appointment_contact_requests.sql'].map(file => readFile(new URL(`../migrations/${file}`, import.meta.url), 'utf8')));
function database() {
  const sqlite = new DatabaseSync(':memory:');
  migrations.forEach(sql => sqlite.exec(sql));
  const db = {
    prepare(sql) {
      const statement = { sql, values: [], bind(...values) { this.values = values; return this; }, async run() { sqlite.prepare(sql).run(...this.values); return { success: true }; } };
      return statement;
    },
    async batch(statements) { return statements.map(({ sql, values }) => ({ results: sqlite.prepare(sql).all(...values) })); }
  };
  return { sqlite, env: { DB: db, IP_HASH_SALT: 'synthetic-test-salt-123456789', FOUNDING_CONSENT_VERSION: 'launch-list-2026-09-21', APPOINTMENT_REQUESTS_ENABLED: 'true' } };
}
function request(changes = {}, requestOrigin = origin) {
  return new Request(`${origin}/api/appointment-contact`, { method: 'POST', headers: { Origin: requestOrigin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.25' }, body: JSON.stringify({ full_name: 'Apex Test', email: 'synthetic@example.com', phone: '(219) 555-0125', contact_consent: true, consent_version: 'appointment-contact-2026-10-25', form_started_at: Date.now() - 10000, website: '', ...changes }) });
}

test('appointment contact is saved separately and duplicates preserve original receipt time', async () => {
  const { sqlite, env } = database();
  try {
    assert.equal((await handleWorkerRequest(request(), env)).status, 200);
    const original = sqlite.prepare('SELECT * FROM appointment_contact_requests').get();
    assert.equal(original.status, 'new');
    assert.equal(original.phone, '+12195550125');
    assert.equal(original.request_kind, 'appointment_contact');
    assert.equal(original.consent_version, 'appointment-contact-2026-10-25');
    assert.equal(original.ip_hash.length, 64);
    sqlite.prepare("UPDATE appointment_contact_requests SET created_at = '2026-01-01', status = 'contacted'").run();
    assert.equal((await handleWorkerRequest(request({ full_name: 'Apex Revised' }), env)).status, 200);
    const repeated = sqlite.prepare('SELECT * FROM appointment_contact_requests').all();
    assert.equal(repeated.length, 1);
    assert.equal(repeated[0].id, original.id);
    assert.equal(repeated[0].created_at, '2026-01-01');
    assert.equal(repeated[0].status, 'new');
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM founding_consultation_requests').get().count, 0);
  } finally { sqlite.close(); }
});

test('rejects health fields, launch-list consent, missing consent and foreign-origin requests without storage', async () => {
  const { sqlite, env } = database();
  try {
    for (const change of [{ symptoms: 'test' }, { phone: '' }, { phone: '5551234567' }, { phone: '219-555-0125 ext 9' }, { date_of_birth: '2000-01-01' }, { accessibility_request: true }, { care_interest: 'test' }, { contact_consent: false }, { consent_version: 'launch-list-2026-09-21' }]) {
      assert.equal((await handleWorkerRequest(request(change), env)).status, 422);
    }
    assert.equal((await handleWorkerRequest(request({}, 'https://other.example'), env)).status, 403);
    assert.equal((await handleWorkerRequest(request(), { ...env, APPOINTMENT_REQUESTS_ENABLED: 'false' })).status, 503);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM appointment_contact_requests').get().count, 0);
  } finally { sqlite.close(); }
});

test('appointment contact shares abuse limits and never claims success when storage fails', async () => {
  const { sqlite, env } = database();
  try {
    for (let i = 0; i < 5; i++) assert.equal((await handleWorkerRequest(request(), env)).status, 200);
    const limited = await handleWorkerRequest(request(), env);
    assert.equal(limited.status, 429);
    assert.ok(limited.headers.get('Retry-After'));
    const failed = await handleWorkerRequest(request({ email: 'other@example.com' }), { ...env, DB: { prepare() { throw new Error('synthetic failure'); }, batch() {} } });
    assert.equal(failed.status, 500);
    assert.equal((await failed.json()).ok, false);
  } finally { sqlite.close(); }
});

test('unverified or unsafe scheduling destinations cannot become an active booking link', () => {
  assert.equal(schedulingUrl(), null);
  assert.equal(schedulingUrl({ ready: false, publicUrl: 'https://practice.kareo.com/synthetic' }), null);
  for (const publicUrl of ['http://practice.kareo.com/synthetic', 'https://tebra.com.attacker.example/a', 'https://practice.kareo.com/a?email=test', 'https://practice.kareo.com/', 'https://user:pass@practice.kareo.com/a']) {
    assert.throws(() => schedulingUrl({ ready: true, publicUrl }));
  }
});

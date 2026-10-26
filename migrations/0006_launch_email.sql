PRAGMA foreign_keys = ON;

-- The required phone stays in Apex D1. Prior rows retain NULL for these new
-- fields; no old consent is reinterpreted or imported.
ALTER TABLE founding_consultation_requests
  ADD COLUMN phone_followup_consent INTEGER CHECK (phone_followup_consent IN (0, 1));
ALTER TABLE founding_consultation_requests
  ADD COLUMN phone_followup_consent_version TEXT;
ALTER TABLE founding_consultation_requests
  ADD COLUMN phone_followup_recorded_at TEXT;

CREATE TABLE IF NOT EXISTS launch_list_consent_events (
  id TEXT PRIMARY KEY NOT NULL,
  request_id TEXT NOT NULL REFERENCES founding_consultation_requests(id),
  email_consent INTEGER NOT NULL CHECK (email_consent = 1),
  email_consent_version TEXT NOT NULL,
  phone_followup_consent INTEGER NOT NULL CHECK (phone_followup_consent IN (0, 1)),
  phone_followup_consent_version TEXT NOT NULL,
  recorded_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_launch_consent_request
  ON launch_list_consent_events(request_id, recorded_at);

-- Only a new, post-activation Launch List submission enters this workflow.
-- Existing records, website-support requests, appointment requests, and Pexy
-- questions are not imported. Recipient email/phone stay in the source table.
CREATE TABLE IF NOT EXISTS launch_email_subscriptions (
  id TEXT PRIMARY KEY NOT NULL,
  request_id TEXT NOT NULL REFERENCES founding_consultation_requests(id),
  email_hash TEXT NOT NULL UNIQUE CHECK (length(email_hash) = 64),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'unsubscribed', 'suppressed')
  ),
  consent_version TEXT NOT NULL,
  consented_at TEXT NOT NULL,
  confirmed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS launch_email_outbox (
  id TEXT PRIMARY KEY NOT NULL,
  subscription_id TEXT NOT NULL REFERENCES launch_email_subscriptions(id),
  stage TEXT NOT NULL CHECK (stage IN ('verify', 'welcome', 'day3', 'day10')),
  dedupe_key TEXT NOT NULL UNIQUE,
  due_at TEXT NOT NULL,
  expires_at TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'claimed', 'accepted', 'delivered', 'suppressed', 'failed', 'ambiguous')
  ),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 5),
  first_attempt_at TEXT,
  lease_until TEXT,
  provider_message_id TEXT,
  last_http_status INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_launch_outbox_due
  ON launch_email_outbox(status, due_at);
CREATE INDEX IF NOT EXISTS idx_launch_outbox_provider
  ON launch_email_outbox(provider_message_id);

CREATE TABLE IF NOT EXISTS launch_email_suppressions (
  email_hash TEXT PRIMARY KEY NOT NULL CHECK (length(email_hash) = 64),
  reason TEXT NOT NULL CHECK (reason IN ('unsubscribe', 'hard_bounce', 'spam', 'invalid', 'blocked')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS launch_email_webhook_events (
  fingerprint TEXT PRIMARY KEY NOT NULL CHECK (length(fingerprint) = 64),
  outbox_id TEXT REFERENCES launch_email_outbox(id),
  event_type TEXT NOT NULL,
  created_at TEXT NOT NULL
);

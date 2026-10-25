-- Appointment follow-up consent is separate from opening-news consent.
-- No clinical intake, free-text notes, treatment selection or newsletter import.
CREATE TABLE IF NOT EXISTS appointment_contact_requests (
  id TEXT PRIMARY KEY NOT NULL,
  full_name TEXT NOT NULL CHECK (length(full_name) BETWEEN 2 AND 100),
  email TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(email) BETWEEN 3 AND 254),
  phone TEXT NOT NULL CHECK (length(phone) = 12 AND substr(phone, 1, 2) = '+1'),
  request_kind TEXT NOT NULL DEFAULT 'appointment_contact' CHECK (request_kind = 'appointment_contact'),
  contact_consent INTEGER NOT NULL CHECK (contact_consent = 1),
  consent_version TEXT NOT NULL CHECK (consent_version = 'appointment-contact-2026-10-25'),
  consented_at TEXT NOT NULL,
  ip_hash TEXT NOT NULL CHECK (length(ip_hash) = 64),
  user_agent TEXT NOT NULL CHECK (length(user_agent) <= 512),
  source_origin TEXT NOT NULL CHECK (source_origin IN ('https://apexwellnessnwi.com', 'https://www.apexwellnessnwi.com')),
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'transferred', 'closed'))
);
CREATE INDEX IF NOT EXISTS idx_appointment_contact_status ON appointment_contact_requests(status, created_at);

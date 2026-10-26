-- Pexy follow-up is a separate, purpose-limited contact queue. It is neither
-- clinical intake nor a Launch List or appointment request.
CREATE TABLE IF NOT EXISTS pexy_followup_requests (
  id TEXT PRIMARY KEY NOT NULL,
  full_name TEXT NOT NULL CHECK (length(full_name) BETWEEN 2 AND 100),
  email TEXT NOT NULL COLLATE NOCASE CHECK (length(email) BETWEEN 3 AND 254),
  question TEXT NOT NULL CHECK (length(question) BETWEEN 8 AND 500),
  contact_consent INTEGER NOT NULL CHECK (contact_consent = 1),
  consent_version TEXT NOT NULL CHECK (consent_version = 'pexy-followup-2026-10-26'),
  consented_at TEXT NOT NULL,
  ip_hash TEXT NOT NULL CHECK (length(ip_hash) = 64),
  source_origin TEXT NOT NULL CHECK (
    source_origin IN ('https://apexwellnessnwi.com', 'https://www.apexwellnessnwi.com')
  ),
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
  reviewed_at TEXT,
  responded_at TEXT,
  closed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_pexy_followup_status_created
  ON pexy_followup_requests (status, created_at);

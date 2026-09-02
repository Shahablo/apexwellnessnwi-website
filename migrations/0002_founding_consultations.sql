PRAGMA foreign_keys = ON;

-- This is intentionally a separate table. Existing priority_submissions rows and
-- their original consent records remain unchanged.
CREATE TABLE IF NOT EXISTS founding_consultation_requests (
  id TEXT PRIMARY KEY NOT NULL,
  full_name TEXT NOT NULL CHECK (length(full_name) BETWEEN 2 AND 100),
  email TEXT NOT NULL COLLATE NOCASE CHECK (length(email) BETWEEN 3 AND 254),
  request_kind TEXT NOT NULL CHECK (
    request_kind IN ('founding_consultation', 'website_accessibility')
  ),
  contact_consent INTEGER NOT NULL CHECK (contact_consent = 1),
  consent_version TEXT NOT NULL CHECK (length(consent_version) BETWEEN 1 AND 40),
  consented_at TEXT NOT NULL,
  ip_hash TEXT NOT NULL CHECK (length(ip_hash) = 64),
  user_agent TEXT NOT NULL CHECK (length(user_agent) <= 512),
  source_origin TEXT NOT NULL CHECK (
    source_origin IN (
      'https://apexwellnessnwi.com',
      'https://www.apexwellnessnwi.com'
    )
  ),
  created_at TEXT NOT NULL,
  UNIQUE (email, request_kind)
);

CREATE INDEX IF NOT EXISTS idx_founding_requests_created_at
  ON founding_consultation_requests (created_at);

CREATE INDEX IF NOT EXISTS idx_founding_requests_ip_created
  ON founding_consultation_requests (ip_hash, created_at);

CREATE INDEX IF NOT EXISTS idx_founding_requests_kind_created
  ON founding_consultation_requests (request_kind, created_at);

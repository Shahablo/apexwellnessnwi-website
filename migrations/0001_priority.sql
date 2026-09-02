PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS priority_submissions (
  id TEXT PRIMARY KEY NOT NULL,
  full_name TEXT NOT NULL CHECK (length(full_name) BETWEEN 2 AND 100),
  email TEXT NOT NULL COLLATE NOCASE CHECK (length(email) BETWEEN 3 AND 254),
  care_interest TEXT NOT NULL CHECK (
    care_interest IN (
      'weight_management',
      'mens_hormone_health',
      'womens_midlife_care',
      'website_or_accessibility',
      'not_sure'
    )
  ),
  consent INTEGER NOT NULL CHECK (consent = 1),
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
  UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_priority_submissions_created_at
  ON priority_submissions (created_at);

CREATE INDEX IF NOT EXISTS idx_priority_submissions_ip_created
  ON priority_submissions (ip_hash, created_at);

CREATE TABLE IF NOT EXISTS priority_rate_limits (
  key_type TEXT NOT NULL CHECK (key_type IN ('ip', 'email')),
  key_hash TEXT NOT NULL CHECK (length(key_hash) = 64),
  window_started_at INTEGER NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1 CHECK (request_count >= 1),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (key_type, key_hash, window_started_at)
);

CREATE INDEX IF NOT EXISTS idx_priority_rate_limits_window
  ON priority_rate_limits (window_started_at);

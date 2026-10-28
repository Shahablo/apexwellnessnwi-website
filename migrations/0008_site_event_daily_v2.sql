PRAGMA foreign_keys = ON;

-- Privacy-minimized first-party measurement, version 2. Every row remains a
-- daily aggregate counter. Never add visitor/session identifiers, IP data,
-- full URLs, query strings, form values, free text, or exact timestamps.
CREATE TABLE IF NOT EXISTS site_event_daily_v2 (
  event_date TEXT NOT NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('page_view', 'cta_click', 'form_view', 'form_start', 'form_submit_success')),
  page_key TEXT NOT NULL,
  target_group TEXT NOT NULL CHECK (target_group IN ('none', 'launch_list', 'plan_visit', 'call', 'email')),
  form_group TEXT NOT NULL CHECK (form_group IN ('none', 'launch_list', 'plan_visit', 'pexy_followup')),
  utm_source TEXT NOT NULL,
  utm_medium TEXT NOT NULL,
  utm_campaign TEXT NOT NULL,
  referrer_domain TEXT NOT NULL,
  device_class TEXT NOT NULL CHECK (device_class IN ('phone', 'tablet', 'desktop')),
  region_group TEXT NOT NULL CHECK (region_group IN ('indiana', 'us_other', 'non_us', 'unknown')),
  event_count INTEGER NOT NULL DEFAULT 0 CHECK (event_count >= 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (
    event_date, event_name, page_key, target_group, form_group,
    utm_source, utm_medium, utm_campaign, referrer_domain,
    device_class, region_group
  )
);

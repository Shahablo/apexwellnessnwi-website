PRAGMA foreign_keys = ON;

-- Privacy-minimized website measurement. Rows are daily aggregate counters,
-- never visitor-level events. Do not add IP addresses, device identifiers,
-- referrers, query strings, full URLs, form values, or free text.
CREATE TABLE IF NOT EXISTS site_event_daily (
  event_date TEXT NOT NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('page_view', 'cta_click')),
  page_group TEXT NOT NULL CHECK (page_group IN ('home', 'care', 'blog', 'visit', 'general')),
  target_group TEXT NOT NULL CHECK (target_group IN ('none', 'launch_list', 'plan_visit', 'call', 'email')),
  event_count INTEGER NOT NULL DEFAULT 0 CHECK (event_count >= 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (event_date, event_name, page_group, target_group)
);

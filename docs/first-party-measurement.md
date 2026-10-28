# First-party website measurement

The site records privacy-minimized daily counters in `site_event_daily_v2`. It does not use Google Analytics, Google Tag Manager, Meta Pixel, TikTok Pixel, cookies, persistent browser storage, visitor IDs, session IDs, raw IP addresses, IP hashes, exact locations, user-agent strings, full URLs, query strings, full referrer URLs, form values, or Pexy questions.

## Available daily dimensions

- Exact site page key and event: page view, CTA click, form view, form start, or successful form submission.
- CTA group: Launch List, Plan Your Visit, phone, or email.
- Form group: Launch List, Plan Your Visit, or Pexy follow-up.
- Normalized UTM source and medium, plus a sanitized campaign slug.
- Referring website domain only.
- Phone, tablet, or desktop based on viewport width.
- Indiana, other United States, non-US, or unknown region, derived at the server and never sent by the browser.

Use campaign labels that describe the channel and initiative, such as `instagram-opening-week`. Never put a person's name, email address, phone number, medical topic, or other personal information in a UTM value.

## Example reports

```sql
-- Daily page views by page
SELECT event_date, page_key, SUM(event_count) AS views
FROM site_event_daily_v2
WHERE event_name = 'page_view'
GROUP BY event_date, page_key
ORDER BY event_date DESC, views DESC;

-- CTA clicks by the page where the click happened
SELECT event_date, page_key, target_group, SUM(event_count) AS clicks
FROM site_event_daily_v2
WHERE event_name = 'cta_click'
GROUP BY event_date, page_key, target_group
ORDER BY event_date DESC, clicks DESC;

-- Form funnel
SELECT event_date, form_group, event_name, SUM(event_count) AS events
FROM site_event_daily_v2
WHERE event_name IN ('form_view', 'form_start', 'form_submit_success')
GROUP BY event_date, form_group, event_name
ORDER BY event_date DESC, form_group, event_name;

-- Campaign and referring-domain totals
SELECT event_date, utm_source, utm_medium, utm_campaign, referrer_domain,
       SUM(event_count) AS events
FROM site_event_daily_v2
GROUP BY event_date, utm_source, utm_medium, utm_campaign, referrer_domain
ORDER BY event_date DESC, events DESC;
```

The legacy `site_event_daily` table is retained for the short historical period before version 2. Do not join its broad page groups to version 2 as if they were exact-page records.

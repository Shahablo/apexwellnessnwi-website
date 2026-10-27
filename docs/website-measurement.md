# Website measurement

The website uses a first-party, cookie-free `window.apexMeasurement` interface. It sends a small same-origin request to `/api/site-event` and stores only daily aggregate counters in Apex's existing Cloudflare D1 database.

Allowed measurements are limited to:

- Page views grouped as `home`, `care`, `blog`, `visit`, or `general`. All care pages share one `care` group.
- Clicks to the Launch List, Plan Your Visit, phone, or email actions.

The endpoint rejects full paths, URLs, query strings, referrers, names, email addresses, phone numbers, form values, free text, Pexy questions, care-specific labels, and any extra fields. It stores no raw IP address, IP hash, device identifier, user agent, session identifier, or visitor-level event row. It does not set cookies or use local or session storage. Google Analytics, Google Tag Manager, Meta Pixel, and other advertising tags are not installed.

Before any third-party analytics or advertising provider is connected, Apex must separately approve and document:

1. The provider and account configuration, including who can access the data.
2. The privacy, security and healthcare-data review, including whether a business associate agreement or consent mechanism is required.
3. A minimal event list that excludes names, email addresses, phone numbers, form values, free text, Pexy questions, clinical information and URL data that could reveal a visitor's care interest.
4. Retention, deletion and access settings.
5. The production property or container identifiers and the exact domains that must be added to the Content Security Policy.
6. A test plan showing that consent choices work and that form or assistant data never enters analytics logs.

After those decisions are approved, add the reviewed integration and test its network requests before release. Do not reuse or expand the aggregate endpoint to collect visitor-level data.

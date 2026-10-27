# Website measurement gate

The website includes a first-party `window.apexMeasurement` interface, but it is deliberately disabled. It sends no requests, loads no vendor code, stores no identifiers and records no events.

Do not enable measurement by changing only the `enabled` value. Before any provider is connected, Apex must approve and document:

1. The provider and account configuration, including who can access the data.
2. The privacy, security and healthcare-data review, including whether a business associate agreement or consent mechanism is required.
3. A minimal event list that excludes names, email addresses, phone numbers, form values, free text, Pexy questions, clinical information and URL data that could reveal a visitor's care interest.
4. Retention, deletion and access settings.
5. The production property or container identifiers and the exact domains that must be added to the Content Security Policy.
6. A test plan showing that consent choices work and that form or assistant data never enters analytics logs.

After those decisions are approved, replace the inert adapter with the reviewed implementation and test its network requests before release. Advertising pixels remain out of scope unless separately authorized.

# Launch List email workflow (prepared, disabled)

This code is **not a live email service**. The site continues to store Launch
List requests in Apex's D1 database. It sends nothing while
`LAUNCH_EMAIL_ENABLED=false`, and `wrangler.jsonc` has no Cron trigger.
No existing Launch List rows are imported. Website/accessibility questions,
appointment-contact requests, and Pexy questions never enter this workflow.

## Data and sequence

Migration `0006_launch_email.sql` adds separate Launch List email and optional
manual-call consent fields, immutable events recording both choices and their
versions, a subscription state, an outbox, suppressions, and webhook receipts.
The outbox holds only a subscription reference and message state. It does not
copy the name, email, phone, medical details, or request body. On a new
consented Launch List submission *after activation*, D1 atomically saves the
source request, consent event, and one pending verification email. Repeat
submissions cannot produce another active verification email, and never clear
an unsubscribe or bounce suppression. The source request's original
`created_at`, consent version, and consent time are preserved; each later
choice gets a separate event. Historical requests are not enrolled merely by
applying the migration.

The phone number remains required in Apex D1, but an unchecked optional
manual-call box means Apex must not call from that Launch List signup. The
Brevo path transmits neither the phone number nor the call choice. The
verification link contains a random outbox ID and an HMAC token, not an
email address. A GET only displays a confirmation button, so link previews do
not confirm a person. A valid POST confirms them once, then queues one welcome
message and Day 3/Day 10 follow-ups relative to confirmation. Each follow-up
rechecks status and suppression before sending. Unsubscribe similarly requires
a button POST and cancels queued messages. There are no clinical details or
phone numbers in the Brevo request. The sender passes only the email address
needed for delivery, static public copy and an opaque outbox tag.

The dispatcher claims at most 20 due messages per run and conservatively caps
first attempts at 250 per UTC day. Brevo API acceptance is recorded separately
from actual delivery. Authenticated callbacks can record delivery and suppress
future messages for hard bounces, spam, invalid addresses, blocked addresses
and unsubscriptions. Transient errors use the same Brevo idempotency key for
bounded retries inside its short TTL. An uncertain result after the retry
window is marked `ambiguous` for manual reconciliation, not retried blindly.
The email API is used with inline HTML and plain text; Brevo template IDs and
contact-list imports are not required.

The verification message is operational. The welcome, Day 3, and Day 10
opening-update messages are **marketing**, even though they use Brevo's
transactional email API, and require the explicit Launch List email opt-in.
No send is authorized by phone collection or optional manual-call permission.
The API request sets `contactPixelTrackingConsent: false` for each recipient.
Brevo says this flag prevents open and click tracking only after its
**per-contact pixel tracking consent** setting is enabled, so this code alone
does not establish that tracking is off. Confirm that account setting and its
unknown-contact default before sending. See [Brevo's pixel-tracking
instructions](https://help.brevo.com/hc/en-us/articles/37113920427922-About-email-tracking-pixels-and-the-CNIL-recommendation-in-Brevo)
and [email-purpose guidance](https://help.brevo.com/hc/en-us/articles/360021196220-What-are-the-differences-between-marketing-transactional-and-automation-emails).

## Activation gates

1. Decide whether this general clinic Launch List and Brevo data flow are
   acceptable under Apex's privacy and contractual requirements. Brevo has
   not been cleared for patient or clinical messaging. Do not send appointment,
   Pexy, accessibility, medical, or historical list data through this workflow.
2. Review the exact four email bodies and the separate consent text. The site
   shows "check your inbox and confirm" only when the API confirms that email
   verification was queued; with sending off, it keeps the current received
   message. No automated calls or texts are implemented.
3. Verify the Brevo sender/domain, required DNS records, account sending
   access, and real inbox delivery. Keep Google Workspace MX records intact.
4. Apply D1 migration `0006_launch_email.sql` before deploying the split
   consent form, even when email delivery remains off. The new form stores both
   permission choices and requires this migration.
   Add `LAUNCH_EMAIL_HASH_SALT`, `LAUNCH_EMAIL_TOKEN_SECRET`,
   `BREVO_API_KEY`, and `BREVO_WEBHOOK_TOKEN` as Cloudflare secrets.
   Each salt/token secret must be at least 32 characters. Set verified
   `BREVO_SENDER_EMAIL` and `BREVO_REPLY_TO_EMAIL` to Apex-domain
   addresses. Never commit credentials.
5. Configure a Brevo transactional webhook to
   `https://apexwellnessnwi.com/api/launch-email/webhook` with bearer
   authentication matching `BREVO_WEBHOOK_TOKEN`. Subscribe only to
   delivered, hardBounce, spam, unsubscribed, invalid, and blocked events.
6. With a synthetic owner address, verify D1 receipt, one verification send,
   confirmation, one welcome, Day 3/10 timing, unsubscribe, failure handling,
   provider receipts, and an actual inbox delivery. Check provider retention.
   Enable Brevo per-contact pixel tracking consent with unknown contacts
   defaulted to **not tracked**; verify a test send with the per-recipient
   `false` flag does not record opens or clicks. Do not turn tracking on without
   separate consent and privacy review.
7. Only then set `LAUNCH_EMAIL_ENABLED=true`, decide whether to set
   `LAUNCH_EMAIL_FOLLOWUPS_ENABLED=true`, and add a five-minute Cron trigger
   (`*/5 * * * *`) to `wrangler.jsonc`. Read back the deployed settings and
   first live delivery. Never treat an accepted API call as inbox delivery.

Do not manually paste recipient data into Brevo to work around an activation
gate. If the token secret or lookup salt must rotate, plan a migration because
existing links or suppression lookups depend on their stability.
Keep D1, the link secret, and webhook token available if sending is later
paused: confirmation, unsubscribe, and bounce processing remain active without
the Brevo send key or enabled-send flag.

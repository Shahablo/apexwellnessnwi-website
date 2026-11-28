# Google Tag Manager for apexwellnessnwi.com

Container **GTM-KXG4NF6G** (account "Apex Wellness", owner login shahab@apexwellnessnwi.com), set up November 24, 2026 so the marketing team can manage Google Ads tags without a website release.

## How the site and Tag Manager split the work

The website (`src/assets/tag-manager.js`, loaded on every page) does three things only:

1. Turns off ad personalization and Google signals before any tag runs.
2. Pushes a dataLayer event when someone clicks:
   - any **Book online** button (`a[data-book-online]`): `apex_book_online_click`
   - any **phone link** (`a[href^="tel:"]`): `apex_call_click`

   Since November 28, 2026 the booking pages (`/founding-patients/` and `/book/*`) show Tebra's scheduler embedded on the page, and their Book online buttons jump to it. A frame from another site cannot report clicks, so the first time a visitor clicks into the scheduler on a page (focus moves into the frame) the site pushes the same `apex_book_online_click` once. The Google Ads conversion therefore keeps counting booking starts with no Tag Manager change. Nothing typed in the scheduler is visible to the page or its tags.

   The events carry no other data: no page text, form values or the number dialed.
3. Loads the container.

Tag Manager decides what those events do. As set up on November 24:

| Tag | Type | Fires on |
| --- | --- | --- |
| Google tag - Google Ads (AW-18529444653) | Google Tag, `allow_ad_personalization_signals=false`, `allow_google_signals=false` | Initialization - All Pages |
| Conversion Linker | Conversion Linker | All Pages |
| Google Ads - Book online click | Google Ads Conversion Tracking, label `3DBbCLLPu7odEK3Gw4NF` | `apex_book_online_click` |
| Google Ads - Call button click | Google Ads Conversion Tracking, label `XPU2CISZ7r4dEK3Gw4NF` | `apex_call_click` |

`apex-gtm-container.json` is an import file for that setup. Use it to rebuild the container (Admin > Import Container > Merge), or as a baseline to compare against.

## Guardrail: Google tags only

The site's Content-Security-Policy (`buildHeaders()` in `scripts/build.mjs`) allows scripts and requests only from Google's tag and Google Ads hosts. The owner chose this on November 24, 2026. In practice:

- Google Ads tags, triggers and conversion changes made in Tag Manager work without a site release.
- Other vendors (Meta, TikTok, chat widgets), Google Analytics, and Custom HTML or Custom JavaScript are **blocked by the browser** until the policy is changed in a reviewed pull request. This is deliberate, because this is a health clinic's site.
- Never add `'unsafe-inline'` or `'unsafe-eval'` to the policy to make a tag work.

## Rules for anyone editing the container

- Do not send form values, names, emails, phone numbers, page text or health details to any tag. Leave enhanced conversions off unless the owner and counsel approve.
- Keep ad personalization and remarketing off.
- To count a new kind of click, ask for a new dataLayer event on the site rather than matching on page text.
- Publish with a version name and a note. Tag Manager keeps every version, so you can roll back.

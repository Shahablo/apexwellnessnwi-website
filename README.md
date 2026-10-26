# Apex Wellness website

Production website for [apexwellnessnwi.com](https://apexwellnessnwi.com), deployed as a Cloudflare Worker with Static Assets.

## Architecture

- `src/content.mjs` is the reviewed page and policy content.
- `src/assets/` contains the shared responsive CSS and progressive-enhancement JavaScript.
- `src/assets/site-design.css` defines the editorial visual system: Instrument Serif, Manrope, warm mineral surfaces, and deep green. Licensed fonts are self-hosted; no third-party font request is made.
- `src/assets/site-help.mjs` and `site-assistant.mjs` compile to a local website guide. Questions typed to Pexy stay in the browser; a separately consented, retyped general question can be saved for staff follow-up. No generative model answers these questions. Keep analytics and session replay away from these inputs and the signup form.
- `scripts/build.mjs` generates conventional, crawlable pages in `public/`.
- `src/worker.mjs` handles only `/api/*`; static requests are served directly from `public/`.
- `functions/api/founding-consultation.js` validates and stores Launch List and separate appointment-contact requests in Cloudflare D1.
- `functions/api/priority.js` keeps the retired priority-list endpoint available only to return `410 Gone`.
- `migrations/` contains the D1 schema.
- `wrangler.jsonc` is the checked-in deployment contract. Its `assets.directory` is deliberately restricted to `public/`.

The repository root is never a public asset directory. `public/.assetsignore` adds a second safeguard against dotfiles, repository metadata, source maps, and development files.

The canonical conversion page is `/founding-patients/`. Legacy `/priority` and `/priority-list` page URLs redirect permanently to it. The form submits JSON to `POST /api/founding-consultation`; `GET` is not allowed, and the retired `/api/priority` endpoint returns `410 Gone`.

The current endpoint stores requests and consent records in D1; it does not send automatic emails or notify the clinic. An operational review and follow-up process must be in place before promising delivery or response times. The website guide is not a clinical messaging channel.

The Launch List form requires name, email, phone and explicit permission for opening-update emails. Its separate phone permission allows limited manual calls to clarify the signup or share confirmed scheduling availability, not texts, automated calls or unrelated promotional calls. A website/accessibility-support request uses the same page but remains phone-free and does not join the Launch List. Both paths record the applicable consent version and anti-spam values; neither collects care interest, free text or medical history. The server derives the request kind from the support selection rather than accepting a client-supplied kind. Historical signup records retain their original consent and may have no phone.

## Local checks

Requirements: Node.js 22 or newer.

```sh
npm ci
npm test
```

For a local Cloudflare preview, copy `.dev.vars.example` to `.dev.vars`, replace the example salt with a random secret, verify the consent version matches `wrangler.jsonc`, then run:

```sh
npm run preview
```

Never commit `.dev.vars`, Cloudflare credentials, form submissions, or other secrets.

## Deployment

Cloudflare Workers Builds is connected to this GitHub repository. Non-production branches produce preview versions; `main` is the production branch. Its build command is `npm run build`, so the static output is regenerated before Wrangler uploads either a preview or production version.

Production requires:

- D1 binding `DB` using the database declared in `wrangler.jsonc`.
- Runtime secret `IP_HASH_SALT` with at least 16 random characters.
- Runtime variable `FOUNDING_CONSENT_VERSION=launch-list-phone-2026-10-26` from `wrangler.jsonc` (not secret). The deployed variable and form version must match or new submissions fail validation.
- Optional runtime secret `TURNSTILE_SECRET_KEY`, but only after a matching frontend Turnstile token integration is deployed. Enabling the secret without that integration will reject normal submissions.

The Cloudflare zone also enforces these host-level controls, which cannot be expressed in a Static Assets `_redirects` file:

- **Always Use HTTPS** is enabled.
- `www.apexwellnessnwi.com` redirects permanently to the apex host while preserving the path and query string.
- HSTS is enabled for six months with `includeSubDomains`; preload is intentionally off.
- The Cloudflare cache is purged after a production deployment that changes security-sensitive assets or routing.

Apply all database migrations before accepting submissions. Migration `0005_launch_list_phone.sql` adds a nullable phone column to the existing Launch List table, preserving older records and phone-free website-support requests. Check the remote schema and migration history before applying it; do not reapply a column already added manually. Apply and read back the remote schema before publishing a form that sends phone:

```sh
npx wrangler d1 migrations apply apexwellness-priority --remote
```

After deployment, run the dependency-free smoke suite:

```sh
npm run smoke -- https://apexwellnessnwi.com
```

## Publishing workflow

1. Create a feature branch and open a pull request.
2. Wait for the GitHub checks and Cloudflare preview deployment.
3. Review the preview on desktop, tablet, and phone.
4. Before merge, verify the remote D1 phone migration and the production consent variable above. Merge to `main` only after review.
5. Confirm the Cloudflare production build succeeds; run the smoke suite and a synthetic Launch List submission, then read back its normalized phone and consent version in D1. Check the phone-free support path separately. Do not call a merge or local draft a live release.

Verified clinician identity, legal entity, exact location, contact information, office hours, launch date, and final prices must be supplied and approved by the practice owner before those facts are published. Do not replace the current prelaunch language with guesses.

# Apex Wellness website

Production website for [apexwellnessnwi.com](https://apexwellnessnwi.com), deployed as a Cloudflare Worker with Static Assets.

## Architecture

- `src/content.mjs` is the reviewed page and policy content.
- `src/assets/` contains the shared responsive CSS and progressive-enhancement JavaScript.
- `scripts/build.mjs` generates conventional, crawlable pages in `public/`.
- `src/worker.mjs` handles only `/api/*`; static requests are served directly from `public/`.
- `functions/api/founding-consultation.js` validates and stores Founding Patient consultation requests in Cloudflare D1.
- `functions/api/priority.js` keeps the retired priority-list endpoint available only to return `410 Gone`.
- `migrations/` contains the D1 schema.
- `wrangler.jsonc` is the checked-in deployment contract. Its `assets.directory` is deliberately restricted to `public/`.

The repository root is never a public asset directory. `public/.assetsignore` adds a second safeguard against dotfiles, repository metadata, source maps, and development files.

The canonical conversion page is `/founding-patients/`. Legacy `/priority` and `/priority-list` page URLs redirect permanently to it. The form submits JSON to `POST /api/founding-consultation`; `GET` is not allowed, and the retired `/api/priority` endpoint returns `410 Gone`.

The public form is intentionally minimal. It collects name, email, explicit contact consent, consent version, anti-spam timing/honeypot values, and an optional boolean website-accessibility flag. It does not collect a phone number, care interest, free text, or protected health information. `accessibility_request` is converted server-side to a request kind rather than accepting a client-supplied request kind.

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
- Runtime variable `FOUNDING_CONSENT_VERSION=founding-consultation-2026-09` (checked in because it is not secret).
- Optional runtime secret `TURNSTILE_SECRET_KEY`, but only after a matching frontend Turnstile token integration is deployed. Enabling the secret without that integration will reject normal submissions.

The Cloudflare zone also enforces these host-level controls, which cannot be expressed in a Static Assets `_redirects` file:

- **Always Use HTTPS** is enabled.
- `www.apexwellnessnwi.com` redirects permanently to the apex host while preserving the path and query string.
- HSTS is enabled for six months with `includeSubDomains`; preload is intentionally off.
- The Cloudflare cache is purged after a production deployment that changes security-sensitive assets or routing.

Apply all database migrations before accepting submissions. Migration `0002_founding_consultations.sql` creates the new request table without converting or deleting historical priority-list records:

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
4. Merge to `main` only after review.
5. Run the production smoke suite and inspect the D1 `founding_consultation_requests` table for the expected submission record.

Verified clinician identity, legal entity, exact location, contact information, office hours, launch date, and final prices must be supplied and approved by the practice owner before those facts are published. Do not replace the current prelaunch language with guesses.

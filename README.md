# Apex Wellness — website (Phase 1 design build)

`index.html` is a self-contained, offline-capable build of the Apex Wellness site (Home, three care pages, How It Works, Pricing, About/Team, FAQ, Priority List). No build step, no dependencies.

## Publish with GitHub Pages
1. Commit `index.html` to the `main` branch root.
2. Repo → Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Site appears at `https://shahablo.github.io/apexwellnessnwi-website/`.

## Before public launch (from the design brief)
- Replace bracketed placeholders: legal entity/DBA, clinician names and credentials, address, phone, email, hours.
- Confirm the physician-management arrangement before publishing "physician-reviewed / managed" copy.
- Add final prices (currently `$ ———` with "Pending" tags).
- Drop real photography into the image areas (edit in the design tool, then re-export).
- Add Privacy, Terms, Communications Consent, Accessibility, and Cancellation/Refund pages (footer links are placeholders).
- Wire the priority-list form to a compliant CRM/form endpoint; do not add ad pixels to scheduling/intake steps.

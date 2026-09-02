import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { pages, site } from "../src/content.mjs";

const rootDirectory = fileURLToPath(new URL("../", import.meta.url));
const publicDirectory = join(rootDirectory, "public");
const sourceAssetsDirectory = join(rootDirectory, "src", "assets");
const sourceImagesDirectory = join(rootDirectory, "assets", "images");
const publicAssetsDirectory = join(publicDirectory, "assets");
const publicImagesDirectory = join(publicAssetsDirectory, "images");
const buildDate = process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString().slice(0, 10)
  : new Date().toISOString().slice(0, 10);

const imageCatalog = Object.freeze({
  consultation: {
    file: "apex-hero-consultation.webp",
    width: 1199,
    height: 1312,
    alt: "A physician having a thoughtful conversation with an adult patient.",
  },
  clinic: {
    file: "apex-clinic-interior.webp",
    width: 1536,
    height: 1024,
    alt: "A warm, calm medical consultation room.",
  },
  men: {
    file: "apex-mens-care.webp",
    width: 1713,
    height: 918,
    alt: "An adult man discussing health goals during a medical consultation.",
  },
  shoreline: {
    file: "apex-nwi-shoreline.webp",
    width: 1729,
    height: 910,
    alt: "The Lake Michigan shoreline in Northwest Indiana.",
  },
  review: {
    file: "apex-physician-review.webp",
    width: 1386,
    height: 1135,
    alt: "A physician carefully reviewing clinical information.",
  },
  weight: {
    file: "apex-weight-care.webp",
    width: 1577,
    height: 997,
    alt: "An adult patient discussing a weight and metabolic care plan.",
  },
  women: {
    file: "apex-womens-care.webp",
    width: 1729,
    height: 910,
    alt: "An adult woman speaking with a clinician about midlife health concerns.",
  },
  architectural: {
    file: "background-option-architectural.webp",
    width: 1672,
    height: 941,
    alt: "Warm modern architecture with natural light and understated landscaping.",
  },
  mineral: {
    file: "background-option-warm-mineral.webp",
    width: 1672,
    height: 941,
    alt: "A warm, neutral mineral texture.",
  },
});

const heroImages = Object.freeze({
  home: imageCatalog.consultation,
  "weight-management": imageCatalog.weight,
  "mens-hormone-health": imageCatalog.men,
  "womens-midlife-care": imageCatalog.women,
  "how-it-works": imageCatalog.review,
  pricing: imageCatalog.architectural,
  about: imageCatalog.clinic,
  faq: imageCatalog.shoreline,
  "priority-list": imageCatalog.consultation,
});

const careCardImages = Object.freeze({
  "/weight-management/": imageCatalog.weight,
  "/mens-hormone-health/": imageCatalog.men,
  "/womens-midlife-care/": imageCatalog.women,
});

const assetVersions = new Map();

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeXml(value) {
  return escapeHtml(value);
}

function identifier(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "section";
}

function canonicalUrl(slug) {
  return `${site.canonicalUrl}${slug === "/" ? "/" : slug}`;
}

function assetUrl(path) {
  const normalized = path.replaceAll("\\", "/");
  const version = assetVersions.get(normalized);
  return `/assets/${normalized}${version ? `?v=${version}` : ""}`;
}

function jsonForScript(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
}

function pageJsonLd(page) {
  const url = canonicalUrl(page.slug);
  const graph = [
    {
      "@type": "Organization",
      "@id": `${site.canonicalUrl}/#organization`,
      name: site.name,
      url: `${site.canonicalUrl}/`,
      description: site.description,
      areaServed: {
        "@type": "AdministrativeArea",
        name: site.region,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.canonicalUrl}/#website`,
      url: `${site.canonicalUrl}/`,
      name: site.name,
      description: site.description,
      publisher: { "@id": `${site.canonicalUrl}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": `${site.canonicalUrl}/#website` },
      about: { "@id": `${site.canonicalUrl}/#organization` },
      inLanguage: "en-US",
    },
  ];

  if (page.slug !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${site.canonicalUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.navLabel || page.h1,
          item: url,
        },
      ],
    });
  }

  return jsonForScript({ "@context": "https://schema.org", "@graph": graph });
}

function imageMarkup(image, { hero = false, compactCaption = false } = {}) {
  const loading = hero
    ? 'loading="eager" fetchpriority="high"'
    : 'loading="lazy"';
  const caption = compactCaption ? "Representative imagery" : site.representativeImageryNotice;

  return `<figure class="representative">
    <img src="${escapeHtml(assetUrl(`images/${image.file}`))}" width="${image.width}" height="${image.height}" alt="${escapeHtml(image.alt)}" ${loading} decoding="async">
    <figcaption class="representative-caption">${escapeHtml(caption)}</figcaption>
  </figure>`;
}

function buttonMarkup(cta, secondary = false) {
  return `<a class="${secondary ? "button-secondary" : "button"}" href="${escapeHtml(cta.href)}">${escapeHtml(cta.label)}</a>`;
}

function headingMarkup(section, id) {
  return `<div class="section-heading">
    ${section.eyebrow ? `<p class="eyebrow">${escapeHtml(section.eyebrow)}</p>` : ""}
    <h2 id="${id}">${escapeHtml(section.heading)}</h2>
  </div>`;
}

function faqMarkup(items) {
  return `<div class="faq-list">
    ${items.map((item) => `<details>
      <summary>${escapeHtml(item.question)}</summary>
      <p>${escapeHtml(item.answer)}</p>
    </details>`).join("\n")}
  </div>`;
}

function cardsMarkup(items, className = "cards") {
  return `<div class="${className}">
    ${items.map((item) => `<article class="card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
      ${item.href ? `<a href="${escapeHtml(item.href)}" aria-label="Learn more about ${escapeHtml(item.title)}">Learn more</a>` : ""}
    </article>`).join("\n")}
  </div>`;
}

function careCardsMarkup(items) {
  return `<div class="care-cards">
    ${items.map((item) => {
      const image = careCardImages[item.href];
      return `<figure class="care-card representative">
        ${image ? `<img src="${escapeHtml(assetUrl(`images/${image.file}`))}" width="${image.width}" height="${image.height}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async">` : ""}
        <span class="care-card-overlay" aria-hidden="true"></span>
        <figcaption class="care-card-body">
          ${image ? '<p class="representative-caption">Representative imagery</p>' : ""}
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
          <a href="${escapeHtml(item.href)}">Explore this care area</a>
        </figcaption>
      </figure>`;
    }).join("\n")}
  </div>`;
}

function pricingMarkup(items) {
  return `<table class="pricing-table">
    <caption>Pricing details Apex will publish before accepting appointments or payment.</caption>
    <thead>
      <tr><th scope="col">Pricing detail</th><th scope="col">What will be published</th></tr>
    </thead>
    <tbody>
      ${items.map((item) => `<tr><th scope="row">${escapeHtml(item.title)}</th><td>${escapeHtml(item.body)}</td></tr>`).join("\n")}
    </tbody>
  </table>
  <div class="pricing-cards" aria-label="Planned pricing details">
    ${items.map((item) => `<article class="pricing-card">
      <h3>${escapeHtml(item.title)}</h3>
      <dl><dt>Status</dt><dd>Not yet published</dd><dt>What Apex will explain</dt><dd>${escapeHtml(item.body)}</dd></dl>
    </article>`).join("\n")}
  </div>`;
}

function priorityFormMarkup(section) {
  const interests = [
    ["", "Choose an option"],
    ...site.careInterests.map((interest) => [interest.value, interest.label]),
  ];

  return `<div class="form-card">
    <h2 id="priority-form-heading">Join the Priority List</h2>
    <p id="form-guidance">${escapeHtml(section.privacyNote)}</p>
    <form id="priority-form" action="/api/priority" method="post" aria-labelledby="priority-form-heading" aria-describedby="form-guidance">
      <div class="field field-full">
        <label for="full-name">Name</label>
        <input id="full-name" name="full_name" type="text" autocomplete="name" minlength="2" maxlength="100" aria-describedby="full-name-help" required>
        <p id="full-name-help" class="field-help">Enter the name you use for email updates.</p>
      </div>
      <div class="field field-full">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="254" aria-describedby="email-help" required>
        <p id="email-help" class="field-help">We will use this address only as described in the Privacy Policy.</p>
      </div>
      <div class="field field-full">
        <label for="care-interest">Care interest</label>
        <select id="care-interest" name="care_interest" autocomplete="off" aria-describedby="care-interest-help" required>
          ${interests.map(([value, label], index) => `<option value="${escapeHtml(value)}"${index === 0 ? " disabled selected" : ""}>${escapeHtml(label)}</option>`).join("\n")}
        </select>
        <p id="care-interest-help" class="field-help">Choose the care area or website-help option that best fits your request.</p>
      </div>
      <div class="field-honeypot" aria-hidden="true">
        <label for="website">Leave this field blank</label>
        <input id="website" name="website" type="text" tabindex="-1" autocomplete="off" maxlength="200" aria-hidden="true">
      </div>
      <input name="consent_version" type="hidden" value="priority-2026-09">
      <input name="form_started_at" type="hidden">
      <label class="consent field-full" for="communications-consent">
        <input id="communications-consent" name="consent" type="checkbox" value="true" aria-describedby="consent-help" required>
        <span id="consent-help">I agree to receive email from Apex Wellness about launch updates and appointment availability, and I acknowledge the <a href="/privacy/">Privacy Policy</a> and <a href="/communications-consent/">Communications Consent</a>. I may unsubscribe at any time.</span>
      </label>
      <button class="button" type="submit" data-loading-label="Submitting…">${escapeHtml(section.submitLabel)}</button>
      <p id="form-status" class="form-status" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"></p>
    </form>
  </div>`;
}

function renderSection(section, index) {
  const id = `${identifier(section.heading || section.type)}-${index + 1}`;
  const alternatingClass = index % 2 ? " section-alt" : "";

  switch (section.type) {
    case "trustPoints":
      return `<aside class="trust-strip" aria-label="Apex Wellness care standards">
        <ul class="container trust-strip-list">${section.items.map((item) => `<li><strong>${escapeHtml(item)}</strong></li>`).join("")}</ul>
      </aside>`;

    case "statement":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container split">
        <div>${headingMarkup(section, id)}<p>${escapeHtml(section.body)}</p></div>
        ${imageMarkup(imageCatalog.review)}
      </div></section>`;

    case "cards":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container">
        ${headingMarkup(section, id)}${careCardsMarkup(section.cards)}
      </div></section>`;

    case "steps":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container">
        ${headingMarkup(section, id)}
        <ol class="steps">${section.items.map((item) => `<li class="step"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></li>`).join("\n")}</ol>
      </div></section>`;

    case "featureList":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container split">
        <div>${headingMarkup(section, id)}<ul class="feature-list">${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        ${imageMarkup(imageCatalog.clinic)}
      </div></section>`;

    case "prelaunch":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container section-narrow">
        ${headingMarkup(section, id)}<p>${escapeHtml(section.body)}</p><div class="button-row">${buttonMarkup(section.cta)}</div>
      </div></section>`;

    case "serviceArea":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container split split-reverse">
        <div>${headingMarkup(section, id)}<p>${escapeHtml(section.body)}</p></div>
        ${imageMarkup(imageCatalog.shoreline)}
      </div></section>`;

    case "audience":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container section-narrow">
        ${headingMarkup(section, id)}<p>${escapeHtml(section.body)}</p><p><strong>Good to know:</strong> ${escapeHtml(section.note)}</p>
      </div></section>`;

    case "detail":
    case "followUp":
    case "referral":
    case "status":
    case "notice":
    case "verificationStatus":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container section-narrow">
        ${headingMarkup(section, id)}<p>${escapeHtml(section.body)}</p>
      </div></section>`;

    case "options":
    case "values":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container">
        ${headingMarkup(section, id)}${cardsMarkup(section.items)}${section.note ? `<p class="section-narrow"><strong>Important:</strong> ${escapeHtml(section.note)}</p>` : ""}
      </div></section>`;

    case "pricingPrinciples":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container">
        ${headingMarkup(section, id)}${pricingMarkup(section.items)}
      </div></section>`;

    case "faq":
    case "faqGroup":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container">
        ${headingMarkup(section, id)}${faqMarkup(section.items)}
      </div></section>`;

    case "imageryNotice":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container split">
        <div>${headingMarkup(section, id)}<p>${escapeHtml(section.body)}</p></div>${imageMarkup(imageCatalog.clinic)}
      </div></section>`;

    case "expectations":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container section-narrow">
        ${headingMarkup(section, id)}<ul class="feature-list">${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div></section>`;

    case "form":
      return `<section class="section${alternatingClass}" aria-label="Priority list form"><div class="container section-narrow">${priorityFormMarkup(section)}</div></section>`;

    default:
      throw new Error(`Unsupported content section type: ${section.type}`);
  }
}

function renderPolicySection(section, index) {
  const id = `${identifier(section.heading)}-${index + 1}`;
  return `<section aria-labelledby="${id}">
    <h2 id="${id}">${escapeHtml(section.heading)}</h2>
    ${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
    ${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
  </section>`;
}

function renderHero(pageKey, page) {
  const image = heroImages[pageKey] || imageCatalog.shoreline;
  return `<section class="hero" aria-labelledby="page-title"><div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
      <h1 id="page-title">${escapeHtml(page.h1)}</h1>
      <p>${escapeHtml(page.intro)}</p>
      ${page.slug === "/priority-list/" ? "" : `<div class="hero-actions">${buttonMarkup(page.cta)}</div>`}
    </div>
    <div class="hero-media">${imageMarkup(image, { hero: true })}</div>
  </div></section>`;
}

function renderMain(pageKey, page) {
  if (page.effectiveDate) {
    return `<main id="main-content" class="page" tabindex="-1">
      <article class="policy">
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p>${escapeHtml(page.intro)}</p>
        ${page.sections.map(renderPolicySection).join("\n")}
      </article>
    </main>`;
  }

  return `<main id="main-content" class="page" tabindex="-1">
    ${renderHero(pageKey, page)}
    ${page.sections.map(renderSection).join("\n")}
  </main>`;
}

function renderNavigation(page) {
  const links = site.navigation.map((item) => {
    const current = item.href === page.slug ? ' aria-current="page"' : "";
    return `<li><a href="${escapeHtml(item.href)}"${current}>${escapeHtml(item.label)}</a></li>`;
  }).join("\n");

  return `<header class="site-header">
    <div class="container site-header-inner">
      <a class="brand" href="/" aria-label="Apex Wellness home">Apex Wellness</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open main menu">
        <span class="nav-toggle-label">Menu</span><span class="nav-toggle-icon" aria-hidden="true"></span>
      </button>
      <nav id="primary-navigation" class="site-nav" aria-label="Primary navigation">
        <ul>${links}</ul>
        <a class="nav-cta" href="${escapeHtml(site.cta.href)}"${site.cta.href === page.slug ? ' aria-current="page"' : ""}>${escapeHtml(site.cta.label)}</a>
      </nav>
    </div>
  </header>`;
}

function renderFooter(page) {
  const footerLink = (item) => `<li><a href="${escapeHtml(item.href)}"${item.href === page.slug ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a></li>`;
  const careLinks = site.navigation.slice(1, 4).map(footerLink).join("");
  const infoLinks = site.navigation.slice(4).map(footerLink).join("");
  const policyLinks = site.policyNavigation.map(footerLink).join("");

  return `<footer class="site-footer"><div class="container">
    <div class="footer-grid">
      <div><a class="brand" href="/">Apex Wellness</a><p>${escapeHtml(site.footer.summary)}</p><p>${escapeHtml(site.footer.location)}</p></div>
      <nav aria-label="Care areas"><h2>Care areas</h2><ul>${careLinks}</ul></nav>
      <nav aria-label="Site information"><h2>Information</h2><ul>${infoLinks}</ul></nav>
      <nav aria-label="Policies"><h2>Policies</h2><ul>${policyLinks}</ul></nav>
    </div>
    <div class="footer-meta"><p>${escapeHtml(site.notices.prelaunch)}</p><p>${escapeHtml(site.notices.medical)}</p><p>${escapeHtml(site.notices.emergency)}</p><p>${escapeHtml(site.footer.copyright)}</p></div>
  </div></footer>`;
}

function renderDocument(pageKey, page, jsonLd, { noIndex = false, mainOverride = "" } = {}) {
  const canonical = canonicalUrl(page.slug);
  const heroImage = heroImages[pageKey] || imageCatalog.shoreline;
  const socialImage = `${site.canonicalUrl}${assetUrl(`images/${heroImage.file}`)}`;

  return `<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="${noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#173633">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="${escapeHtml(site.name)}">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(socialImage)}">
  <meta property="og:image:width" content="${heroImage.width}">
  <meta property="og:image:height" content="${heroImage.height}">
  <meta property="og:image:alt" content="${escapeHtml(heroImage.alt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${escapeHtml(socialImage)}">
  <meta name="twitter:image:alt" content="${escapeHtml(heroImage.alt)}">
  <link rel="stylesheet" href="${escapeHtml(assetUrl("site.css"))}">
  <script type="application/ld+json">${jsonLd}</script>
  <script src="${escapeHtml(assetUrl("site.js"))}" defer></script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <div class="announcement" role="status">${escapeHtml(site.announcement)} <a href="${escapeHtml(site.cta.href)}">${escapeHtml(site.cta.label)}</a></div>
  ${renderNavigation(page)}
  ${mainOverride || renderMain(pageKey, page)}
  ${renderFooter(page)}
</body>
</html>
`;
}

function outputPathForSlug(slug) {
  if (slug === "/") return join(publicDirectory, "index.html");
  return join(publicDirectory, slug.replace(/^\/+|\/+$/g, ""), "index.html");
}

async function writeOutput(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content.replace(/[\t ]+$/gm, ""), "utf8");
}

async function fingerprint(path) {
  const contents = await readFile(path);
  return createHash("sha256").update(contents).digest("hex").slice(0, 12);
}

async function prepareAssets() {
  await mkdir(publicAssetsDirectory, { recursive: true });
  await cp(join(sourceAssetsDirectory, "site.css"), join(publicAssetsDirectory, "site.css"));
  await cp(join(sourceAssetsDirectory, "site.js"), join(publicAssetsDirectory, "site.js"));
  await cp(sourceImagesDirectory, publicImagesDirectory, { recursive: true });

  assetVersions.set("site.css", await fingerprint(join(sourceAssetsDirectory, "site.css")));
  assetVersions.set("site.js", await fingerprint(join(sourceAssetsDirectory, "site.js")));

  const imageFiles = await readdir(sourceImagesDirectory, { withFileTypes: true });
  await Promise.all(imageFiles.filter((entry) => entry.isFile()).map(async (entry) => {
    assetVersions.set(`images/${entry.name}`, await fingerprint(join(sourceImagesDirectory, entry.name)));
  }));
}

function buildHeaders(jsonLdDocuments) {
  const hashes = [...new Set(jsonLdDocuments.map((jsonLd) =>
    `'sha256-${createHash("sha256").update(jsonLd).digest("base64")}'`
  ))].join(" ");
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self'",
    "font-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "img-src 'self' data:",
    "manifest-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    `script-src 'self' ${hashes}`,
    "style-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  const securityHeaders = `/*
  Content-Security-Policy: ${csp}
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Permissions-Policy: accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=15552000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
`;
  const htmlPaths = [
    "/",
    "/index.html",
    "/404.html",
    ...Object.values(pages).filter((page) => page.slug !== "/").flatMap((page) => [
      page.slug,
      `${page.slug}index.html`,
    ]),
  ];
  const cacheRules = htmlPaths.map((path) => `${path}\n  Cache-Control: no-cache, max-age=0, must-revalidate`).join("\n\n");

  return `${securityHeaders}
${cacheRules}

/assets/*
  Cache-Control: public, max-age=86400, must-revalidate

/favicon.svg
  Cache-Control: public, max-age=86400, must-revalidate

/site.webmanifest
  Cache-Control: public, max-age=86400
`;
}

function buildRedirects() {
  return `# Host-level HTTPS and www canonicalization are configured as Cloudflare zone rules.
# Workers Static Assets _redirects supports path redirects, not domain-level rules.
/index.html / 301
/weight /weight-management/ 301
/weight-management /weight-management/ 301
/mens-hormone /mens-hormone-health/ 301
/mens-hormone-health /mens-hormone-health/ 301
/womens-midlife /womens-midlife-care/ 301
/womens-midlife-care /womens-midlife-care/ 301
/how /how-it-works/ 301
/how-it-works /how-it-works/ 301
/priority /priority-list/ 301
/priority-list /priority-list/ 301
`;
}

function buildSitemap() {
  const entries = Object.values(pages).map((page) => `  <url><loc>${escapeXml(canonicalUrl(page.slug))}</loc><lastmod>${buildDate}</lastmod></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function buildFavicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Apex Wellness">
  <rect width="64" height="64" rx="14" fill="#173633"/>
  <path d="M14 46 31.5 14 50 46M22 34h19" fill="none" stroke="#fbf8f3" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="48" cy="16" r="4" fill="#c99a6d"/>
</svg>
`;
}

function buildManifest() {
  return `${JSON.stringify({
    name: site.name,
    short_name: "Apex",
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbf8f3",
    theme_color: "#173633",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  }, null, 2)}\n`;
}

function validateContent() {
  const slugs = new Set();
  const titles = new Set();
  const descriptions = new Set();

  for (const [key, page] of Object.entries(pages)) {
    for (const field of ["slug", "title", "description", "eyebrow", "h1", "intro"]) {
      if (!page[field]) throw new Error(`Page ${key} is missing ${field}.`);
    }
    if (!page.slug.startsWith("/") || !page.slug.endsWith("/")) {
      throw new Error(`Page ${key} must use a root-relative trailing-slash route.`);
    }
    if (slugs.has(page.slug)) throw new Error(`Duplicate page slug: ${page.slug}`);
    if (titles.has(page.title)) throw new Error(`Duplicate page title: ${page.title}`);
    if (descriptions.has(page.description)) throw new Error(`Duplicate page description: ${page.description}`);
    slugs.add(page.slug);
    titles.add(page.title);
    descriptions.add(page.description);
  }
}

async function build() {
  validateContent();
  await rm(publicDirectory, { recursive: true, force: true });
  await prepareAssets();

  const documents = [];
  for (const [pageKey, page] of Object.entries(pages)) {
    const jsonLd = pageJsonLd(page);
    documents.push(jsonLd);
    await writeOutput(outputPathForSlug(page.slug), renderDocument(pageKey, page, jsonLd));
  }

  const notFoundPage = {
    slug: "/404.html",
    navLabel: "Page not found",
    title: "Page Not Found | Apex Wellness",
    description: "The requested Apex Wellness page could not be found.",
    eyebrow: "404 · Page not found",
    h1: "We could not find that page.",
    intro: "The address may have changed. Return home or review the planned areas of care.",
  };
  const notFoundJsonLd = pageJsonLd(notFoundPage);
  documents.push(notFoundJsonLd);
  const notFoundMain = `<main id="main-content" class="page" tabindex="-1"><section class="hero" aria-labelledby="page-title"><div class="container section-narrow"><p class="eyebrow">${escapeHtml(notFoundPage.eyebrow)}</p><h1 id="page-title">${escapeHtml(notFoundPage.h1)}</h1><p>${escapeHtml(notFoundPage.intro)}</p><div class="button-row"><a class="button" href="/">Return home</a><a class="button-secondary" href="/priority-list/">Join the Priority List</a></div></div></section></main>`;
  await writeOutput(join(publicDirectory, "404.html"), renderDocument("404", notFoundPage, notFoundJsonLd, { noIndex: true, mainOverride: notFoundMain }));

  await Promise.all([
    writeOutput(join(publicDirectory, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site.canonicalUrl}/sitemap.xml\n`),
    writeOutput(join(publicDirectory, "sitemap.xml"), buildSitemap()),
    writeOutput(join(publicDirectory, ".assetsignore"), `.git\n.git/**\n**/.git\n**/.git/**\n.*\n**/.*\n*.map\n**/*.map\n*.log\n**/*.log\n**/*.md\n**/*.mjs\n**/*.cjs\n**/*.ts\n**/*.tsx\n**/*.jsx\n**/*.test.*\n**/*.spec.*\n`),
    writeOutput(join(publicDirectory, "_headers"), buildHeaders(documents)),
    writeOutput(join(publicDirectory, "_redirects"), buildRedirects()),
    writeOutput(join(publicDirectory, "favicon.svg"), buildFavicon()),
    writeOutput(join(publicDirectory, "site.webmanifest"), buildManifest()),
  ]);

  console.log(`Built ${Object.keys(pages).length} pages plus 404 into ${publicDirectory}`);
}

await build();

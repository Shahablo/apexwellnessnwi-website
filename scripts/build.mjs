import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { pages, site } from "../src/content.mjs";
import { blogPosts } from "../src/blog-posts.mjs";

const rootDirectory = fileURLToPath(new URL("../", import.meta.url));
const publicDirectory = join(rootDirectory, "public");
const sourceAssetsDirectory = join(rootDirectory, "src", "assets");
const sourceImagesDirectory = join(rootDirectory, "assets", "images");
const publicAssetsDirectory = join(publicDirectory, "assets");
const publicImagesDirectory = join(publicAssetsDirectory, "images");
const buildDate = process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString().slice(0, 10)
  : new Date().toISOString().slice(0, 10);
const publishedBlogPosts = blogPosts
  .filter((post) => post.published <= buildDate && post.status !== "draft")
  .sort((a, b) => b.published.localeCompare(a.published));

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
    alt: "Warm stone, wood, and glass architectural details.",
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
  "founding-patients": imageCatalog.consultation,
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

function imageForPage(pageKey, page) {
  return imageCatalog[page.heroImage] || heroImages[pageKey] || imageCatalog.shoreline;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
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
      sameAs: site.social.filter((profile) => !profile.href.includes('facebook.com/groups/')).map((profile) => profile.href),
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.streetAddress,
        addressLocality: site.address.addressLocality,
        addressRegion: site.address.addressRegion,
        postalCode: site.address.postalCode,
        addressCountry: site.address.addressCountry,
      },
      logo: `${site.canonicalUrl}/assets/images/apex-brand-mark.png`,
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
    const itemListElement = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${site.canonicalUrl}/`,
      },
    ];

    if (page.kind === "blogPost") {
      itemListElement.push({
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${site.canonicalUrl}/blog/`,
      });
    }

    itemListElement.push({
      "@type": "ListItem",
      position: itemListElement.length + 1,
      name: page.kind === 'blogPost' ? page.h1 : (page.navLabel || page.h1),
      item: url,
    });

    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement,
    });
  }

  if (page.kind === "blogPost") {
    const heroImage = imageForPage("blog-post", page);
    graph.push({
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: page.h1,
      description: page.description,
      image: `${site.canonicalUrl}${assetUrl(`images/${heroImage.file}`)}`,
      datePublished: page.published,
      dateModified: page.modified,
      author: {
        "@type": "Organization",
        name: page.author,
        url: `${site.canonicalUrl}/about/`,
      },
      publisher: { "@id": `${site.canonicalUrl}/#organization` },
      mainEntityOfPage: { "@id": `${url}#webpage` },
      articleSection: page.category,
      inLanguage: "en-US",
    });
  }

  return jsonForScript({ "@context": "https://schema.org", "@graph": graph });
}

function imageMarkup(image, { hero = false } = {}) {
  const loading = hero
    ? 'loading="eager" fetchpriority="high"'
    : 'loading="lazy"';

  return `<figure class="representative">
    <img data-photo-kind="representative" src="${escapeHtml(assetUrl(`images/${image.file}`))}" width="${image.width}" height="${image.height}" alt="${escapeHtml(image.alt)}" ${loading} decoding="async">
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
  return `<div class="care-cards" id="care-areas">
    ${items.map((item) => {
      const image = careCardImages[item.href];
      return `<article class="care-card">
        ${image ? imageMarkup(image) : ""}
        <div class="care-card-body">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
          <a class="text-link" href="${escapeHtml(item.href)}" aria-label="Explore ${escapeHtml(item.title)}">Explore care <span aria-hidden="true">↗</span></a>
        </div>
      </article>`;
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

function foundingConsultationFormMarkup(form) {
  return `<div class="form-card conversion-form-card" id="consultation-request" tabindex="-1">
    <p class="eyebrow">Private contact request</p>
    <h2 id="consultation-form-heading">${escapeHtml(form.heading)}</h2>
    <p id="form-guidance">${escapeHtml(form.privacyNote)}</p>
    <form id="consultation-form" action="${escapeHtml(form.action)}" method="${escapeHtml(form.method)}" aria-labelledby="consultation-form-heading" aria-describedby="form-guidance" data-success-message="${escapeHtml(form.successMessage)}">
      <div class="field field-full">
        <label for="full-name">Name</label>
        <input id="full-name" name="full_name" type="text" autocomplete="name" minlength="2" maxlength="100" aria-describedby="full-name-help" required>
        <p id="full-name-help" class="field-help">Enter the name you would like Apex to use when contacting you.</p>
      </div>
      <div class="field field-full">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="254" aria-describedby="email-help" required>
        <p id="email-help" class="field-help">We will use this address only as described in the Privacy Policy.</p>
      </div>
      <div class="field-honeypot" aria-hidden="true">
        <label for="website">Leave this field blank</label>
        <input id="website" name="website" type="text" tabindex="-1" autocomplete="off" maxlength="200" aria-hidden="true">
      </div>
      <input name="consent_version" type="hidden" value="${escapeHtml(form.consentVersion)}">
      <input name="form_started_at" type="hidden">
      <label class="consent field-full consent-optional" for="accessibility-request">
        <input id="accessibility-request" name="accessibility_request" type="checkbox" value="true" aria-describedby="accessibility-request-help">
        <span id="accessibility-request-help">${escapeHtml(form.accessibilityLabel)}</span>
      </label>
      <label class="consent field-full" for="contact-consent">
        <input id="contact-consent" name="contact_consent" type="checkbox" value="true" aria-describedby="contact-consent-help" required>
        <span id="contact-consent-help">I ask Apex Wellness to email me about this request. For a consultation request, emails may include verified opening information and future consultation availability. I understand that this form does not confirm an appointment or establish care. I may unsubscribe from promotional email at any time, and I acknowledge the <a href="/privacy/">Privacy Policy</a> and <a href="/communications-consent/">Communications Consent</a>.</span>
      </label>
      <button class="button" type="submit" data-loading-label="Submitting…">${escapeHtml(form.submitLabel)}</button>
      <p id="form-status" class="form-status" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"></p>
      <noscript><p class="form-status is-visible is-error">JavaScript is required to submit this secure contact request.</p></noscript>
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

    case "teamCards":
      return `<section class="section team-section" aria-labelledby="${id}"><div class="container">
        ${headingMarkup(section, id)}${cardsMarkup(section.cards)}
      </div></section>`;

    case 'teamProfiles':
      return `<section class="section people-section" aria-labelledby="${id}"><div class="container">
        <div class="people-introduction">${headingMarkup(section, id)}<p>${escapeHtml(section.intro)}</p></div>
        <div class="team-profiles">${section.profiles.map((person) => `<article class="team-profile${person.image ? '' : ' team-profile-text'}" id="${escapeHtml(person.id)}" aria-labelledby="${escapeHtml(person.id)}-name">
          ${person.image ? `<figure class="team-portrait"><img data-photo-kind="portrait" src="${escapeHtml(assetUrl(`images/${person.image.file}`))}" width="${person.image.width}" height="${person.image.height}" alt="${escapeHtml(person.name)}" loading="lazy" decoding="async"><figcaption>${escapeHtml(person.name)}</figcaption></figure>` : `<div class="portrait-pending" aria-label="Atif Muhammad’s portrait is coming soon"><span aria-hidden="true">AM</span><p>Portrait coming soon</p></div>`}
          <div class="team-biography"><p class="eyebrow">${escapeHtml(person.context)}</p><h3 id="${escapeHtml(person.id)}-name">${escapeHtml(person.name)}</h3><p class="team-headline">${escapeHtml(person.headline)}</p>${person.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}<p class="team-aside">${escapeHtml(person.aside)}</p>${person.profileUrl ? `<a class="text-link" href="${escapeHtml(person.profileUrl)}" target="_blank" rel="noreferrer">Professional profile<span aria-hidden="true">↗</span><span class="visually-hidden"> (opens a new tab)</span></a>` : ''}</div>
        </article>`).join('')}</div>
        <p class="team-care-note">${escapeHtml(section.note)}</p>
      </div></section>`;

    case "cards":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container">
        ${headingMarkup(section, id)}${careCardsMarkup(section.cards)}
      </div></section>`;

    case "steps":
      return `<section class="section${alternatingClass}" aria-labelledby="${id}"><div class="container">
        ${headingMarkup(section, id)}
        <ol class="steps">${section.items.map((item, stepIndex) => `<li class="step"><span class="step-number" aria-hidden="true">${String(stepIndex + 1).padStart(2, '0')}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></li>`).join("\n")}</ol>
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
      return `<section class="section section-editorial audience-section" aria-labelledby="${id}"><div class="container editorial-row">
        ${headingMarkup(section, id)}<div class="editorial-copy"><p>${escapeHtml(section.body)}</p><p class="quiet-note"><strong>Good to know:</strong> ${escapeHtml(section.note)}</p></div>
      </div></section>`;

    case "detail":
    case "followUp":
    case "referral":
    case "status":
    case "notice":
    case "verificationStatus":
      return `<section class="section section-editorial section-${section.type}" aria-labelledby="${id}"><div class="container editorial-row">
        ${headingMarkup(section, id)}<div class="editorial-copy"><p>${escapeHtml(section.body)}</p></div>
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
      return `<section class="section faq-section" aria-labelledby="${id}"><div class="container editorial-row">
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
  if (pageKey === 'about') return `<header class="journal-header about-header"><div class="container"><div><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h1 id="page-title">${escapeHtml(page.h1)}</h1></div><div class="about-deck"><p>${escapeHtml(page.intro)}</p><a class="text-link" href="#shahab-siddique">Meet the people behind the practice <span aria-hidden="true">↓</span></a></div></div></header>`;
  if (pageKey === 'home') return `<section class="signature-hero" aria-labelledby="page-title">
    <div class="signature-image">${imageMarkup(imageCatalog.shoreline, { hero: true })}</div>
    <div class="container signature-content"><p class="eyebrow">Physician-led wellness · Northwest Indiana</p>
      <h1 id="page-title">${escapeHtml(page.headlineLead)} <em>${escapeHtml(page.headlineEmphasis)}</em></h1>
      <div class="signature-bottom"><div><p>Weight, metabolic, and hormone care.<br>Built around your health history and the goals that matter to you.</p><div class="hero-actions">${buttonMarkup(site.cta)}<a class="hero-explore" href="#care-areas">Discover our approach <span aria-hidden="true">↗</span></a></div></div><p class="signature-launch"><span class="launch-dot" aria-hidden="true"></span>Planned launch<br><strong>${escapeHtml(site.launch.label)}</strong><span class="signature-launch-note">Coming soon · Subject to readiness</span></p></div>
    </div>
  </section>`;
  const image = imageForPage(pageKey, page);
  return `<section class="hero" aria-labelledby="page-title"><div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
      <h1 id="page-title">${escapeHtml(page.h1)}</h1>
      <p>${escapeHtml(page.intro)}</p>
      <div class="hero-actions">${buttonMarkup(page.cta)}${page.secondaryCta ? buttonMarkup(page.secondaryCta, true) : ""}</div>
      ${page.ctaNote ? `<p class="cta-note">${escapeHtml(page.ctaNote)}</p>` : ""}
    </div>
    <div class="hero-media">${imageMarkup(image, { hero: true })}</div>
  </div></section>`;
}

function renderBlogIndex(page) {
  const articleCards = publishedBlogPosts.map((post) => {
    const image = imageForPage("blog-post", post);
    return `<article class="blog-card">
      <a class="blog-card-image" href="${escapeHtml(post.slug)}" aria-label="Read ${escapeHtml(post.h1)}">${imageMarkup(image)}</a>
      <div class="blog-card-body">
        <p class="article-kicker">${escapeHtml(post.category)}</p>
        <h2><a href="${escapeHtml(post.slug)}">${escapeHtml(post.h1)}</a></h2>
        <p>${escapeHtml(post.excerpt)}</p>
        <p class="article-card-meta"><time datetime="${escapeHtml(post.published)}">${escapeHtml(formatDate(post.published))}</time> · ${escapeHtml(post.readTime || "8 minute read")}</p>
      </div>
    </article>`;
  }).join("\n");

  return `<main id="main-content" class="page" tabindex="-1">
    <header class="journal-header"><div class="container"><div><p class="eyebrow">The Apex journal</p><h1 id="page-title">${escapeHtml(page.h1)}</h1></div><p class="journal-deck">${escapeHtml(page.intro)}</p></div></header>
    <section class="section" aria-labelledby="latest-articles"><div class="container">
      <div class="section-heading"><p class="eyebrow">Latest articles</p><h2 id="latest-articles">Start with the question already on your mind.</h2><p>Practical reflections, practice updates, and source-backed health education. Each article is clear about its scope and what belongs in an individual clinical conversation.</p></div>
      <div class="blog-grid">${articleCards}</div>
    </div></section>
  </main>`;
}

function renderHome(page) {
  const editorial = page.editorial;
  const physician = pages.about.sections.find((section) => section.type === 'teamProfiles').profiles.find((person) => person.id === 'atif-muhammad');
  const care = page.sections.find((section) => section.type === 'cards');
  const local = page.sections.find((section) => section.type === 'serviceArea');
  const latest = publishedBlogPosts[0];
  const multiline = (text) => escapeHtml(text).replaceAll('\n', '<br>');
  return `<main id="main-content" class="page" tabindex="-1">
    ${renderHero('home', page)}
    <section class="physician-section" id="apex-approach" aria-labelledby="physician-heading"><div class="physician-image physician-portrait"><figure><img data-photo-kind="portrait" src="${escapeHtml(assetUrl(`images/${physician.image.file}`))}" width="${physician.image.width}" height="${physician.image.height}" alt="${escapeHtml(physician.name)}" loading="lazy" decoding="async"></figure></div><div class="physician-content">
      <p class="eyebrow">The people behind the practice</p><h2 id="physician-heading">${multiline(editorial.physicianHeading)}</h2><p>${escapeHtml(editorial.physicianBody)}</p>
      <ul class="physician-names"><li>Atif Muhammad<span>MD</span></li></ul>
      <a class="text-link" href="/about/">Our approach to care <span aria-hidden="true">↗</span></a>
    </div></section>
    <section class="section home-care-section" aria-labelledby="care-heading"><div class="container">
      <div class="section-heading heading-with-aside"><div><p class="eyebrow">Three areas of care</p><h2 id="care-heading">${multiline(editorial.careHeading)}</h2></div><p>Individual evaluation comes first.<br>Treatment is a clinical decision,<br>never a one-size-fits-all promise.</p></div>
      ${careCardsMarkup(care.cards)}
    </div></section>
    <section class="section home-process" aria-labelledby="process-heading"><div class="container">
      <div class="section-heading heading-with-aside"><div><p class="eyebrow">Your next step</p><h2 id="process-heading">${multiline(editorial.processHeading)}</h2></div><a class="text-link" href="/how-it-works/">How it works <span aria-hidden="true">↗</span></a></div>
      <ol class="steps">${editorial.process.map((step, index) => `<li class="step"><span class="step-number" aria-hidden="true">0${index + 1}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.body)}</p></li>`).join('')}</ol>
    </div></section>
    ${latest ? `<section class="section home-journal" aria-labelledby="journal-heading"><div class="container">
      <div class="section-heading heading-with-aside"><div><p class="eyebrow">The Apex journal</p><h2 id="journal-heading">A little more understanding.</h2></div><a class="text-link" href="/blog/">Explore the blog <span aria-hidden="true">↗</span></a></div>
      <article class="journal-feature"><a class="journal-feature-image" href="${escapeHtml(latest.slug)}" aria-label="Read ${escapeHtml(latest.h1)}">${imageMarkup(imageForPage('blog-post', latest))}</a><div><p class="eyebrow">${escapeHtml(latest.category)} · ${escapeHtml(latest.readTime || '8 minute read')}</p><h3><a href="${escapeHtml(latest.slug)}">${escapeHtml(latest.h1)}</a></h3><p>${escapeHtml(latest.excerpt)}</p><a class="text-link" href="${escapeHtml(latest.slug)}">Read the article <span aria-hidden="true">↗</span></a><p class="quiet-note">General education. Your own care starts with a clinical conversation.</p></div></article>
    </div></section>` : ''}
    <section class="section local-section" aria-labelledby="local-heading"><div class="container editorial-row"><div><p class="eyebrow">Rooted in our region</p><h2 id="local-heading">For life in<br>Northwest Indiana.</h2></div><div class="editorial-copy"><p>${escapeHtml(local.body)}</p><a class="text-link" href="/faq/">Opening & location questions <span aria-hidden="true">↗</span></a></div></div></section>
    ${renderLaunchCta()}
  </main>`;
}

function renderLaunchCta() {
  return `<section class="section launch-section" aria-labelledby="launch-heading"><div class="container launch-section-inner"><div><p class="eyebrow">${escapeHtml(site.launch.status)} · ${escapeHtml(site.launch.label)}</p><h2 id="launch-heading">Be part of<br><em>what comes next.</em></h2></div><div class="launch-section-copy"><p>Opening updates and future consultation availability, delivered to your inbox.</p>${buttonMarkup(site.cta)}<p class="quiet-note">Free to join. No appointment booked. Launch timing and availability may change.</p></div></div></section>`;
}

function renderBlogPost(page) {
  const image = imageForPage("blog-post", page);
  const introParagraphs = page.intro.split(/\n\s*\n/).map((paragraph) => `<p class="article-deck">${escapeHtml(paragraph)}</p>`).join("\n");
  const sourceList = page.sources.map((source) => `<li><a href="${escapeHtml(source.href)}">${escapeHtml(source.label)}</a></li>`).join("\n");
  const articleSections = page.sections.map((section, index) => {
    const id = `${identifier(section.heading)}-${index + 1}`;
    return `<section aria-labelledby="${id}">
      <h2 id="${id}">${escapeHtml(section.heading)}</h2>
      ${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
      ${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}</ul>` : ""}
      ${(section.paragraphsAfterBullets || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
    </section>`;
  }).join("\n");
  const disclaimer = page.disclaimer || "This article is for general education and is not medical advice, diagnosis, or treatment. Talk with a qualified healthcare professional who knows your circumstances before changing your care. For a medical emergency, call 911 or go to the nearest emergency department.";
  const disclaimerHeading = page.disclaimerHeading || "A quick medical note";

  return `<main id="main-content" class="page" tabindex="-1">
    <article class="article-shell">
      <header class="article-header">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog/">Blog</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(page.h1)}</span></nav>
        <p class="article-kicker">${escapeHtml(page.category)}</p>
        <h1 id="page-title">${escapeHtml(page.h1)}</h1>
        ${introParagraphs}
        <p class="article-meta">By ${escapeHtml(page.author)} · <time datetime="${escapeHtml(page.published)}">Published ${escapeHtml(formatDate(page.published))}</time>${page.modified !== page.published ? ` · <time datetime="${escapeHtml(page.modified)}">Updated ${escapeHtml(formatDate(page.modified))}</time>` : ""}</p>
        ${imageMarkup(image, { hero: true })}
      </header>
      <div class="article-body">
        <nav class="article-contents" aria-label="In this article"><h2>In this article</h2><ul>${page.sections.map((section, index) => `<li><a href="#${identifier(section.heading)}-${index + 1}">${escapeHtml(section.heading)}</a></li>`).join('')}</ul></nav>
        ${articleSections}
        <aside class="medical-note" aria-labelledby="medical-disclaimer"><h2 id="medical-disclaimer">${escapeHtml(disclaimerHeading)}</h2><p>${escapeHtml(disclaimer)}</p></aside>
        <section class="article-sources" aria-labelledby="sources-reviewed"><h2 id="sources-reviewed">Sources reviewed</h2><ul>${sourceList}</ul><p class="editorial-note">${escapeHtml(page.editorialNote || "Published by Apex Wellness for general education. No individual physician medical review is claimed unless a reviewer is explicitly named. Sources and publication dates are provided so you can evaluate the information; your own care requires a clinical conversation.")}</p></section>
        <section class="article-cta" aria-labelledby="keep-exploring"><p class="eyebrow">Keep exploring</p><h2 id="keep-exploring">Useful information is a start. Individual care is the next step.</h2><p>${escapeHtml(page.ctaBody || "Apex Wellness is preparing to open in Northwest Indiana. A consultation request is free and does not book an appointment, establish care, or guarantee treatment.")}</p><div class="button-row">${buttonMarkup(page.relatedService, true)}${buttonMarkup(site.cta)}</div></section>
      </div>
    </article>
  </main>`;
}

function renderConversionHero(page) {
  return `<section class="hero conversion-hero" aria-labelledby="page-title"><div class="container conversion-grid">
    <div class="hero-copy conversion-copy">
      <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
      <h1 id="page-title">${escapeHtml(page.h1)}</h1>
      <p>${escapeHtml(page.intro)}</p>
      <div class="hero-actions">${buttonMarkup(page.cta)}${buttonMarkup(page.secondaryCta, true)}</div>
      <p class="cta-note">${escapeHtml(page.ctaNote)}</p>
    </div>
    ${foundingConsultationFormMarkup(page.form)}
    <div class="conversion-image">${imageMarkup(imageCatalog.consultation)}</div>
  </div></section>`;
}

function renderMain(pageKey, page) {
  if (pageKey === 'home') return renderHome(page);
  if (page.kind === "blogIndex") return renderBlogIndex(page);
  if (page.kind === "blogPost") return renderBlogPost(page);

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
    ${page.landing ? renderConversionHero(page) : renderHero(pageKey, page)}
    ${page.sections.map(renderSection).join("\n")}
    ${page.landing ? '' : renderLaunchCta()}
  </main>`;
}

function renderNavigation(page) {
  const visibleLinks = [site.navigation[6], site.navigation[4], site.navigation[5], site.navigation[7], site.navigation[8]];
  const links = visibleLinks.map((item) => {
    const current = item.href === page.slug || (page.kind === "blogPost" && item.href === "/blog/") ? ' aria-current="page"' : "";
    return `<li><a href="${escapeHtml(item.href)}"${current}>${escapeHtml(item.label)}</a></li>`;
  }).join("\n");

  return `<header class="site-header">
    <div class="container site-header-inner">
      <a class="brand premium-brand" href="/" aria-label="Apex Wellness home"${page.slug === '/' ? ' aria-current="page"' : ''}><span>Apex</span><small>WELLNESS</small></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open main menu">
        <span class="nav-toggle-label">Menu</span><span class="nav-toggle-icon" aria-hidden="true"></span>
      </button>
      <nav id="primary-navigation" class="site-nav" aria-label="Primary navigation">
        <ul><li class="care-navigation"><details><summary>Our care</summary><div class="care-dropdown">${site.navigation.slice(1,4).map((item) => `<a href="${item.href}"${item.href === page.slug ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}<span aria-hidden="true">↗</span></a>`).join('')}</div></details></li>${links}</ul>
        <a class="nav-cta" href="${escapeHtml(site.cta.href)}"${site.cta.href === page.slug ? ' aria-current="page"' : ""}>${escapeHtml(site.cta.label)}</a>
      </nav>
    </div>
  </header><noscript><nav class="no-js-navigation container" aria-label="Navigation without JavaScript">${site.navigation.map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join('')}</nav></noscript>`;
}

function renderLandingNavigation() {
  return `<header class="site-header landing-header">
    <div class="container site-header-inner">
      <a class="brand premium-brand" href="/" aria-label="Apex Wellness home"><span>Apex</span><small>WELLNESS</small></a>
      <nav class="landing-nav" aria-label="Founding Patient page navigation">
        <a href="/">Explore full site</a>
        <a class="nav-cta" href="#consultation-request">Join the launch list</a>
      </nav>
    </div>
  </header>`;
}

function renderFooter(page) {
  const footerLink = (item) => `<li><a href="${escapeHtml(item.href)}"${item.href === page.slug || (page.kind === "blogPost" && item.href === "/blog/") ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a></li>`;
  const careLinks = site.navigation.slice(1, 4).map(footerLink).join("");
  const infoLinks = site.navigation.slice(4).map(footerLink).join("");
  const policyLinks = site.policyNavigation.map(footerLink).join("");

  return `<footer class="site-footer"><div class="container">
    <div class="footer-signature"><a href="/" aria-label="Apex Wellness home">Apex Wellness<span aria-hidden="true">↗</span></a><p>${escapeHtml(site.tagline)}</p></div>
    <div class="footer-grid">
      <div><p class="eyebrow">Northwest Indiana</p><p>${escapeHtml(site.footer.summary)}</p><p>${escapeHtml(site.footer.location)}</p><nav class="social-links" aria-label="Apex social profiles">${site.social.map((profile) => `<a href="${escapeHtml(profile.href)}" rel="me noreferrer" target="_blank">${escapeHtml(profile.label)}<span class="visually-hidden"> (opens a new tab)</span></a>`).join('')}</nav></div>
      <nav aria-label="Care areas"><h2>Care areas</h2><ul>${careLinks}</ul></nav>
      <nav aria-label="Site information"><h2>Information</h2><ul>${infoLinks}</ul></nav>
      <nav aria-label="Policies"><h2>Policies</h2><ul>${policyLinks}</ul></nav>
    </div>
    <div class="footer-meta"><p>${escapeHtml(site.notices.prelaunch)}</p><p>${escapeHtml(site.notices.medical)}</p><p>${escapeHtml(site.notices.emergency)}</p><p>${escapeHtml(site.footer.copyright)}</p></div>
  </div></footer>`;
}

function renderSiteHelp(page) {
  const launchPrompt = !page.landing && !page.effectiveDate ? `<aside class="launch-prompt" id="launch-prompt" aria-labelledby="launch-prompt-title" hidden>
    <button class="widget-close" id="dismiss-launch" aria-label="Dismiss launch invitation" type="button">×</button>
    <p class="eyebrow">${escapeHtml(site.launch.status)} · ${escapeHtml(site.launch.label)}</p>
    <h2 id="launch-prompt-title">Be part of what comes next.</h2>
    <p>Opening updates and future consultation availability. Just your name and email.</p>
    ${buttonMarkup(site.cta)}<p class="widget-note">Free to join. No appointment booked.</p>
  </aside>` : '';
  return `${launchPrompt}
  <div class="site-help" data-launch-label="${escapeHtml(site.launch.label)}">
    <button id="help-toggle" class="help-toggle" type="button" aria-expanded="false" aria-controls="site-help-panel" hidden><span aria-hidden="true">✦</span> Ask Apex</button>
    <section id="site-help-panel" class="help-panel" aria-labelledby="help-heading" hidden>
      <header class="help-header"><div><p class="eyebrow">Website guide · Automated</p><h2 id="help-heading">How can I help you?</h2></div><button id="help-close" class="widget-close" type="button" aria-label="Close website guide">×</button></header>
      <p class="help-disclosure" id="help-disclosure">Ask about the clinic, launch list, or website. This is not a person or medical advice. Please do not enter personal or medical information. Questions stay in this page and are not sent to Apex or an AI service.</p>
      <div id="help-answer" class="help-answer" role="status" aria-live="polite" aria-atomic="true"><p>Try “When do you open?” or “How do I join the launch list?”</p></div>
      <div class="help-topics" aria-label="Common questions"><button type="button" data-help-question="When do you open?">Opening</button><button type="button" data-help-question="What care do you offer?">Care areas</button><button type="button" data-help-question="What does care cost?">Pricing</button></div>
      <form id="site-help-form" aria-label="Ask a website question"><label for="help-question">Your website question</label><div class="help-input-row"><input id="help-question" type="text" maxlength="500" autocomplete="off" placeholder="Type a question…" aria-describedby="help-disclosure" required><button type="submit">Ask</button></div></form>
      <p class="widget-note">Not monitored. For a medical emergency, call 911. <a href="/faq/">All FAQs</a></p>
    </section>
  </div>`;
}

function renderDocument(pageKey, page, jsonLd, { noIndex = false, mainOverride = "" } = {}) {
  const canonical = canonicalUrl(page.slug);
  const heroImage = page.kind === 'blogPost' ? imageForPage(pageKey, page) : { file: 'apex-social-preview.png', width: 1200, height: 630, alt: 'Apex Wellness — Physician-led care. Built around you. Northwest Indiana.' };
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
  <meta property="og:type" content="${page.kind === "blogPost" ? "article" : "website"}">
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
  ${page.kind === "blogPost" ? `<meta property="article:published_time" content="${escapeHtml(page.published)}">
  <meta property="article:modified_time" content="${escapeHtml(page.modified)}">
  <meta property="article:section" content="${escapeHtml(page.category)}">` : ""}
  <link rel="alternate" type="application/rss+xml" title="Apex Wellness Blog" href="/blog/feed.xml">
  <link rel="stylesheet" href="${escapeHtml(assetUrl("site.css"))}">
  <link rel="stylesheet" href="${escapeHtml(assetUrl("site-design.css"))}">
  <link rel="preload" as="font" href="/assets/fonts/instrument-serif-latin-400-normal.woff2" type="font/woff2" crossorigin>
  <link rel="preload" as="font" href="/assets/fonts/manrope-latin-wght-normal.woff2" type="font/woff2" crossorigin>
  <script type="application/ld+json">${jsonLd}</script>
  <script src="${escapeHtml(assetUrl("site.js"))}" defer></script>
  <script src="${escapeHtml(assetUrl("site-assistant.js"))}" defer></script>
</head>
<body class="page-${escapeHtml(pageKey)}${page.landing ? ' landing-page' : ''}">
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <div class="announcement" role="status"><span class="announcement-copy">${escapeHtml(site.announcement)}</span> <a class="announcement-cta" href="${page.landing ? "#consultation-request" : escapeHtml(site.cta.href)}">${escapeHtml(site.cta.label)} <span aria-hidden="true">↗</span></a></div>
  ${page.landing ? renderLandingNavigation() : renderNavigation(page)}
  ${mainOverride || renderMain(pageKey, page)}
  ${renderFooter(page)}
  ${page.landing ? '<a class="mobile-conversion-cta" href="#consultation-request">Join the launch list</a>' : ""}
  ${renderSiteHelp(page)}
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
  await cp(join(sourceAssetsDirectory, 'site-design.css'), join(publicAssetsDirectory, 'site-design.css'));
  const fontDirectory = join(publicAssetsDirectory, 'fonts');
  await mkdir(fontDirectory, { recursive: true });
  for (const file of ['instrument-serif-latin-400-normal.woff2', 'instrument-serif-latin-400-italic.woff2']) {
    await cp(join(rootDirectory, 'node_modules/@fontsource/instrument-serif/files', file), join(fontDirectory, file));
  }
  await cp(join(rootDirectory, 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'), join(fontDirectory, 'manrope-latin-wght-normal.woff2'));
  await cp(join(rootDirectory, 'node_modules/@fontsource/instrument-serif/LICENSE'), join(fontDirectory, 'instrument-serif-license.txt'));
  await cp(join(rootDirectory, 'node_modules/@fontsource-variable/manrope/LICENSE'), join(fontDirectory, 'manrope-license.txt'));
  const helpEngine = (await readFile(join(sourceAssetsDirectory, "site-help.mjs"), 'utf8')).replace('export function', 'function');
  const helpUi = (await readFile(join(sourceAssetsDirectory, "site-assistant.mjs"), 'utf8')).replace(/^import .*?;\r?\n/, '');
  await writeOutput(join(publicAssetsDirectory, 'site-assistant.js'), `(() => {\n'use strict';\n${helpEngine}\n${helpUi}\n})();\n`);
  await cp(sourceImagesDirectory, publicImagesDirectory, { recursive: true });

  assetVersions.set("site.css", await fingerprint(join(sourceAssetsDirectory, "site.css")));
  assetVersions.set("site.js", await fingerprint(join(sourceAssetsDirectory, "site.js")));
  assetVersions.set('site-design.css', await fingerprint(join(sourceAssetsDirectory, 'site-design.css')));
  assetVersions.set('site-assistant.js', await fingerprint(join(publicAssetsDirectory, 'site-assistant.js')));

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
    ...publishedBlogPosts.flatMap((post) => [post.slug, `${post.slug}index.html`]),
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

/blog/feed.xml
  Cache-Control: public, max-age=3600, must-revalidate
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
/priority /founding-patients/ 301
/priority/ /founding-patients/ 301
/priority-list /founding-patients/ 301
/priority-list/ /founding-patients/ 301
/founding-patients /founding-patients/ 301
`;
}

function buildSitemap() {
  const entries = [...Object.values(pages), ...publishedBlogPosts]
    .map((page) => `  <url><loc>${escapeXml(canonicalUrl(page.slug))}</loc><lastmod>${escapeXml(page.modified || site.contentUpdated)}</lastmod></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function buildRssFeed() {
  const items = [...publishedBlogPosts]
    .sort((a, b) => b.published.localeCompare(a.published))
    .map((post) => `<item>
      <title>${escapeXml(post.h1)}</title>
      <link>${escapeXml(canonicalUrl(post.slug))}</link>
      <guid isPermaLink="true">${escapeXml(canonicalUrl(post.slug))}</guid>
      <pubDate>${new Date(`${post.published}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
    </item>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Apex Wellness Blog</title>
    <link>${escapeXml(`${site.canonicalUrl}/blog/`)}</link>
    <description>${escapeXml(pages.blog.description)}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>
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

  for (const [index, post] of blogPosts.entries()) {
    const key = `blogPosts[${index}]`;
    for (const field of ["slug", "title", "description", "h1", "intro", "excerpt", "published", "modified", "category", "author", "heroImage"]) {
      if (!post[field]) throw new Error(`${key} is missing ${field}.`);
    }
    if (!post.slug.startsWith("/blog/") || !post.slug.endsWith("/")) {
      throw new Error(`${key} must use a trailing-slash route under /blog/.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.published) || !/^\d{4}-\d{2}-\d{2}$/.test(post.modified)) {
      throw new Error(`${key} must use YYYY-MM-DD publication dates.`);
    }
    if (!post.sections?.length) throw new Error(`${key} needs article sections.`);
    if (!post.sources?.length) throw new Error(`${key} needs reviewed sources.`);
    if (!post.relatedService?.href || !post.relatedService?.label) throw new Error(`${key} needs a related service link.`);
    if (!imageCatalog[post.heroImage]) throw new Error(`${key} uses an unknown hero image.`);
    if (slugs.has(post.slug)) throw new Error(`Duplicate page slug: ${post.slug}`);
    if (titles.has(post.title)) throw new Error(`Duplicate page title: ${post.title}`);
    if (descriptions.has(post.description)) throw new Error(`Duplicate page description: ${post.description}`);
    slugs.add(post.slug);
    titles.add(post.title);
    descriptions.add(post.description);
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

  for (const post of publishedBlogPosts) {
    const page = { ...post, kind: "blogPost", navLabel: "Blog" };
    const jsonLd = pageJsonLd(page);
    documents.push(jsonLd);
    await writeOutput(outputPathForSlug(page.slug), renderDocument("blog-post", page, jsonLd));
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
  const notFoundMain = `<main id="main-content" class="page" tabindex="-1"><section class="hero" aria-labelledby="page-title"><div class="container section-narrow"><p class="eyebrow">${escapeHtml(notFoundPage.eyebrow)}</p><h1 id="page-title">${escapeHtml(notFoundPage.h1)}</h1><p>${escapeHtml(notFoundPage.intro)}</p><div class="button-row"><a class="button" href="/">Return home</a><a class="button-secondary" href="/founding-patients/">Request a Consultation</a></div></div></section></main>`;
  await writeOutput(join(publicDirectory, "404.html"), renderDocument("404", notFoundPage, notFoundJsonLd, { noIndex: true, mainOverride: notFoundMain }));

  await Promise.all([
    writeOutput(join(publicDirectory, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site.canonicalUrl}/sitemap.xml\n`),
    writeOutput(join(publicDirectory, "sitemap.xml"), buildSitemap()),
    writeOutput(join(publicDirectory, "blog", "feed.xml"), buildRssFeed()),
    writeOutput(join(publicDirectory, ".assetsignore"), `.git\n.git/**\n**/.git\n**/.git/**\n.*\n**/.*\n*.map\n**/*.map\n*.log\n**/*.log\n**/*.md\n**/*.mjs\n**/*.cjs\n**/*.ts\n**/*.tsx\n**/*.jsx\n**/*.test.*\n**/*.spec.*\n`),
    writeOutput(join(publicDirectory, "_headers"), buildHeaders(documents)),
    writeOutput(join(publicDirectory, "_redirects"), buildRedirects()),
    writeOutput(join(publicDirectory, "favicon.svg"), buildFavicon()),
    writeOutput(join(publicDirectory, "site.webmanifest"), buildManifest()),
  ]);

  console.log(`Built ${Object.keys(pages).length + publishedBlogPosts.length} pages plus 404 into ${publicDirectory}`);
}

await build();

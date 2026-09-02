import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { pages, site } from "../src/content.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = join(projectRoot, "public");
const pageList = Object.values(pages);

function pageOutputPath(slug) {
  if (slug === "/") return join(publicRoot, "index.html");
  return join(publicRoot, slug.replace(/^\/+|\/+$/g, ""), "index.html");
}

function decodeHtml(value = "") {
  const named = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: "\u00a0", quot: '"' };
  return value.replace(/&(?:#x([\da-f]+)|#(\d+)|([a-z]+));/gi, (entity, hex, decimal, name) => {
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    if (decimal) return String.fromCodePoint(Number.parseInt(decimal, 10));
    return named[name.toLowerCase()] ?? entity;
  });
}

function attributes(source = "") {
  const parsed = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of source.matchAll(pattern)) {
    parsed[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return parsed;
}

function startTags(html, tagName) {
  const expression = new RegExp(`<${tagName}\\b([^>]*)>`, "gi");
  return [...html.matchAll(expression)].map((match) => ({
    raw: match[0],
    attrs: attributes(match[1]),
    index: match.index,
  }));
}

function metaContent(html, key) {
  const wanted = key.toLowerCase();
  const meta = startTags(html, "meta").find(({ attrs }) =>
    attrs.name?.toLowerCase() === wanted || attrs.property?.toLowerCase() === wanted);
  return meta?.attrs.content;
}

function linkHref(html, rel) {
  const wanted = rel.toLowerCase();
  const link = startTags(html, "link").find(({ attrs }) =>
    (attrs.rel || "").toLowerCase().split(/\s+/).includes(wanted));
  return link?.attrs.href;
}

function titleText(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtml(match[1].replace(/<[^>]+>/g, "").trim()) : "";
}

function canonicalFor(page) {
  return new URL(page.slug, site.canonicalUrl).href;
}

function findElementWithId(html, id) {
  return new RegExp(`\\bid=(?:"${id}"|'${id}')`, "i").test(html);
}

function outputTargetForPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const clean = decoded.replace(/^\/+/, "");
  const candidate = resolve(publicRoot, clean);
  if (candidate !== publicRoot && !candidate.startsWith(`${publicRoot}\\`) && !candidate.startsWith(`${publicRoot}/`)) {
    return null;
  }
  if (pathname.endsWith("/") || extname(candidate) === "") return join(candidate, "index.html");
  return candidate;
}

async function allFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await allFiles(path));
    else files.push(path);
  }
  return files;
}

assert.ok(existsSync(publicRoot), "public/ is missing; run `node scripts/build.mjs` before this test suite");

const htmlBySlug = new Map();
for (const page of pageList) {
  const output = pageOutputPath(page.slug);
  assert.ok(existsSync(output), `missing generated page for ${page.slug}: ${relative(projectRoot, output)}`);
  htmlBySlug.set(page.slug, await readFile(output, "utf8"));
}

test("build emits every content page with unique, route-specific metadata", () => {
  const observed = {
    title: [],
    description: [],
    canonical: [],
    ogTitle: [],
    ogDescription: [],
    ogUrl: [],
    twitterTitle: [],
    twitterDescription: [],
    jsonLd: [],
  };

  for (const page of pageList) {
    const html = htmlBySlug.get(page.slug);
    const canonical = canonicalFor(page);
    const jsonLdScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
      .filter(([, rawAttrs]) => attributes(rawAttrs).type?.toLowerCase() === "application/ld+json")
      .map(([, , body]) => JSON.parse(body));

    assert.equal(titleText(html), page.title, `${page.slug} title`);
    assert.equal(metaContent(html, "description"), page.description, `${page.slug} description`);
    assert.equal(linkHref(html, "canonical"), canonical, `${page.slug} canonical`);
    assert.equal(metaContent(html, "og:title"), page.title, `${page.slug} og:title`);
    assert.equal(metaContent(html, "og:description"), page.description, `${page.slug} og:description`);
    assert.equal(metaContent(html, "og:url"), canonical, `${page.slug} og:url`);
    assert.equal(metaContent(html, "twitter:title"), page.title, `${page.slug} twitter:title`);
    assert.equal(metaContent(html, "twitter:description"), page.description, `${page.slug} twitter:description`);
    assert.equal(metaContent(html, "twitter:card"), "summary_large_image", `${page.slug} twitter card`);
    assert.ok(linkHref(html, "icon"), `${page.slug} must link a favicon`);
    assert.ok(jsonLdScripts.length > 0, `${page.slug} must include JSON-LD`);

    const serializedJsonLd = JSON.stringify(jsonLdScripts);
    assert.ok(serializedJsonLd.includes(JSON.stringify(canonical).slice(1, -1)), `${page.slug} JSON-LD canonical URL`);
    assert.ok(serializedJsonLd.includes(JSON.stringify(page.title).slice(1, -1)), `${page.slug} JSON-LD title`);
    assert.ok(serializedJsonLd.includes(JSON.stringify(page.description).slice(1, -1)), `${page.slug} JSON-LD description`);

    observed.title.push(page.title);
    observed.description.push(page.description);
    observed.canonical.push(canonical);
    observed.ogTitle.push(metaContent(html, "og:title"));
    observed.ogDescription.push(metaContent(html, "og:description"));
    observed.ogUrl.push(metaContent(html, "og:url"));
    observed.twitterTitle.push(metaContent(html, "twitter:title"));
    observed.twitterDescription.push(metaContent(html, "twitter:description"));
    observed.jsonLd.push(serializedJsonLd);
  }

  for (const [field, values] of Object.entries(observed)) {
    assert.equal(new Set(values).size, pageList.length, `${field} values must be unique across pages`);
  }
});

test("generated pages contain no fragment routing or editor-only controls", () => {
  const forbiddenMarkup = /<(?:image-slot|sc-[\w-]+|x-dc)\b|\bdata-dc-[\w-]+\b|type=["']__bundler\//i;
  const editorControl = /<(?:button|a)\b[^>]*(?:aria-label|title)=["'][^"']*\b(?:replace|edit)\b[^"']*["']/i;

  for (const page of pageList) {
    const html = htmlBySlug.get(page.slug);
    assert.doesNotMatch(html, forbiddenMarkup, `${page.slug} includes editor runtime markup`);
    assert.doesNotMatch(html, /\bcontenteditable(?:\s*=|\s|>)/i, `${page.slug} includes contenteditable`);
    assert.doesNotMatch(html, editorControl, `${page.slug} includes an editor control`);
    assert.match(html, /<html\b[^>]*\bclass=["'][^"']*\bno-js\b/i, `${page.slug} needs a no-JavaScript navigation fallback`);

    const currentLinks = startTags(html, "a").filter(({ attrs }) => attrs["aria-current"] === "page");
    assert.ok(
      currentLinks.some(({ attrs }) => attrs.href === page.slug),
      `${page.slug} needs an aria-current link in site navigation`,
    );

    for (const { attrs } of startTags(html, "a")) {
      const href = attrs.href || "";
      if (!href.startsWith("#")) continue;
      assert.equal(href, "#main-content", `${page.slug} contains fragment navigation ${href}`);
      assert.ok(findElementWithId(html, "main-content"), `${page.slug} skip-link target is missing`);
    }
  }
});

test("every internal href resolves to a generated page or public asset", async () => {
  for (const page of pageList) {
    const html = htmlBySlug.get(page.slug);
    const hrefTags = [...html.matchAll(/<[a-z][^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>/gi)];

    for (const match of hrefTags) {
      const href = decodeHtml(match[1] ?? match[2] ?? "");
      assert.ok(href, `${page.slug} has an empty href`);
      assert.doesNotMatch(href, /^javascript:/i, `${page.slug} has a javascript: href`);

      if (href.startsWith("#")) {
        assert.ok(findElementWithId(html, href.slice(1)), `${page.slug} has unresolved ${href}`);
        continue;
      }
      if (/^(?:mailto:|tel:)/i.test(href)) continue;

      const resolved = new URL(href, canonicalFor(page));
      if (resolved.origin !== new URL(site.canonicalUrl).origin) continue;
      const target = outputTargetForPath(resolved.pathname);
      assert.ok(target && existsSync(target), `${page.slug} href ${href} does not resolve under public/`);
      if (resolved.hash) {
        const targetHtml = await readFile(target, "utf8");
        assert.ok(findElementWithId(targetHtml, resolved.hash.slice(1)), `${page.slug} href ${href} has no target`);
      }
    }
  }
});

test("priority form matches the API contract and exposes accessible validation semantics", () => {
  const html = htmlBySlug.get("/priority-list/");
  const formMatch = html.match(/<form\b([^>]*)>([\s\S]*?)<\/form>/i);
  assert.ok(formMatch, "priority form is missing");
  const formAttrs = attributes(formMatch[1]);
  const formHtml = formMatch[2];
  const inputs = startTags(formHtml, "input");
  const selects = startTags(formHtml, "select");
  const controls = [...inputs, ...selects];
  const namedControls = controls.filter(({ attrs }) => attrs.name);
  const controlsByName = new Map(namedControls.map((control) => [control.attrs.name, control]));
  const allowedNames = new Set([
    "full_name",
    "email",
    "care_interest",
    "consent",
    "website",
    "form_started_at",
    "consent_version",
    "turnstile_token",
  ]);
  const requiredStaticNames = [
    "full_name",
    "email",
    "care_interest",
    "consent",
    "website",
    "form_started_at",
    "consent_version",
  ];

  assert.equal(formAttrs.action, "/api/priority");
  assert.equal(formAttrs.method?.toLowerCase(), "post");
  assert.ok(formAttrs["aria-labelledby"] || formAttrs["aria-label"], "form needs an accessible name");
  if (formAttrs["aria-labelledby"]) {
    assert.ok(findElementWithId(html, formAttrs["aria-labelledby"]), "form aria-labelledby target is missing");
  }

  for (const name of requiredStaticNames) assert.ok(controlsByName.has(name), `missing ${name} control`);
  for (const name of controlsByName.keys()) assert.ok(allowedNames.has(name), `unexpected API field ${name}`);
  assert.equal(namedControls.length, controlsByName.size, "API field names must not be duplicated");
  assert.equal(startTags(formHtml, "textarea").length, 0, "priority form must not accept free text or PHI");

  const fullName = controlsByName.get("full_name").attrs;
  const email = controlsByName.get("email").attrs;
  const careInterest = controlsByName.get("care_interest").attrs;
  const consent = controlsByName.get("consent").attrs;
  const honeypot = controlsByName.get("website").attrs;
  const startedAt = controlsByName.get("form_started_at").attrs;
  const consentVersion = controlsByName.get("consent_version").attrs;

  assert.equal(fullName.type?.toLowerCase(), "text");
  assert.equal(fullName.autocomplete, "name");
  assert.ok("required" in fullName);
  assert.equal(email.type?.toLowerCase(), "email");
  assert.equal(email.autocomplete, "email");
  assert.equal(email.inputmode, "email");
  assert.ok("required" in email);
  assert.equal(careInterest.autocomplete, "off");
  assert.ok("required" in careInterest);
  assert.equal(consent.type?.toLowerCase(), "checkbox");
  assert.ok("required" in consent);
  assert.equal(honeypot.autocomplete, "off");
  assert.equal(honeypot.tabindex, "-1");
  assert.equal(honeypot["aria-hidden"], "true");
  assert.equal(honeypot.maxlength, "200");
  assert.equal(startedAt.type?.toLowerCase(), "hidden");
  assert.equal(consentVersion.type?.toLowerCase(), "hidden");
  assert.equal(consentVersion.value, "priority-2026-09", "consent_version needs the reviewed policy version");

  for (const name of ["full_name", "email", "care_interest", "consent"]) {
    const control = controlsByName.get(name).attrs;
    assert.ok(control.id, `${name} needs an id`);
    assert.match(formHtml, new RegExp(`<label\\b[^>]*\\bfor=(?:"${control.id}"|'${control.id}')`, "i"), `${name} needs an associated label`);
    assert.ok(control["aria-describedby"], `${name} needs descriptive/error text association`);
    for (const describedBy of control["aria-describedby"].split(/\s+/)) {
      assert.ok(findElementWithId(formHtml, describedBy), `${name} references missing #${describedBy}`);
    }
  }

  const careSelectMatch = formHtml.match(/<select\b[^>]*\bname=["']care_interest["'][^>]*>([\s\S]*?)<\/select>/i);
  assert.ok(careSelectMatch, "care_interest must be a native select");
  const careValues = startTags(careSelectMatch[1], "option")
    .map(({ attrs }) => attrs.value)
    .filter(Boolean)
    .sort();
  assert.deepEqual(careValues, site.careInterests.map(({ value }) => value).sort());

  const submitButtons = startTags(formHtml, "button").filter(({ attrs }) => (attrs.type || "submit").toLowerCase() === "submit");
  assert.equal(submitButtons.length, 1, "priority form needs one submit button");
  assert.match(formHtml, /<[a-z][^>]*\baria-live=["']polite["'][^>]*>/i,
    "priority form needs a polite live region");
  assert.doesNotMatch([...controlsByName.keys()].join(" "), /phone|zip|symptom|diagnosis|medication|medical|notes?/i);
});

test("photographs use real img elements, reserve dimensions, and label representative imagery", () => {
  let totalImages = 0;

  for (const page of pageList) {
    const html = htmlBySlug.get(page.slug);
    const images = startTags(html, "img");
    totalImages += images.length;
    if (!images.length) continue;

    const eager = images.filter(({ attrs }) => (attrs.loading || "").toLowerCase() === "eager");
    const highPriority = images.filter(({ attrs }) => (attrs.fetchpriority || "").toLowerCase() === "high");
    assert.ok(eager.length <= 1, `${page.slug} eagerly loads more than one image`);
    assert.ok(highPriority.length <= 1, `${page.slug} prioritizes more than one image`);
    if (eager.length) assert.equal(eager[0].raw, images[0].raw, `${page.slug} eager image must be first`);
    if (highPriority.length) assert.equal(highPriority[0].raw, images[0].raw, `${page.slug} high-priority image must be first`);

    for (const [index, image] of images.entries()) {
      const { attrs } = image;
      assert.ok(attrs.src?.startsWith("/assets/images/"), `${page.slug} image must use a built image asset`);
      assert.ok(existsSync(outputTargetForPath(new URL(attrs.src, site.canonicalUrl).pathname)), `${page.slug} image asset is missing: ${attrs.src}`);
      assert.ok(attrs.alt, `${page.slug} image needs meaningful alt text`);
      assert.ok(Number(attrs.width) > 0 && Number(attrs.height) > 0, `${page.slug} image needs intrinsic dimensions`);
      assert.equal((attrs.decoding || "").toLowerCase(), "async", `${page.slug} image should decode asynchronously`);
      if (index > 0) assert.equal((attrs.loading || "").toLowerCase(), "lazy", `${page.slug} below-fold image must lazy-load`);
    }

    const captions = [...html.matchAll(/<(?:figcaption|p)\b[^>]*\bclass=["'][^"']*representative-caption[^"']*["'][^>]*>[\s\S]*?Representative imagery[\s\S]*?<\/(?:figcaption|p)>/gi)];
    assert.ok(captions.length >= images.length, `${page.slug} every photograph needs a visible representative-imagery caption`);
  }

  assert.ok(totalImages > 0, "the generated site contains no real images");
});

test("deployment artifacts protect dotfiles and define site-wide security headers", async () => {
  const assetsIgnorePath = join(publicRoot, ".assetsignore");
  const headersPath = join(publicRoot, "_headers");
  const wranglerPath = join(projectRoot, "wrangler.jsonc");
  assert.ok(existsSync(assetsIgnorePath), "public/.assetsignore is missing");
  assert.ok(existsSync(headersPath), "public/_headers is missing");
  assert.ok(existsSync(wranglerPath), "wrangler.jsonc is missing");

  const assetsIgnore = await readFile(assetsIgnorePath, "utf8");
  const headers = await readFile(headersPath, "utf8");
  const wrangler = JSON.parse(await readFile(wranglerPath, "utf8"));
  assert.match(assetsIgnore, /(?:^|\n)\s*(?:\.git|\*\*\/\.git)(?:\/\*\*)?\s*(?:\n|$)/i, ".assetsignore must exclude .git");
  assert.match(assetsIgnore, /(?:^|\n)\s*(?:\.\*|\*\*\/\.\*|\*\*\/\.[^\n]*)\s*(?:\n|$)/, ".assetsignore must exclude dotfiles");
  assert.match(headers, /(?:^|\n)\/\*\s*(?:\n|$)/, "_headers needs a site-wide /* rule");
  assert.equal(wrangler.assets?.directory, "./public/", "only public/ may be deployed as static assets");
  assert.equal(wrangler.workers_dev, false, "the production Worker must not expose its stable workers.dev route");
  assert.equal(wrangler.preview_urls, true, "version preview URLs must remain enabled");
  assert.deepEqual(
    new Set((wrangler.routes || []).filter((route) => route.custom_domain).map((route) => route.pattern)),
    new Set(["apexwellnessnwi.com", "www.apexwellnessnwi.com"]),
    "both production custom domains must be checked in",
  );

  for (const header of [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
  ]) {
    assert.match(headers, new RegExp(`(?:^|\\n)\\s+${header}:\\s*\\S`, "i"), `_headers is missing ${header}`);
  }

  const publishedFiles = await allFiles(publicRoot);
  for (const path of publishedFiles) {
    const publishedPath = relative(publicRoot, path).replaceAll("\\", "/");
    assert.doesNotMatch(publishedPath, /(?:^|\/)\.git(?:\/|$)|(?:^|\/)\.env(?:\.|$)/i, `sensitive file published: ${publishedPath}`);
  }
});

test("sitemap, robots, and custom 404 cover the complete crawlable site", async () => {
  const sitemapPath = join(publicRoot, "sitemap.xml");
  const robotsPath = join(publicRoot, "robots.txt");
  const notFoundPath = join(publicRoot, "404.html");
  for (const path of [sitemapPath, robotsPath, notFoundPath]) {
    assert.ok(existsSync(path), `missing ${relative(publicRoot, path)}`);
  }

  const sitemap = await readFile(sitemapPath, "utf8");
  const robots = await readFile(robotsPath, "utf8");
  const notFound = await readFile(notFoundPath, "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => decodeHtml(match[1].trim())).sort();
  const expectedUrls = pageList.map(canonicalFor).sort();
  assert.deepEqual(sitemapUrls, expectedUrls, "sitemap must contain every page exactly once");
  assert.match(robots, /^User-agent:\s*\*/im);
  assert.match(robots, /^Allow:\s*\/$/im);
  assert.match(robots, new RegExp(`^Sitemap:\\s*${site.canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\/sitemap\\.xml$`, "im"));
  assert.match(titleText(notFound), /not found/i);
  assert.match(metaContent(notFound, "robots") || "", /noindex/i);
  assert.ok(startTags(notFound, "a").some(({ attrs }) => attrs.href === "/"), "404 needs a home link");
  assert.doesNotMatch(notFound, /<(?:image-slot|sc-[\w-]+|x-dc)\b|type=["']__bundler\//i);
});

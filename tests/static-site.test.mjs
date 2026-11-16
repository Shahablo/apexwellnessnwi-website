import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { pages, site } from "../src/content.mjs";
import { blogPosts } from "../src/blog-posts.mjs";
import { personalGoalsArticle } from "../src/personal-goals-article.mjs";
import { choosingAPracticeArticle } from "../src/choosing-a-practice-article.mjs";
import { behindTheScenesArticle } from "../src/behind-the-scenes-article.mjs";
import { buildoutPartOneArticle } from "../src/buildout-part-one-article.mjs";

test('October 24 owner-directed build-out articles use final media and exclude withdrawn identities', async () => {
  assert.equal(behindTheScenesArticle.status, 'published');
  assert.equal(behindTheScenesArticle.editorialType, 'nonmedical');
  assert.equal(behindTheScenesArticle.slug, '/blog/before-the-doors-open-apex-wellness/');
  assert.ok(blogPosts.includes(behindTheScenesArticle));
  assert.equal(buildoutPartOneArticle.status, 'published');
  assert.equal(buildoutPartOneArticle.editorialType, 'nonmedical');
  assert.equal(buildoutPartOneArticle.slug, '/blog/the-door-and-the-to-do-list/');
  assert.ok(blogPosts.includes(buildoutPartOneArticle));
  assert.match(JSON.stringify(buildoutPartOneArticle), /spoke with Comcast/);
  for (const article of [behindTheScenesArticle, buildoutPartOneArticle]) {
    const copy = JSON.stringify(article);
    assert.match(copy, /8550 Broadway, Suite B/);
    assert.match(copy, /preparing to open|coming soon/i);
    assert.doesNotMatch(copy, /Atif|Wajeeh|physician-led|book now|appointments are available|guaranteed|—/i);
  }
  const video = join(projectRoot, 'assets', 'video', behindTheScenesArticle.video.file);
  assert.equal(createHash('sha256').update(await readFile(video)).digest('hex'), '281351e61f4012917fba55b2f841133fd1603c9f20acff490cfb8b3f44e3c880');
  assert.ok(existsSync(join(projectRoot, 'assets', 'video', behindTheScenesArticle.video.captionFile)));
});

test('personal-goals release preserves the nonmedical version with October 12 staffing-neutral CTA', () => {
  assert.equal(createHash('sha256').update(JSON.stringify(personalGoalsArticle)).digest('hex'), 'c66270968b1dabd1dd897ea5b950c2cef9f23a0287de54dd6b69c8fccebf4731');
  assert.equal(personalGoalsArticle.editorialType, 'nonmedical');
  assert.equal(personalGoalsArticle.published, '2026-09-20');
  assert.equal(personalGoalsArticle.sections.find(s => s.heading === 'Make a note you can use').bullets.length, 6);
  assert.match(JSON.stringify(personalGoalsArticle), /8550 Broadway, Suite B/);
  assert.doesNotMatch(JSON.stringify(personalGoalsArticle), /8560|medically reviewed by|guaranteed|—/i);
  for (const slug of ['/blog/glp-1-weight-loss-expectations-side-effects/', '/blog/weight-loss-plateau-what-to-track/']) {
    assert.equal(blogPosts.find(post => post.slug === slug).status, 'draft');
  }
});

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = join(projectRoot, "public");
const buildDate = process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString().slice(0, 10)
  : new Date().toISOString().slice(0, 10);
const publishedBlogPosts = blogPosts.filter((post) => post.published <= buildDate && post.status !== "draft");
const unpublishedBlogPosts = blogPosts.filter((post) => post.published > buildDate || post.status === "draft");
const pageList = [
  ...Object.values(pages),
  ...publishedBlogPosts.map((post) => ({ ...post, kind: "blogPost", navLabel: "Blog" })),
];

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

// /founding-patients/ and the four ad booking pages: short landing header, booking announcement, no site navigation.
const bookingSlugs = new Set(Object.values(pages).filter((page) => page.landing).map((page) => page.slug));
const adBookingSlugs = ['/book/weight-loss/', '/book/hormone-health/', '/book/womens-midlife/', '/book/hair-loss/'];

const htmlBySlug = new Map();
for (const page of pageList) {
  const output = pageOutputPath(page.slug);
  assert.ok(existsSync(output), `missing generated page for ${page.slug}: ${relative(projectRoot, output)}`);
  htmlBySlug.set(page.slug, await readFile(output, "utf8"));
}

test('the new planned care area is discoverable without displacing information links or collecting health interests', () => {
  const carePaths = site.navigation.filter((item) => item.section === 'care').map((item) => item.href);
  assert.equal(carePaths.length, 5);
  assert.ok(carePaths.includes('/womens-hormone-replacement-therapy/'));
  assert.ok(carePaths.includes('/hair-loss-care/'));
  for (const slug of ['/', '/hair-loss-care/']) {
    const html = htmlBySlug.get(slug);
    const header = html.match(/<header class="site-header">([\s\S]*?)<\/header>/)[1];
    for (const href of [...carePaths, '/about/', '/how-it-works/', '/pricing/', '/blog/', '/faq/']) {
      assert.ok(header.includes(`href="${href}"`), `${slug} primary navigation is missing ${href}`);
    }
    assert.match(html, /Coming soon/i);
  }
  const hair = htmlBySlug.get('/hair-loss-care/');
  assert.match(hair, /Yes\. Online booking is open for visits from November 20\. You can also call \(219\) 207-2456\. Hair-loss care is planned for opening/);
  assert.match(hair, /8550 Broadway, Suite B/);
  assert.doesNotMatch(hair, /minoxidil|finasteride|dutasteride|PRP|transplant|guaranteed regrowth/i);
  assert.match(htmlBySlug.get('/founding-patients/'), /href="\/hair-loss-care\/"/);
  assert.doesNotMatch(htmlBySlug.get('/founding-patients/'), /name="care_interest"/);
});

test('service pages use distinct local search titles, descriptions, and plain H1s', () => {
  const expectations = new Map([
    ['/weight-management/', /Medical Weight Management in Merrillville, IN/],
    ['/mens-hormone-health/', /Men’s Hormone Health in Merrillville, IN/],
    ['/womens-midlife-care/', /Women’s Midlife Care in Merrillville, IN/],
    ['/hair-loss-care/', /Hair-Loss Care in Merrillville, IN/],
  ]);

  for (const [slug, h1Pattern] of expectations) {
    const page = pageList.find((candidate) => candidate.slug === slug);
    const html = htmlBySlug.get(slug);
    assert.match(page.title, /Merrillville/i, `${slug} title needs the clinic location`);
    assert.match(page.description, /Merrillville/i, `${slug} description needs the clinic location`);
    assert.match(html, new RegExp(`<h1[^>]*>${h1Pattern.source}</h1>`, 'i'), `${slug} needs a clear service H1`);
  }
});

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

test("generated pages use crawlable routes and contain no editor-only controls", () => {
  const forbiddenMarkup = /<(?:image-slot|sc-[\w-]+|x-dc)\b|\bdata-dc-[\w-]+\b|type=["']__bundler\//i;
  const editorControl = /<(?:button|a)\b[^>]*(?:aria-label|title)=["'][^"']*\b(?:replace|edit)\b[^"']*["']/i;

  for (const page of pageList) {
    const html = htmlBySlug.get(page.slug);
    assert.doesNotMatch(html, forbiddenMarkup, `${page.slug} includes editor runtime markup`);
    assert.doesNotMatch(html, /\bcontenteditable(?:\s*=|\s|>)/i, `${page.slug} includes contenteditable`);
    assert.doesNotMatch(html, editorControl, `${page.slug} includes an editor control`);
    const currentLinks = startTags(html, "a").filter(({ attrs }) => attrs["aria-current"] === "page");
    if (!page.landing) {
      const expectedCurrentHref = page.kind === "blogPost" ? "/blog/" : page.slug;
      assert.ok(
        currentLinks.some(({ attrs }) => attrs.href === expectedCurrentHref),
        `${page.slug} needs an aria-current link in site navigation`,
      );
    }

    for (const { attrs } of startTags(html, "a")) {
      const href = attrs.href || "";
      if (!href.startsWith("#")) continue;
      assert.notEqual(href, "#", `${page.slug} contains an empty fragment link`);
      assert.ok(findElementWithId(html, href.slice(1)), `${page.slug} has unresolved in-page link ${href}`);
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

test("legacy priority-list routes redirect to the canonical founding-patients funnel", async () => {
  const redirectsPath = join(publicRoot, "_redirects");
  assert.ok(existsSync(redirectsPath), "public/_redirects is missing");
  const redirects = await readFile(redirectsPath, "utf8");
  const entries = new Map(
    redirects
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split(/\s+/))
      .filter((parts) => parts.length >= 3)
      .map(([source, destination, status]) => [source, { destination, status }]),
  );

  for (const source of ["/priority", "/priority/", "/priority-list", "/priority-list/"]) {
    assert.deepEqual(
      entries.get(source),
      { destination: "/founding-patients/", status: "301" },
      `${source} must redirect permanently to the canonical consultation funnel`,
    );
  }
  assert.deepEqual(
    entries.get("/founding-patients"),
    { destination: "/founding-patients/", status: "301" },
    "the canonical funnel needs an explicit trailing-slash redirect",
  );
  assert.ok(!existsSync(join(publicRoot, "priority-list", "index.html")), "retired priority-list page must not be generated");
});

test("the booking page carries no signup form, and the kept Launch List client script still matches the API contract", async () => {
  const html = htmlBySlug.get("/founding-patients/");
  assert.ok(html, "the canonical /founding-patients/ page is missing");

  // November 16, 2026: /founding-patients/ became the booking page. The Launch List form, its anchor and the links to it are gone from this page.
  assert.equal(startTags(html, "form").filter(({ attrs }) => !["pexy-followup-form", "site-help-form"].includes(attrs.id)).length, 0, "the booking page must not carry a signup or request form");
  assert.ok(!findElementWithId(html, "consultation-request"), "the Launch List anchor target is removed from the booking page");
  assert.doesNotMatch(html, /#consultation-request|\/api\/founding-consultation|Launch List/, "the booking page must not point at the Launch List signup");

  const siteJs = await readFile(join(publicRoot, "assets", "site.js"), "utf8");
  assert.match(
    siteJs,
    /fetch\(\s*(?:form\.(?:action|getAttribute\(\s*["']action["']\s*\))|["']\/api\/founding-consultation["'])/,
    "enhanced form submission must use the founding-consultation endpoint",
  );
  assert.doesNotMatch(siteJs, /["']\/api\/priority["']/, "client JavaScript must not submit to the retired endpoint");
  assert.match(siteJs, /String\(Date\.now\(\)\)/, "form_started_at must be initialized from the current epoch time");
  assert.match(siteJs, /Number\(payload\.form_started_at\)/, "form_started_at must be sent as a number");
  assert.match(siteJs, /phone\.disabled\s*=\s*supportMode/, "support mode must omit the phone field from submission");
  assert.match(siteJs, /phone\.required\s*=\s*!supportMode/, "support mode must not require a phone");
  assert.match(siteJs, /result\?\.verification_pending\s*===\s*true/,
    "enabled double opt-in must instruct visitors to confirm their email");
  assert.match(
    siteJs,
    /payload\[checkbox\.name\]\s*=\s*checkbox\.checked/,
    "checkbox fields must be serialized as JSON booleans",
  );
});

test("photographs retain accessible image metadata without representative imagery captions", () => {
  let totalImages = 0;

  for (const page of pageList) {
    const html = htmlBySlug.get(page.slug);
    const allImages = startTags(html, "img");
    const images = allImages.filter(({ attrs }) => attrs['data-photo-kind']);
    for (const { attrs } of allImages.filter(({ attrs }) => !attrs['data-photo-kind'])) {
      assert.match(attrs.src || '', /^\/assets\/images\/apex-icon-as-a-(?:reversed-)?lockup-20261026\.svg$/, `${page.slug} non-photographic image must be the approved logo`);
    }
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

    assert.doesNotMatch(html, /<(?:figcaption|p)\b[^>]*\bclass=["'][^"']*representative-caption/i, `${page.slug} must not render representative imagery captions`);
    for (const {attrs} of images) assert.ok(['representative', 'portrait', 'documentary'].includes(attrs['data-photo-kind']), `${page.slug} photograph kind must be explicit`);
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
  const siteCss = await readFile(join(publicRoot, "assets", "site.css"), "utf8");
  const wrangler = JSON.parse(await readFile(wranglerPath, "utf8"));
  assert.match(assetsIgnore, /(?:^|\n)\s*(?:\.git|\*\*\/\.git)(?:\/\*\*)?\s*(?:\n|$)/i, ".assetsignore must exclude .git");
  assert.match(assetsIgnore, /(?:^|\n)\s*(?:\.\*|\*\*\/\.\*|\*\*\/\.[^\n]*)\s*(?:\n|$)/, ".assetsignore must exclude dotfiles");
  assert.match(headers, /(?:^|\n)\/\*\s*(?:\n|$)/, "_headers needs a site-wide /* rule");
  for (const [index, line] of headers.split(/\r?\n/).entries()) {
    assert.ok(line.length <= 2000, `_headers line ${index + 1} exceeds Cloudflare's 2,000-character limit`);
  }
  const cspLines = headers.split(/\r?\n/).filter((line) => /^\s+Content-Security-Policy:/i.test(line));
  assert.equal(cspLines.length, 1, "_headers must define one site-wide CSP");
  assert.match(cspLines[0], /(?:^|;) script-src 'self'(?:;|$)/, "only same-origin executable scripts are allowed");
  assert.doesNotMatch(cspLines[0], /'unsafe-inline'|'unsafe-eval'|'sha(?:256|384|512)-/i, "CSP must not allow inline execution or collect per-page JSON-LD hashes");
  assert.match(siteCss, /@media\s*\(scripting:\s*none\)[\s\S]*?\.nav-toggle\s*\{[\s\S]*?display:\s*none/i, "the no-JavaScript fallback must hide the inert menu toggle");
  assert.match(siteCss, /@media\s*\(scripting:\s*none\)[\s\S]*?\.site-nav\s*\{[\s\S]*?display:\s*flex[\s\S]*?max-height:\s*none[\s\S]*?overflow:\s*visible/i, "the no-JavaScript fallback must expose the complete mobile navigation");
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
    if (publishedPath.endsWith(".html")) {
      const html = await readFile(path, "utf8");
      for (const [, rawAttrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        const scriptAttrs = attributes(rawAttrs);
        if (scriptAttrs.src) {
          assert.equal(body.trim(), "", `${publishedPath} external script must have no inline body`);
        } else {
          assert.equal(scriptAttrs.type?.toLowerCase(), "application/ld+json", `${publishedPath} must not add executable inline script without updating CSP`);
          assert.doesNotThrow(() => JSON.parse(body), `${publishedPath} JSON-LD must remain valid inline data`);
        }
      }
    }
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
  // Ad booking pages are noindex and stay out of the sitemap.
  const expectedUrls = pageList.filter((page) => !page.noindex).map(canonicalFor).sort();
  assert.deepEqual(sitemapUrls, expectedUrls, "sitemap must contain every page exactly once");
  assert.match(robots, /^User-agent:\s*\*/im);
  assert.match(robots, /^Allow:\s*\/$/im);
  assert.match(robots, new RegExp(`^Sitemap:\\s*${site.canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\/sitemap\\.xml$`, "im"));
  assert.match(titleText(notFound), /not found/i);
  assert.match(metaContent(notFound, "robots") || "", /noindex/i);
  assert.ok(startTags(notFound, "a").some(({ attrs }) => attrs.href === "/"), "404 needs a home link");
  assert.doesNotMatch(notFound, /<(?:image-slot|sc-[\w-]+|x-dc)\b|type=["']__bundler\//i);
});

test('the About page distinguishes real team portraits, supplied interests, and physician credentials', () => {
  const html = htmlBySlug.get('/about/');
  const portraits = startTags(html, 'img').filter(({attrs}) => attrs['data-photo-kind'] === 'portrait');
  assert.deepEqual(portraits.map(({attrs}) => attrs.alt), ['Shahab Siddique', 'Alexandria Auriemma', 'Shanon Mekola']);
  assert.ok(portraits.every(({attrs}) => attrs.loading === 'lazy'));
  assert.doesNotMatch(html, /Atif|Muhammad/);
  assert.doesNotMatch(html, /Portrait coming soon/);
  for (const interest of ['wrestling', 'Brazilian jiu-jitsu', 'Muay Thai', 'boxing', 'weightlifter']) assert.ok(html.includes(interest));
  assert.doesNotMatch(html, /Shahab Siddique, MD|Dr\. Shahab/);
  assert.match(html, /Medical Assistant/);
  assert.doesNotMatch(html, /Incoming|joining Apex/i);
  assert.match(html, /more than 10 years of healthcare experience/);
  assert.doesNotMatch(html, /Alexandria Auriemma, MD|Dr\. Alexandria/);
  assert.match(html, /Family Nurse Practitioner/);
  assert.match(html, /nursing career began in 1999/);
  assert.doesNotMatch(html, /Shanon Mekola, MD|Dr\. Shanon|Wajeeh|Bakhsh/);
  assert.match(html, /Keep your primary care doctor/);
});

test('the confirmed clinic identity and owner-confirmed hours appear consistently without invented coordinates or reviews', () => {
  // Owner-confirmed November 16, 2026: Wed-Fri 11-5, Sat 9-1, from opening day; closed Thanksgiving.
  const confirmedHours = [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Thursday', 'Friday'], opens: '11:00', closes: '17:00', validFrom: '2026-11-20' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '13:00', validFrom: '2026-11-20' },
  ];
  const thanksgivingClosure = [
    { '@type': 'OpeningHoursSpecification', validFrom: '2026-11-26', validThrough: '2026-11-26', opens: '00:00', closes: '00:00' },
  ];
  const footerHours = '<p class="footer-hours"><strong>Hours from November 20</strong><br>Wednesday, Thursday and Friday: 11 a.m. to 5 p.m.<br>Saturday: 9 a.m. to 1 p.m.<br>Closed Sunday through Tuesday.<br>Closed Thanksgiving Day, November 26.</p>';
  for (const [slug, html] of htmlBySlug) {
    assert.ok(html.includes(footerHours), `${slug} footer needs the confirmed clinic hours`);
    assert.ok(html.includes(site.address.label), `${slug} needs the confirmed address`);
    const jsonLd = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
      .find((match) => attributes(match[1]).type === 'application/ld+json');
    const clinic = JSON.parse(jsonLd[2])['@graph'].find((node) => node['@type'] === 'MedicalClinic');
    assert.equal(clinic['@id'], 'https://apexwellnessnwi.com/#organization');
    assert.equal(clinic.address.streetAddress, '8550 Broadway, Suite B');
    assert.equal(clinic.address.postalCode, '46410');
    assert.equal(clinic.telephone, '+12192072456');
    assert.ok(clinic.sameAs.includes('https://www.linkedin.com/company/apex-wellness-nwi/'));
    assert.ok(clinic.sameAs.includes(site.googleBusinessUrl));
    assert.equal(clinic['@type'], 'MedicalClinic', `${slug} keeps the existing clinic schema type`);
    assert.deepEqual(clinic.openingHoursSpecification, confirmedHours, `${slug} structured hours must match the confirmed hours`);
    assert.deepEqual(clinic.specialOpeningHoursSpecification, thanksgivingClosure, `${slug} must mark the Thanksgiving closure`);
    for (const unsupported of ['aggregateRating', 'review', 'geo', 'openingHours']) {
      assert.equal(clinic[unsupported], undefined, `${slug} must not invent ${unsupported}`);
    }
    assert.doesNotMatch(html, /A confirmed street address|The confirmed clinic address|A confirmed address and visit-modality details/);
  }
});

test('measurement is first-party, aggregate, and excludes advertising vendors and browser identifiers', async () => {
  const html = htmlBySlug.get('/');
  assert.match(html, /<script src="\/assets\/site-measurement\.js\?v=[a-f0-9]+" defer><\/script>/);
  const measurement = await readFile(join(publicRoot, 'assets', 'site-measurement.js'), 'utf8');
  assert.match(measurement, /enabled:\s*true/);
  assert.match(measurement, /endpoint:\s*"\/api\/site-event"/);
  assert.match(measurement, /sendBeacon/);
  assert.match(measurement, /referrer_domain/);
  assert.match(measurement, /utm_campaign/);
  assert.match(measurement, /form_submit_success/);
  assert.doesNotMatch(measurement, /XMLHttpRequest|localStorage|sessionStorage|document\.cookie|userAgent|FormData|\.value|textContent/);
  assert.doesNotMatch(html, /googletagmanager|google-analytics|connect\.facebook\.net|clarity\.ms|hotjar|segment|mixpanel/i);
});

test("blog pages expose article semantics, dates, sources, and a valid RSS feed", async () => {
  const blogIndex = htmlBySlug.get("/blog/");
  assert.ok(blogIndex, "blog index is missing");

  for (const post of publishedBlogPosts) {
    assert.match(blogIndex, new RegExp(`href=["']${post.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`), `blog index must link ${post.slug}`);
    const html = htmlBySlug.get(post.slug);
    assert.ok(html, `${post.slug} is missing`);
    assert.match(html, /<article\b[^>]*class=["'][^"']*article-shell/i, `${post.slug} needs an article landmark`);
    assert.match(html, new RegExp(`<time\\b[^>]*datetime=["']${post.published}["']`, "i"), `${post.slug} needs a visible publication date`);
    assert.match(html, /Sources reviewed/i, `${post.slug} needs a visible source list`);

    const jsonLdScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
      .filter(([, rawAttrs]) => attributes(rawAttrs).type?.toLowerCase() === "application/ld+json")
      .map(([, , body]) => JSON.parse(body));
    const graph = jsonLdScripts.flatMap((document) => document["@graph"] || []);
    const article = graph.find((node) => node["@type"] === "BlogPosting");
    assert.ok(article, `${post.slug} needs BlogPosting JSON-LD`);
    assert.equal(article.datePublished, post.published);
    assert.equal(article.dateModified, post.modified);
    assert.equal(article.headline, post.h1);
  }

  const feedPath = join(publicRoot, "blog", "feed.xml");
  assert.ok(existsSync(feedPath), "blog RSS feed is missing");
  const feed = await readFile(feedPath, "utf8");
  assert.match(feed, /<rss\b[^>]*version="2\.0"/i);
  for (const post of publishedBlogPosts) {
    assert.match(feed, new RegExp(canonicalFor(post).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `RSS feed must include ${post.slug}`);
  }
});

test("future-dated blog posts stay out of public pages, the sitemap, and the feed", async () => {
  const blogIndex = htmlBySlug.get("/blog/");
  const sitemap = await readFile(join(publicRoot, "sitemap.xml"), "utf8");
  const feed = await readFile(join(publicRoot, "blog", "feed.xml"), "utf8");

  for (const post of unpublishedBlogPosts) {
    assert.ok(!existsSync(pageOutputPath(post.slug)), `${post.slug} must not be generated before ${post.published}`);
    assert.doesNotMatch(blogIndex, new RegExp(post.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${post.slug} must not be listed early`);
    assert.doesNotMatch(sitemap, new RegExp(canonicalFor(post).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${post.slug} must not enter the sitemap early`);
    assert.doesNotMatch(feed, new RegExp(canonicalFor(post).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${post.slug} must not enter the feed early`);
  }
});

test('all runtime scripts exist as deployable assets and the site guide stays local', async () => {
  for (const [slug, html] of htmlBySlug) {
    for (const { attrs } of startTags(html, 'script').filter(({attrs}) => attrs.src)) {
      const path = new URL(attrs.src, site.canonicalUrl).pathname;
      assert.equal(extname(path), '.js', `${slug} script must use deployable .js output`);
      assert.ok(existsSync(outputTargetForPath(path)), `${slug} missing script ${path}`);
    }
    assert.match(html, /id="help-toggle"[^>]*hidden/);
    assert.match(html, /Ask Pexy/);
    assert.match(html, /Hi, I’m Pexy\./);
    assert.match(html, /id="pexy-nudge"[^>]*hidden/);
    assert.match(html, /aria-label="Dismiss Pexy invitation"/);
    assert.doesNotMatch(html, /id="launch-prompt"/, 'only one proactive invitation should remain');
    const helpForm = [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)].find((match) => attributes(match[1]).id === 'site-help-form');
    assert.ok(helpForm);
    assert.ok(!attributes(helpForm[1]).action, 'local guide must not post questions');
    assert.ok(startTags(helpForm[2], 'input').every(({attrs}) => !attrs.name), 'questions must not become native form data');
    const followupForm = [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)].find((match) => attributes(match[1]).id === 'pexy-followup-form');
    assert.ok(followupForm, `${slug} needs an opt-in follow-up form`);
    assert.ok(Object.hasOwn(attributes(followupForm[1]), 'hidden'), 'follow-up must start hidden');
    assert.ok(html.indexOf('id="pexy-followup-form"') < html.indexOf('class="help-topics"'), 'unknown-answer follow-up should appear before the quick topics');
    assert.match(followupForm[2], /name="full_name"/);
    assert.match(followupForm[2], /name="email"/);
    assert.match(followupForm[2], /name="question"/);
    assert.match(followupForm[2], /name="contact_consent"[^>]*required/);
    assert.match(followupForm[2], /earlier Pexy question will not be sent/);
  }
  const assistant = await readFile(join(publicRoot, 'assets', 'site-assistant.js'), 'utf8');
  assert.match(assistant, /fetch\('\/api\/pexy-followup'/);
  assert.match(assistant, /pexy-followup-action/);
  assert.doesNotMatch(assistant, /XMLHttpRequest|sendBeacon|WebSocket|\beval\s*\(/);
  assert.doesNotMatch(assistant, /^import\s|^export\s/m);
  assert.match(assistant, /answerWebsiteQuestion/);
});

test('article breadcrumbs end in the article title, with contents and complete list order', () => {
  for (const post of publishedBlogPosts) {
    const html = htmlBySlug.get(post.slug);
    const document = JSON.parse([...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].find((match) => attributes(match[1]).type === 'application/ld+json')[2]);
    const breadcrumb = document['@graph'].find((item) => item['@type'] === 'BreadcrumbList');
    assert.equal(breadcrumb.itemListElement.at(-1).name, post.h1);
    assert.ok(html.includes(`<span aria-current="page">${escapeForTest(post.h1)}</span>`), 'visible breadcrumb must name the article');
    assert.match(html, /aria-label="In this article"/);
    for (const section of post.sections.filter((section) => section.paragraphsAfterBullets)) {
      assert.ok(html.indexOf(escapeForTest(section.bullets.at(-1))) < html.indexOf(escapeForTest(section.paragraphsAfterBullets[0])));
    }
  }
});
function escapeForTest(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

test('editorial redesign preserves key content, semantic headings, and navigation fallbacks', () => {
  const home = htmlBySlug.get('/');
  for (const phrase of ['Thoughtful care', 'Northwest Indiana', 'The Launch List costs nothing to join and does not book an appointment.', site.launch.label]) {
    assert.ok(home.includes(phrase), `homepage must retain ${phrase}`);
  }
  for (const [slug, html] of htmlBySlug) {
    assert.equal(startTags(html, 'h1').length, 1, `${slug} must have one H1`);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${slug} duplicate IDs`);
    if (!bookingSlugs.has(slug)) assert.match(html, /<noscript><nav[^>]*aria-label="Navigation without JavaScript"/);
  }
});

test('site header and footer use the approved icon-as-A wordmark without changing the QR landing route', async () => {
  const light = await readFile(join(publicRoot, 'assets', 'images', 'apex-icon-as-a-lockup-20261026.svg'));
  const reversed = await readFile(join(publicRoot, 'assets', 'images', 'apex-icon-as-a-reversed-lockup-20261026.svg'));
  // Git checks out SVG text with platform-specific line endings; the brand master uses CRLF.
  const brandMasterHash = (bytes) => createHash('sha256').update(bytes.toString('utf8').replace(/\r?\n/g, '\r\n')).digest('hex');
  assert.equal(brandMasterHash(light), 'f38d232a5809bc48738456f5f538bda5c04c13257689bbaeafe020f6b9c92830');
  assert.equal(brandMasterHash(reversed), '4d0de12f40d1825c9b9ef2148c63693ffb6ee7b7d985d5dc8195c1304641a50c');
  for (const [slug, html] of htmlBySlug) {
    const header = html.match(/<header class="site-header(?: landing-header)?">[\s\S]*?<\/header>/)?.[0];
    assert.ok(header, `${slug} is missing the site header`);
    assert.match(header, /<a class="brand premium-brand" href="\/" aria-label="Apex Wellness home"[^>]*><img src="\/assets\/images\/apex-icon-as-a-lockup-20261026\.svg" width="172" height="98" alt="Apex Wellness"><\/a>/);
    assert.doesNotMatch(header, /<span>Apex<\/span>|<small>WELLNESS<\/small>/);
    assert.match(html, /<div class="footer-signature"><a href="\/" aria-label="Apex Wellness home"><img src="\/assets\/images\/apex-icon-as-a-reversed-lockup-20261026\.svg" width="860" height="490" alt="Apex Wellness">/);
  }
  const landing = htmlBySlug.get('/founding-patients/');
  assert.ok(landing, 'the printed QR destination remains present');
  assert.match(landing, /<link rel="canonical" href="https:\/\/apexwellnessnwi\.com\/founding-patients\/">/);
  const css = await readFile(join(publicRoot, 'assets', 'site-design.css'), 'utf8');
  assert.match(css, /\.premium-brand img\{display:block;width:8\.75rem;height:auto;max-height:none\}/);
  assert.match(css, /\.premium-brand img\{width:7\.25rem\}/);
});

test('homepage replaces the generic introduction with one staff-neutral approach section immediately after the hero', () => {
  const home = htmlBySlug.get('/');
  const sectionLabels = [...home.matchAll(/<section\b[^>]*aria-labelledby="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sectionLabels.slice(0, 3), ['page-title', 'approach-heading', 'care-heading']);
  assert.equal(sectionLabels.filter((label) => label === 'approach-heading').length, 1);
  assert.doesNotMatch(home, /Your health is personal|Your care should be, too|class="section introduction-section"/);
  assert.match(home, /class="section approach-section" id="apex-approach"/);
  assert.match(home, /Thoughtful care\.<br>Built around you\./);
  assert.match(home, /href="\/about\/">Our approach to care/);
});

test('homepage names the planned care and location, keeps the planned-launch status and offers online booking', async () => {
  const home = htmlBySlug.get('/');
  assert.match(home, /<meta name="description" content="[^"]*Coming soon to Merrillville\. Online booking is open for visits from November 20\.">/);
  assert.match(home, /<div class="hero-actions"><a class="button" href="https:\/\/d2oe0ra32qx05a\.cloudfront\.net\/\?practiceKey=k_1_117405"[^>]*data-book-online>Book online<span class="visually-hidden"> \(opens a new tab\)<\/span><\/a><a class="hero-explore" href="\/founding-patients\/">Join the Launch List /);
  assert.match(home, /<h3>Book when you are ready\.<\/h3><p>Online booking is open for visits from November 20\. Book online or call \(219\) 207-2456\.<\/p>/);
  assert.equal(site.launch.date, '2026-11-20');
  assert.match(home, /Planned launch: November 20, 2026/);
  assert.doesNotMatch(home, /November 4, 2026|2026-11-04/);
  assert.match(home, /<h1 id="page-title">Weight, hormones, hair loss\. <em>Coming to Merrillville\.<\/em><\/h1>/);
  for (const area of ['weight and metabolic care', 'men’s hormone health', 'women’s midlife care', 'hair-loss care for thinning and balding']) assert.match(home, new RegExp(area));
  assert.match(home, /Coming soon to 8550 Broadway, Suite B/);
  assert.doesNotMatch(home, /A thoughtful(?:<br>|\s)+approach to/);
  assert.match(home, /class="signature-launch-note">Coming soon · Subject to readiness/);
  for (const [slug, html] of htmlBySlug) {
    if (bookingSlugs.has(slug)) {
      assert.match(html, /class="announcement-copy">Coming soon to Merrillville · Online booking is open for visits from November 20\.<\/span>/);
      assert.doesNotMatch(html, /November 1(?!\d)|2026-11-01/);
      assert.doesNotMatch(html, /Join the Launch List/);
      continue;
    }
    assert.match(html, /class="announcement-copy">Planned launch:/, `${slug} retains planned status`);
    assert.match(html, /class="announcement-cta" href="(?:\/founding-patients\/|#consultation-request)">Join the Launch List/, `${slug} retains a working launch-list action`);
  }
  const css = await readFile(join(publicRoot, 'assets', 'site-design.css'), 'utf8');
  const readability = css.split('/* Readable launch information and confident, goal-focused hero. */')[1];
  assert.ok(readability, 'readability rules must exist after legacy responsive rules');
  assert.match(readability, /\.signature-content>\.eyebrow\{font-size:1\.125rem/);
  assert.match(readability, /\.signature-bottom \.signature-launch\{display:block/);
  assert.doesNotMatch(readability, /\.signature-launch\{[^}]*display:none/);
  assert.match(readability, /\.announcement \.announcement-cta\{[^}]*min-height:3rem/);
});

test('the QR landing page is a short booking page: the $49 offer, Book online, call, steps, care areas and the fine print', async () => {
  const html = htmlBySlug.get('/founding-patients/');
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  assert.match(html, /<title>Book Online \| \$49 Grand Opening \| Apex Wellness Merrillville<\/title>/);
  assert.match(html, /<meta name="description" content="Grand opening: promotional labs for \$49\. The \$49 covers your first visit and the labs, for the first 50 appointments scheduled\. Book online or call \(219\) 207-2456\.">/);
  assert.match(main, /<p class="eyebrow">Grand opening · Friday, November 20 · Merrillville<\/p>\s*<h1 id="page-title">Now booking <em>first visits\.<\/em><\/h1>/);
  assert.match(main, /<p class="booking-offer"><strong>\$49 for labs and your first visit\.<\/strong> First 50 appointments only\.<\/p>/);
  assert.match(main, /<p class="booking-badge" aria-hidden="true"><span>Grand opening<\/span><strong>\$49<\/strong><span>Labs \+ first visit<\/span><\/p>/);

  // One action: Book online first, the phone second, in the hero and again at the end. Both keep what first-party measurement counts.
  const bookOnline = '<a class="button" href="https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_117405" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" data-book-online>Book online<span class="visually-hidden"> (opens a new tab)</span></a>';
  const call = '<a class="booking-call" href="tel:+12192072456">Call (219) 207-2456</a>';
  assert.equal(main.split(bookOnline + call).length - 1, 2, 'hero and closing actions');
  assert.ok(main.indexOf(bookOnline) < main.indexOf('booking-strip'), 'the first Book online button sits above the hours and address');
  assert.ok(html.includes('<div class="booking-bar">' + bookOnline + '<a class="booking-bar-call" href="tel:+12192072456">Call</a></div>'), 'phone-width booking bar');
  assert.match(html, /<nav class="landing-nav" aria-label="Booking">\s*<a class="nav-cta" href="https:\/\/d2oe0ra32qx05a\.cloudfront\.net\/\?practiceKey=k_1_117405"[^>]*data-book-online>Book online/);
  assert.match(main, /<p class="booking-strip"><span>Wed–Fri 11 a\.m\.–5 p\.m\. · Sat 9 a\.m\.–1 p\.m\.<\/span> <span>8550 Broadway, Suite B, Merrillville, IN 46410<\/span><\/p>/);

  const steps = [...main.matchAll(/<li><span class="booking-step-number" aria-hidden="true">\d<\/span><span>([^<]+)<\/span><\/li>/g)].map((match) => match[1]);
  assert.deepEqual(steps, ['Book online in about a minute.', 'Come in for your first visit and labs.', 'Review your results and next steps with our care team.']);
  // Four care cards, each with an id an ad can link to, one plain line and a link to its service page.
  for (const [id, label, line, href] of [
    ['weight', 'Medical weight loss', 'A plan built on your history and labs.', '/weight-management/'],
    ['hormones', 'Men’s hormone health', 'Symptoms and testing reviewed before any plan.', '/hormone-care-merrillville/'],
    ['midlife', 'Women’s midlife care', 'Support through perimenopause and menopause.', '/womens-midlife-care/'],
    ['hair', 'Hair-loss care', 'Evaluation and care for hair loss and thinning.', '/hair-loss-care/'],
  ]) {
    assert.ok(main.includes('<li id="' + id + '"><a href="' + href + '"><strong>' + label + '</strong><span>' + line + '</span></a></li>'), 'care card ' + label);
  }
  // The care block is the "other services" destination of the ad booking pages: heading, four cards, then Book online.
  assert.match(main, /<div class="booking-care" id="services">\s*<h2 id="booking-care-heading">What we help with<\/h2>\s*<ul class="booking-services"/);
  assert.match(main, /<\/ul>\s*<\/div>\s*<div class="booking-actions booking-actions-close"><a class="button" href="https:\/\/d2oe0ra32qx05a\.cloudfront\.net\/\?practiceKey=k_1_117405"/);
  assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large">/);
  const visible = main.replace(/<[^>]+>/g, ' ');
  for (const phrase of ['weight loss', 'hormone', 'menopause', 'hair loss']) assert.ok(visible.includes(phrase), 'visible text names ' + phrase);
  assert.ok(main.indexOf('id="hair"') < main.lastIndexOf(bookOnline) && main.lastIndexOf(bookOnline) < main.indexOf('booking-fine-print'), 'Book online repeats right after the care cards');
  assert.ok(main.includes('<p class="booking-fine-print">The $49 covers your first visit and the labs. Labs as clinically appropriate. One per person. First 50 appointments scheduled. Additional testing or treatment is separate. Appointments subject to availability. Closed Sunday through Tuesday. Closed Thanksgiving Day, November 26.</p>'));

  // Nothing competes with booking: no signup, no form, no long sections, no image.
  assert.doesNotMatch(html, /Launch List|consultation-form|#consultation-request|founding-consultation|class="faq-list"|<details/);
  assert.doesNotMatch(main, /<form|<img|<input/);
  assert.equal(startTags(main, 'section').length, 2);
  // Public-copy rules for this page.
  assert.doesNotMatch(main.replace(/<[^>]+>/g, ' '), /\bfree\b|on us|no charge|testosterone|\bPSA\b|vitamin D|\bTSH\b|\bT4\b|\bTRT\b|low T\b|semaglutide|tirzepatide|before and after|guarantee|\bdoctor\b|physician|nurse practitioner|Wajeeh|Atif|!/i);
  assert.doesNotMatch(html, /first 100|APEXNOV/i);
  assert.match(html, /data-launch-label="November 20, 2026 \(planned; subject to readiness\)"/);
  const css = await readFile(join(publicRoot, 'assets', 'site-design.css'), 'utf8');
  assert.match(css, /@media\(prefers-reduced-motion:no-preference\)\{\s*\.booking-hero-inner>\*\{animation:/, 'entrance motion only without a reduced-motion preference');
});

test('the four ad booking pages build from the shared booking template with the offer, fine print, booking link and noindex', async () => {
  const bookOnline = '<a class="button" href="https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_117405" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" data-book-online>Book online<span class="visually-hidden"> (opens a new tab)</span></a>';
  const call = '<a class="booking-call" href="tel:+12192072456">Call (219) 207-2456</a>';
  const expected = new Map([
    ['/book/weight-loss/', ['Medical weight loss in Merrillville. ', 'Learn more about medical weight loss', '/weight-management/']],
    ['/book/hormone-health/', ['Men’s hormone health in Merrillville. ', 'Learn more about hormone care', '/hormone-care-merrillville/']],
    ['/book/womens-midlife/', ['Perimenopause and menopause care in Merrillville. ', 'Learn more about women’s midlife care', '/womens-midlife-care/']],
    ['/book/hair-loss/', ['Hair-loss care in Merrillville. ', 'Learn more about hair-loss care', '/hair-loss-care/']],
  ]);
  assert.deepEqual([...bookingSlugs].sort(), [...adBookingSlugs, '/founding-patients/'].sort());
  const sitemap = await readFile(join(publicRoot, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /\/book\//, 'ad booking pages stay out of the sitemap');
  assert.match(sitemap, /<loc>https:\/\/apexwellnessnwi\.com\/founding-patients\/<\/loc>/);
  assert.ok(!site.navigation.some((item) => item.href.startsWith('/book/')), 'ad booking pages stay out of the navigation');

  for (const slug of adBookingSlugs) {
    const html = htmlBySlug.get(slug);
    assert.ok(html, slug + ' is built');
    const [headline, learnLabel, learnHref] = expected.get(slug);
    const main = html.match(/<main[\s\S]*?<\/main>/)?.[0];
    assert.match(html, /<meta name="robots" content="noindex,follow">/, slug + ' is noindex');
    assert.ok(html.includes('<link rel="canonical" href="https://apexwellnessnwi.com' + slug + '">'), slug + ' canonical to itself');
    assert.ok(main.includes('<h1 id="page-title">' + headline + '<em>Start for $49.</em></h1>'), slug + ' headline');
    assert.match(main, /<p class="booking-lead">[^<]{20,120}<\/p>/, slug + ' one supporting sentence');
    assert.ok(main.includes('<p class="booking-offer"><strong>$49 for labs and your first visit.</strong> First 50 appointments only.</p>'), slug + ' offer');
    assert.equal(main.split(bookOnline + call).length - 1, 2, slug + ' hero and closing actions');
    assert.ok(main.indexOf(bookOnline) < main.indexOf('booking-strip'), slug + ' first Book online button sits in the hero');
    assert.equal(startTags(html, 'a').filter(({ attrs }) => 'data-book-online' in attrs).length, 4, slug + ' header, hero, closing row and phone bar');
    assert.ok(html.includes('<div class="booking-bar">' + bookOnline), slug + ' phone-width booking bar');
    assert.match(main, /<p class="booking-strip"><span>Wed–Fri 11 a\.m\.–5 p\.m\. · Sat 9 a\.m\.–1 p\.m\.<\/span> <span>8550 Broadway, Suite B, Merrillville, IN 46410<\/span><\/p>/);
    assert.equal([...main.matchAll(/<ul class="booking-covers"[^>]*>((?:<li>[^<]+<\/li>){3})<\/ul>/g)].length, 1, slug + ' three points on the first visit');
    assert.equal([...main.matchAll(/<span class="booking-step-number" aria-hidden="true">\d<\/span>/g)].length, 3, slug + ' three steps');
    assert.ok(main.includes('The $49 covers your first visit and the labs. Labs as clinically appropriate. One per person. First 50 appointments scheduled. Additional testing or treatment is separate. Appointments subject to availability.'), slug + ' fine print');
    // One secondary link to the other services, placed after the steps and the repeated Book online button.
    const more = '<p class="booking-more"><a class="button-secondary" href="/founding-patients/#services">See our other services</a><a class="booking-learn" href="' + learnHref + '">' + learnLabel + '</a></p>';
    assert.ok(main.includes(more), slug + ' other-services and learn-more links');
    assert.ok(main.indexOf('booking-steps') < main.indexOf('booking-more'), slug + ' other services comes after the steps');
    assert.doesNotMatch(main, /<form|<img|<input|booking-services|Also at Apex/);
    assert.doesNotMatch(html, /Launch List|consultation-form|founding-consultation/);
    assert.doesNotMatch(main.replace(/<[^>]+>/g, ' '), /\bfree\b|on us|no charge|testosterone|\bPSA\b|vitamin D|\bTSH\b|\bT4\b|\bTRT\b|low T\b|GLP|semaglutide|tirzepatide|pounds|\blbs\b|before and after|guarantee|\bdoctor\b|physician|nurse practitioner|Wajeeh|Atif|!/i, slug + ' copy rules');
    assert.match(html, /Coming soon/);
    // No third-party scripts or pixels: only the site's own three scripts.
    const scripts = startTags(html, 'script').filter(({ attrs }) => attrs.src).map(({ attrs }) => attrs.src.replace(/\?.*$/, ''));
    assert.deepEqual(scripts, ['/assets/site-measurement.js', '/assets/site.js', '/assets/site-assistant.js'], slug + ' scripts');
  }
  assert.ok(findElementWithId(htmlBySlug.get('/founding-patients/'), 'services'), 'the other-services link has a target');
});

const bookingUrl = 'https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_117405';
const bookingStatus = 'Online booking is open for visits from November 20.';
// The four ad landing pages, the men's page that shares their template, and nothing else.
const offerBandPages = new Set(['/weight-management/', '/hormone-care-merrillville/', '/womens-midlife-care/', '/hair-loss-care/', '/mens-hormone-health/']);

test('every Book online link is the one exact Tebra address, opened in a new tab without a referrer', async () => {
  const offerButton = `<a class="button" href="${bookingUrl}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" aria-describedby="book-online-note" data-book-online>Book online</a>`;
  const note = '<p id="book-online-note" class="book-online-note">Online booking opens our secure scheduling page (Tebra) in a new tab. Prefer the phone? Call <a href="tel:+12192072456">(219) 207-2456</a>.</p>';

  for (const [slug, html] of htmlBySlug) {
    const mentions = html.split('cloudfront.net').length - 1;
    const bookingLinks = startTags(html, 'a').filter(({ attrs }) => 'data-book-online' in attrs);
    // Plain links only: no script, frame, image, pixel, form or tracking parameter points at the booking host.
    assert.equal(mentions, bookingLinks.length, `${slug} may reference the booking host only in Book online links`);
    assert.doesNotMatch(html, /cloudfront\.net[^"]*(?:utm_|&)/, `${slug} must not add parameters to the booking address`);
    for (const { attrs, raw } of bookingLinks) {
      assert.equal(attrs.href, bookingUrl, `${slug} Book online must use the exact booking address`);
      assert.equal(attrs.target, '_blank', `${slug} Book online opens a new tab`);
      assert.equal(attrs.rel, 'noopener noreferrer', `${slug} Book online must not expose the opener or referrer`);
      assert.equal(attrs.referrerpolicy, 'no-referrer', `${slug} Book online sends no referrer`);
      assert.ok(attrs['aria-describedby'] === 'book-online-note' || html.includes(`${raw}Book online<span class="visually-hidden"> (opens a new tab)</span></a>`), `${slug} Book online must say it opens a new tab`);
    }
    for (const { attrs } of startTags(html, 'a').filter(({ attrs }) => (attrs.href || '').includes('cloudfront.net'))) {
      assert.ok('data-book-online' in attrs, `${slug} booking links must carry data-book-online so first-party measurement counts them`);
    }
  }

  // Blog index and policy pages stay informational: no booking link.
  for (const slug of ['/blog/', '/privacy/', '/terms/', '/communications-consent/', '/accessibility/', '/cancellation-refunds/']) {
    assert.doesNotMatch(htmlBySlug.get(slug), /data-book-online/, `${slug} must not carry a Book online link`);
  }

  // The QR page is the booking page: four Book online links (header, hero, closing row, phone bar) and no form.
  const landing = htmlBySlug.get('/founding-patients/');
  assert.equal(startTags(landing, 'a').filter(({ attrs }) => 'data-book-online' in attrs).length, 4);
  assert.doesNotMatch(landing, /<form id="consultation-form"/);

  const visit = htmlBySlug.get('/plan-your-visit/');
  assert.equal(visit.split(`<p class="book-online">${offerButton}</p>${note}`).length - 1, 1, 'the Plan Your Visit cost box has one Book online button and note');
  const costBox = visit.match(/<div class="visit-fact"><strong>Grand opening: \$49 for labs and your first visit<\/strong>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(costBox?.includes(offerButton), 'the button belongs inside the Plan Your Visit cost box');
  assert.match(visit, /<form id="consultation-form" action="\/api\/appointment-contact"/);
  assert.doesNotMatch(visit, /Continue to Tebra|Continue to scheduling/);

  const measurement = await readFile(join(publicRoot, 'assets', 'site-measurement.js'), 'utf8');
  assert.match(measurement, /hasAttribute\("data-book-online"\)\) return "plan_visit";/);
  assert.doesNotMatch(measurement, /cloudfront|book_online/);
});

test('the ad landing pages open with the grand-opening offer band above the page title', () => {
  const bookOnline = `<a class="button" href="${bookingUrl}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" data-book-online>Book online<span class="visually-hidden"> (opens a new tab)</span></a>`;
  const band = `<aside class="offer-band" aria-label="Grand opening offer"><div class="container offer-band-inner">
      <div class="offer-band-copy">
        <p class="offer-band-headline">Grand opening: $49 for labs and your first visit</p>
        <p class="offer-band-limit">First 50 appointments scheduled. <a href="/founding-patients/">Offer details</a></p>
      </div>
      <div class="offer-band-actions">${bookOnline}<a class="button-secondary" href="tel:+12192072456">Call 219-207-2456</a></div>
    </div></aside>`;

  for (const [slug, html] of htmlBySlug) {
    const bands = html.split('class="offer-band"').length - 1;
    if (!offerBandPages.has(slug)) {
      assert.equal(bands, 0, `${slug} must not carry the offer band`);
      continue;
    }
    assert.equal(bands, 1, `${slug} needs exactly one offer band`);
    assert.ok(html.replace(/\r\n/g, '\n').includes(band), `${slug} offer band content changed`);
    // Directly under the site header and before the hero, so it shows without scrolling on a phone.
    assert.ok(html.indexOf('class="offer-band"') > html.indexOf('</header>'), `${slug} band follows the site header`);
    assert.ok(html.indexOf('class="offer-band"') < html.indexOf('<section class="hero"'), `${slug} band comes before the hero`);
    assert.equal(startTags(html, 'h1').length, 1, `${slug} keeps one H1`);
    // The hero offers Book online first; the Launch List stays as the second option.
    assert.match(html, new RegExp(`<div class="hero-actions">${bookOnline.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<a class="button-secondary" href="/founding-patients/">(?:Join the Launch List|Get opening updates)</a></div>`), `${slug} hero actions`);
    assert.ok(html.includes(bookingStatus), `${slug} must say online booking is open`);
    assert.match(html, /Coming soon/, `${slug} keeps the clinic's Coming soon status`);
  }
  assert.equal([...offerBandPages].filter((slug) => htmlBySlug.has(slug)).length, 5);

  const css = htmlBySlug.get('/weight-management/').match(/href="(\/assets\/site-design\.css[^"]*)"/)?.[1];
  assert.ok(css, 'the band is styled by the shared stylesheet, not a new asset');
});

test('no generated page, guide answer or email still says scheduling or booking is not open', async () => {
  const notOpen = /scheduling is not (?:open|available)|scheduling has not opened|not open yet|not booking appointments|appointments are not (?:open|available)|appointments and care are not available|nothing can be booked|not being scheduled|(?:when|before|once|after|until) scheduling (?:opens|begins|becomes|is confirmed)|before (?:booking|appointments) (?:opens?|become)|ready to schedule|appointment requests are coming soon|first access to booking|will open only after/i;
  for (const [slug, html] of htmlBySlug) assert.doesNotMatch(html, notOpen, `${slug} still says booking is not open`);
  for (const file of ['404.html', 'assets/site-assistant.js', 'assets/site.js', 'blog/feed.xml']) {
    assert.doesNotMatch(await readFile(join(publicRoot, ...file.split('/')), 'utf8'), notOpen, `${file} still says booking is not open`);
  }
  for (const name of ['content.mjs', 'visit-details.mjs', 'visit-planner.mjs', 'nearby-visit-pages.mjs', 'hormone-care-hub.mjs', 'womens-hrt-page.mjs', 'launch-email-copy.mjs', 'launch-email.mjs']) {
    assert.doesNotMatch(await readFile(join(projectRoot, 'src', name), 'utf8'), notOpen, `src/${name} still says booking is not open`);
  }

  // The true state is stated where people look for it, and the clinic's own opening status stays.
  for (const slug of ['/', '/founding-patients/', '/plan-your-visit/', '/merrillville/', '/faq/', '/how-it-works/', '/pricing/', '/visit-from-munster/', '/visit-from-crown-point/', '/visit-from-schererville/', '/womens-hormone-replacement-therapy/', ...offerBandPages]) {
    assert.ok(htmlBySlug.get(slug).includes(bookingStatus), `${slug} must say online booking is open`);
  }
  for (const [slug, html] of htmlBySlug) {
    if (!bookingSlugs.has(slug)) assert.match(html, /class="announcement-copy">Planned launch: November 20, 2026/, `${slug} keeps the opening date`);
    assert.match(html, /Coming soon/, `${slug} keeps the clinic's Coming soon status`);
  }

  // Clinic hours where the site talks about visiting or booking.
  const hours = '<strong>Hours from November 20</strong><br>Wednesday, Thursday and Friday: 11 a.m. to 5 p.m.<br>Saturday: 9 a.m. to 1 p.m.<br>Closed Sunday through Tuesday.<br>Closed Thanksgiving Day, November 26.';
  assert.ok(htmlBySlug.get('/plan-your-visit/').includes(`<div class="visit-fact"><p class="clinic-hours">${hours}</p></div>`), 'Plan Your Visit lists the hours');
  assert.match(htmlBySlug.get('/merrillville/'), /<dt>Hours from November 20<\/dt><dd>Wednesday, Thursday and Friday: 11 a\.m\. to 5 p\.m\.<br>Saturday: 9 a\.m\. to 1 p\.m\.<br>Closed Sunday through Tuesday\.<br>Closed Thanksgiving Day, November 26\.<\/dd>/);
  assert.match(htmlBySlug.get('/faq/'), /Hours from November 20: Wednesday, Thursday and Friday, 11 a\.m\. to 5 p\.m\. Saturday, 9 a\.m\. to 1 p\.m\. Closed Sunday through Tuesday\. Closed Thanksgiving Day, November 26\./);
});

test('new booking and offer copy follows the public-copy rules', () => {
  // No "free" offer, no named lab tests or prescription drugs, no outcome promises, no clinician claims, no exclamation marks.
  const forbidden = /\bfree\b|testosterone|\bPSA\b|vitamin D|\bTSH\b|\bT4\b|\bTRT\b|low T\b|semaglutide|tirzepatide|before and after|guarantee|\bdoctor\b|physician|!/i;
  for (const slug of offerBandPages) {
    const band = htmlBySlug.get(slug).match(/<aside class="offer-band"[\s\S]*?<\/aside>/)?.[0];
    assert.ok(band, `${slug} offer band`);
    assert.doesNotMatch(band.replace(/<[^>]+>/g, ' '), forbidden, `${slug} offer band copy`);
  }
  for (const [slug, pattern] of [
    ['/founding-patients/', /<main[\s\S]*?<\/main>/],
    ['/plan-your-visit/', /<div class="visit-fact"><strong>Grand opening[\s\S]*?<\/div>/],
  ]) {
    const block = htmlBySlug.get(slug).match(pattern)?.[0];
    assert.ok(block, `${slug} offer block`);
    assert.doesNotMatch(block.replace(/<[^>]+>/g, ' '), forbidden, `${slug} offer block copy`);
  }
  for (const [slug, html] of htmlBySlug) {
    // Nothing on the site says who a patient will see at a first visit or how results are reviewed.
    assert.doesNotMatch(html, /you(?:’|')ll (?:see|meet with) (?:our|the|a) (?:nurse practitioner|provider|clinician)|your first visit is with|results (?:are|will be) reviewed by/i, `${slug} must not state who is seen or how results are reviewed`);
  }
});

test('the retired launch-offer wording is absent from every generated page', async () => {
  const retired = /first[ -]100|100 assessments|free initial|free (?:wellness )?assessment|selected (?:baseline )?labs|baseline labs|no purchase|assessments, on us/i;
  for (const [slug, html] of htmlBySlug) assert.doesNotMatch(html, retired, `${slug} still carries the retired offer wording`);
  assert.doesNotMatch(await readFile(join(publicRoot, '404.html'), 'utf8'), retired);

  const visit = htmlBySlug.get('/plan-your-visit/');
  assert.match(visit, /<strong>Grand opening: \$49 for labs and your first visit<\/strong><p class="offer-limit">First 50 appointments scheduled\.<\/p>/);
  assert.match(visit, /\$49 covers your first visit and the promotional labs\. Labs as clinically appropriate\. One per person\. First 50 appointments scheduled\. Additional testing or treatment is separate\. Appointments subject to availability\./);
  assert.match(visit, /Book online or call <a href="tel:\+12192072456">\(219\) 207-2456<\/a> to schedule, or join the Launch List for updates\./);
  assert.match(visit, /data-help-question="How does the \$49 promotional labs offer work\?">\$49 labs<\/button>/);
  assert.match(visit, /data-help-question="How do I book a visit\?">Book a visit<\/button><button type="button" data-help-question="What are your hours\?">Hours<\/button>/);

  const story = htmlBySlug.get('/blog/before-the-doors-open-apex-wellness/');
  assert.match(story, /Our grand-opening offer is promotional labs for \$49 for the first 50 appointments scheduled\. The \$49 covers your first visit and the promotional labs\. Labs as clinically appropriate\. One per person\. Additional testing or treatment is separate\. Appointments subject to availability\. Book online or call \(219\) 207-2456 to schedule/);
});

test('all CSS assets and self-hosted fonts resolve without third-party runtime calls', async () => {
  for (const name of ['site.css', 'site-design.css']) {
    const css = await readFile(join(publicRoot, 'assets', name), 'utf8');
    for (const [, raw] of css.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g)) {
      const url = new URL(raw, `${site.canonicalUrl}/assets/${name}`);
      assert.equal(url.origin, site.canonicalUrl, `${name} should not load external assets`);
      assert.ok(existsSync(outputTargetForPath(url.pathname)), `${name}: missing ${raw}`);
    }
  }
  for (const name of ['instrument-serif-license.txt', 'manrope-license.txt']) {
    assert.ok(existsSync(join(publicRoot, 'assets', 'fonts', name)), `font license ${name}`);
  }
});

test('September 21 choosing-a-practice release is nonmedical, current-address and identity-safe', () => {
  const text = JSON.stringify(choosingAPracticeArticle);
  assert.equal(choosingAPracticeArticle.editorialType, 'nonmedical');
  assert.equal(choosingAPracticeArticle.published, '2026-09-21');
  assert.equal(choosingAPracticeArticle.sections.find(s => s.heading === 'Keep one small comparison sheet').bullets.length, 6);
  assert.match(text, /8550 Broadway, Suite B/);
  assert.doesNotMatch(text, /8560|medically reviewed by|guaranteed|takes shape|Wajeeh|Bakhsh|—/i);
});

test('September 27 launch-list article stays in its administrative scope', () => {
  const article = blogPosts.find(post => post.slug === '/blog/launch-list-what-to-share/');
  assert.ok(article);
  assert.equal(article.editorialType, 'nonmedical');
  assert.equal(article.published, '2026-09-27');
  assert.equal(article.status, 'published');
  const text = JSON.stringify(article);
  assert.match(text, /8550 Broadway, Suite B/);
  assert.match(text, /phone/i);
  assert.doesNotMatch(text, /just (?:your )?name and email/i);
  assert.doesNotMatch(text, /8560|Wajeeh|Bakhsh|guaranteed|—/i);
});

test('September 30 community-resource article remains local, sourced and nonmedical', () => {
  const article = blogPosts.find(post => post.slug === '/blog/lake-county-library-week-planning/');
  assert.ok(article);
  assert.equal(article.editorialType, 'nonmedical');
  assert.equal(article.published, '2026-09-30');
  assert.equal(article.status, 'published');
  assert.equal(article.sources.length, 5);
  const text = JSON.stringify(article);
  assert.match(text, /1919 W\. 81st Ave/);
  assert.match(text, /8550 Broadway, Suite B/);
  assert.doesNotMatch(text, /8560|Wajeeh|Bakhsh|guaranteed|—/i);
});

test('October 9 website-reading guide uses its own date, current facts and deliberate no-image layout', async () => {
  const article = blogPosts.find(post => post.slug === '/blog/how-to-read-a-clinic-website/');
  assert.ok(article);
  assert.equal(article.status, 'published');
  assert.equal(article.editorialType, 'nonmedical');
  assert.equal(article.published, '2026-10-09');
  assert.equal(article.heroImage, null);
  const html = await readFile(pageOutputPath(article.slug), 'utf8');
  assert.match(html, /Published October 9, 2026/);
  assert.match(html, /MedlinePlus: Evaluating Health Information/);
  assert.match(html, /NCCIH: Are You Reading News or Advertising/);
  assert.doesNotMatch(html, /<figure class="representative"/);
  const text = JSON.stringify(article);
  assert.match(text, /8550 Broadway, Suite B/);
  assert.doesNotMatch(text, /8560|Wajeeh|Bakhsh|guaranteed|—/i);
});

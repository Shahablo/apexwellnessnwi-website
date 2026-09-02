#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { pages, site } from "../src/content.mjs";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/smoke.mjs https://apexwellnessnwi.com");
  process.exit(2);
}

let deployment;
try {
  deployment = new URL(input);
} catch {
  console.error(`Invalid base URL: ${input}`);
  process.exit(2);
}

if (!/^https?:$/.test(deployment.protocol)) {
  console.error("Base URL must use http:// or https://");
  process.exit(2);
}

deployment.pathname = "/";
deployment.search = "";
deployment.hash = "";

const baseOrigin = deployment.origin;
const canonicalOrigin = new URL(site.canonicalUrl).origin;
const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    return await fetch(url, {
      ...init,
      headers: {
        Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
        "User-Agent": "ApexWellness-Smoke/1.0",
        ...init.headers,
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function titleText(html) {
  const value = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";
  return value
    .replace(/&#x([\da-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&(amp|apos|gt|lt|quot);/gi, (_, name) => ({
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      quot: '"',
    })[name.toLowerCase()]);
}

function canonicalHref(html) {
  const tags = [...html.matchAll(/<link\b([^>]*)>/gi)];
  for (const [, raw] of tags) {
    const rel = raw.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] || "";
    if (!rel.toLowerCase().split(/\s+/).includes("canonical")) continue;
    return raw.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] || "";
  }
  return "";
}

function checkSecurityHeaders(response, label) {
  const expected = [
    ["content-security-policy", /\bdefault-src\b/i],
    ["strict-transport-security", /\bmax-age=\d+/i],
    ["x-content-type-options", /^nosniff$/i],
    ["x-frame-options", /^(?:DENY|SAMEORIGIN)$/i],
    ["referrer-policy", /\S/],
    ["permissions-policy", /\S/],
  ];
  for (const [name, pattern] of expected) {
    const value = response.headers.get(name) || "";
    check(pattern.test(value), `${label}: missing or invalid ${name}`);
  }
}

function routeUrl(origin, slug) {
  return new URL(slug, `${origin}/`).href;
}

async function checkRoutes() {
  await Promise.all(Object.values(pages).map(async (page) => {
    const label = `route ${page.slug}`;
    try {
      const response = await fetchWithTimeout(routeUrl(baseOrigin, page.slug));
      const html = await response.text();
      check(response.status === 200, `${label}: expected 200, received ${response.status}`);
      check(response.headers.get("content-type")?.includes("text/html"), `${label}: expected HTML content type`);
      check(titleText(html) === page.title, `${label}: unexpected title`);
      check(canonicalHref(html) === new URL(page.slug, site.canonicalUrl).href, `${label}: unexpected canonical URL`);
      checkSecurityHeaders(response, label);
    } catch (error) {
      check(false, `${label}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }));
}

async function checkCanonicalRedirects() {
  if (!/^(?:www\.)?apexwellnessnwi\.com$/i.test(deployment.hostname)) {
    console.warn(`Skipping production-host redirect checks for ${deployment.hostname}.`);
    return;
  }

  const redirectCases = [
    ["http://apexwellnessnwi.com/", "plain HTTP apex"],
    ["http://www.apexwellnessnwi.com/", "plain HTTP www"],
    ["https://www.apexwellnessnwi.com/", "HTTPS www canonicalization"],
  ];

  for (const [url, label] of redirectCases) {
    try {
      const initial = await fetchWithTimeout(url, { redirect: "manual" });
      check([301, 302, 307, 308].includes(initial.status), `${label}: expected redirect, received ${initial.status}`);
      const location = initial.headers.get("location");
      check(Boolean(location), `${label}: redirect is missing Location`);

      const final = await fetchWithTimeout(url, { redirect: "follow" });
      check(final.status === 200, `${label}: final response was ${final.status}`);
      check(new URL(final.url).origin === canonicalOrigin, `${label}: final origin is ${new URL(final.url).origin}`);
      check(new URL(final.url).protocol === "https:", `${label}: final URL is not HTTPS`);
    } catch (error) {
      check(false, `${label}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

async function checkFunnelRedirects() {
  const redirectCases = [
    ["/priority", "/founding-patients/"],
    ["/priority/", "/founding-patients/"],
    ["/priority-list", "/founding-patients/"],
    ["/priority-list/", "/founding-patients/"],
    ["/founding-patients", "/founding-patients/"],
  ];

  for (const [source, destination] of redirectCases) {
    const label = `funnel redirect ${source}`;
    try {
      const initial = await fetchWithTimeout(routeUrl(baseOrigin, source), { redirect: "manual" });
      check([301, 302, 307, 308].includes(initial.status), `${label}: expected redirect, received ${initial.status}`);
      check(Boolean(initial.headers.get("location")), `${label}: redirect is missing Location`);

      const final = await fetchWithTimeout(routeUrl(baseOrigin, source), { redirect: "follow" });
      const finalUrl = new URL(final.url);
      check(final.status === 200, `${label}: final response was ${final.status}`);
      check(finalUrl.pathname === destination, `${label}: final path is ${finalUrl.pathname}`);
      const html = await final.text();
      check(
        canonicalHref(html) === new URL(destination, site.canonicalUrl).href,
        `${label}: final page has an unexpected canonical URL`,
      );
    } catch (error) {
      check(false, `${label}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

async function checkApi() {
  try {
    const response = await fetchWithTimeout(routeUrl(baseOrigin, "/api/founding-consultation"), {
      method: "GET",
      headers: { Accept: "application/json", Origin: canonicalOrigin },
    });
    const body = await response.json().catch(() => null);
    const allow = response.headers.get("allow") || "";
    check(response.status === 405, `/api/founding-consultation GET: expected 405, received ${response.status}`);
    check(allow.includes("POST"), "/api/founding-consultation GET: Allow must include POST");
    check(allow.includes("OPTIONS"), "/api/founding-consultation GET: Allow must include OPTIONS");
    check(response.headers.get("content-type")?.includes("application/json"), "/api/founding-consultation GET: expected JSON");
    check(response.headers.get("cache-control") === "no-store", "/api/founding-consultation GET: expected no-store");
    check(body?.ok === false, "/api/founding-consultation GET: expected generic error JSON");
    checkSecurityHeaders(response, "/api/founding-consultation GET");
  } catch (error) {
    check(false, `/api/founding-consultation GET: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    const response = await fetchWithTimeout(routeUrl(baseOrigin, "/api/founding-consultation"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: canonicalOrigin,
      },
      body: JSON.stringify({}),
    });
    const body = await response.json().catch(() => null);
    check(response.status === 422, `/api/founding-consultation invalid POST: expected 422, received ${response.status}`);
    check(response.headers.get("cache-control") === "no-store", "/api/founding-consultation invalid POST: expected no-store");
    check(Array.isArray(body?.fields), "/api/founding-consultation invalid POST: expected validation fields");
    checkSecurityHeaders(response, "/api/founding-consultation invalid POST");
  } catch (error) {
    check(false, `/api/founding-consultation invalid POST: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    const response = await fetchWithTimeout(routeUrl(baseOrigin, "/api/priority"), {
      method: "GET",
      headers: { Accept: "application/json", Origin: canonicalOrigin },
    });
    const body = await response.json().catch(() => null);
    check(response.status === 410, `/api/priority GET: expected 410, received ${response.status}`);
    check(response.headers.get("content-type")?.includes("application/json"), "/api/priority GET: expected JSON");
    check(response.headers.get("cache-control") === "no-store", "/api/priority GET: expected no-store");
    check(body?.ok === false, "/api/priority GET: expected retired-endpoint error JSON");
    checkSecurityHeaders(response, "/api/priority GET");
  } catch (error) {
    check(false, `/api/priority GET: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    const response = await fetchWithTimeout(routeUrl(baseOrigin, "/api/not-a-route"), {
      headers: { Accept: "application/json", Origin: canonicalOrigin },
    });
    check(response.status === 404, `/api/not-a-route: expected 404, received ${response.status}`);
    check(response.headers.get("content-type")?.includes("application/json"), "/api/not-a-route: expected JSON");
  } catch (error) {
    check(false, `/api/not-a-route: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function checkLegalPages() {
  const expected = new Map(site.policyNavigation.map((item) => [item.href, item.label]));
  check(expected.size === 5, `content defines ${expected.size} legal pages instead of five`);

  await Promise.all([...expected].map(async ([path, label]) => {
    try {
      const response = await fetchWithTimeout(routeUrl(baseOrigin, path));
      const html = await response.text();
      check(response.status === 200, `${label}: expected 200, received ${response.status}`);
      check(new RegExp(`<h1\\b[^>]*>[\\s\\S]*${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(html), `${label}: expected page heading`);
    } catch (error) {
      check(false, `${label}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }));
}

function currentCommitObjectPath() {
  try {
    const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
    const hash = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (/^[a-f0-9]{40,64}$/i.test(hash)) return `/.git/objects/${hash.slice(0, 2)}/${hash.slice(2)}`;
  } catch {
    // A representative object probe below remains useful outside a Git checkout.
  }
  return "/.git/objects/00/00000000000000000000000000000000000000";
}

async function checkSensitivePaths() {
  const sensitivePaths = [
    "/.git/config",
    "/.git/HEAD",
    "/.git/index",
    "/.git/logs/HEAD",
    "/.git/objects/info/packs",
    currentCommitObjectPath(),
  ];

  await Promise.all(sensitivePaths.map(async (path) => {
    try {
      const response = await fetchWithTimeout(routeUrl(baseOrigin, path), { redirect: "follow" });
      check(response.status === 404, `${path}: expected 404, received ${response.status}`);
    } catch (error) {
      check(false, `${path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }));
}

console.log(`Smoke testing ${baseOrigin}`);
await checkRoutes();
await checkCanonicalRedirects();
await checkFunnelRedirects();
await checkApi();
await checkLegalPages();
await checkSensitivePaths();

if (failures.length) {
  console.error(`\nFAILED: ${failures.length} of ${checks} checks`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${checks} checks`);
}

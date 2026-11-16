import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pages, site } from '../src/content.mjs';

const output = (path) => readFile(new URL(`../public/${path}`, import.meta.url), 'utf8');

const bookOnlineLink = '<a href="https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_117405" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" data-book-online>Book online<span class="visually-hidden"> (opens a new tab)</span></a>';

test('the location route is discoverable and shows clinic hours, opening status and online booking', async () => {
  const location = await output('merrillville/index.html');
  const home = await output('index.html');
  const sitemap = await output('sitemap.xml');
  assert.match(home, /href="\/merrillville\/"/);
  assert.match(sitemap, /<loc>https:\/\/apexwellnessnwi.com\/merrillville\/<\/loc>/);
  assert.match(location, /8550 Broadway, Suite B/);
  assert.ok(location.includes(`<dt>Availability</dt><dd>Coming soon. Online booking is open for visits from November 20. ${bookOnlineLink}</dd>`));
  assert.ok(location.includes('<dt>Hours from November 20</dt><dd>Wednesday, Thursday and Friday: 11 a.m. to 5 p.m.<br>Saturday: 9 a.m. to 1 p.m.<br>Closed Sunday through Tuesday.<br>Closed Thanksgiving Day, November 26.</dd>'));
  assert.match(location, /Walk-in visits have not been announced/);
  assert.match(location, /Visits are planned to be in person at launch/);
  assert.match(location, /data-photo-kind="documentary"/);
  assert.doesNotMatch(location, /<iframe|<form[^>]*action="https?:|aggregateRating|Book now|Scheduling is not open/i);
  const mapLink = [...location.matchAll(/href="([^"]+)"/g)].map(m => m[1].replaceAll('&amp;', '&')).find(href => href.startsWith('https://www.google.com/maps/dir/'));
  assert.equal(new URL(mapLink).searchParams.get('destination'), site.address.label);
});

test('each care page links to practical next steps and its own working FAQ anchor', async () => {
  for (const item of site.navigation.filter(item => item.section === 'care')) {
    const html = await output(`${item.href.slice(1)}index.html`);
    for (const href of ['/merrillville/', '/pricing/', '/how-it-works/']) assert.ok(html.includes(`href="${href}"`), `${item.href}: ${href}`);
    assert.match(html, /In-person visits at launch/);
    assert.ok(html.includes('<dt>Hours from November 20</dt><dd>Wednesday, Thursday and Friday: 11 a.m. to 5 p.m.<br>Saturday: 9 a.m. to 1 p.m.</dd>'), `${item.href}: clinic hours`);
    assert.ok(html.includes(`<p class="visit-details-note">Coming soon. Online booking is open for visits from November 20. ${bookOnlineLink}<a href="#`), `${item.href}: booking status`);
    const anchor = html.match(/href="#([^"]+)">Jump to common questions/);
    assert.ok(anchor, item.href);
    assert.ok(html.includes(`id="${anchor[1]}"`), `${item.href}: resolved FAQ target`);
    assert.doesNotMatch(html, /<iframe|<form[^>]*action="https?:/i);
  }
  assert.match(pages['weight-management'].sections.find(section => section.type === 'faq').items[1].answer, /included in a package or billed separately/);
});

test('nearby-town visitor pages have distinct route help and one truthful clinic location', async () => {
  const townCases = [
    { path: 'visit-from-munster', origin: 'Munster, IN', unique: /Calumet Avenue connects Munster to the US 30 corridor/ },
    { path: 'visit-from-crown-point', origin: 'Crown Point, IN', unique: /Broadway Metro Express service through Crown Point and Merrillville/ },
    { path: 'visit-from-schererville', origin: 'Schererville, IN', unique: /US 41\/US 30 crossroads/ }
  ];
  const location = await output('merrillville/index.html');
  const sitemap = await output('sitemap.xml');
  const titles = new Set();

  for (const { path, origin, unique } of townCases) {
    const html = await output(`${path}/index.html`);
    const slug = `/${path}/`;
    assert.match(location, new RegExp(`href="${slug}"`));
    assert.match(sitemap, new RegExp(`<loc>https://apexwellnessnwi.com${slug}</loc>`));
    assert.match(html, new RegExp(`<link rel="canonical" href="https://apexwellnessnwi.com${slug}"`));
    assert.match(html, /<meta name="robots" content="index, follow/);
    assert.match(html, /8550 Broadway, Suite B/);
    assert.match(html, /Merrillville, IN 46410/);
    assert.match(html, /Coming soon/);
    assert.match(html, /href="\/merrillville\/"/);
    assert.match(html, unique);
    assert.match(html, /Online booking is open for visits from November 20\./);
    assert.doesNotMatch(html, /aggregateRating|Book now|free parking|minutes from|Scheduling is not open|not being scheduled/i);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title && !titles.has(title), `${slug} needs a distinct title`);
    titles.add(title);

    const directionLinks = [...html.matchAll(/href="(https:\/\/www\.google\.com\/maps\/dir\/\?[^\"]+)"/g)]
      .map((match) => new URL(match[1].replaceAll('&amp;', '&')));
    assert.ok(directionLinks.length, `${slug} needs a live directions link`);
    assert.ok(directionLinks.some((url) => url.searchParams.get('origin') === origin), `${slug} needs its town origin`);
    assert.ok(directionLinks.every((url) => url.searchParams.get('destination') === site.address.label), `${slug} must point to Suite B`);
  }
});

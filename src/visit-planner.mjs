// The one place the public Apex Tebra online-booking address is kept.
// No patient information or campaign query parameters are forwarded from this site.
// - bookOnline: shows every "Book online" button and link (offer blocks, care-page offer bands, visit details, FAQ answers and closing sections).
//   Owner-confirmed November 16, 2026: online booking is open for visits from November 20. Page copy says so in words as well,
//   so setting this to false removes the links but the wording in src/ and scripts/build.mjs must be changed with it.
// - ready: also replaces the Plan Your Visit contact step with the scheduling handoff. Keep it false until practice readiness is confirmed.
export const scheduling = Object.freeze({
  publicUrl: 'https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_117405',
  bookOnline: true,
  ready: false
});

const practicePageHosts = ['practice.kareo.com', 'www.tebra.com', 'tebra.com'];
// Tebra serves its hosted online-booking page from this exact host, at the root path, keyed only by practiceKey.
const bookingPageHost = 'd2oe0ra32qx05a.cloudfront.net';

function verifiedSchedulingUrl(publicUrl) {
  const url = new URL(publicUrl);
  const practicePage = practicePageHosts.includes(url.hostname) && !url.search && url.pathname !== '/';
  const bookingPage = url.hostname === bookingPageHost && url.pathname === '/' && /^\?practiceKey=k_\d+_\d+$/.test(url.search);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.hash || !(practicePage || bookingPage)) {
    throw new Error('Use a verified HTTPS Apex practice scheduling URL without credentials or tracking parameters.');
  }
  return url.href;
}

export function schedulingUrl(config = scheduling) {
  if (!config.ready || !config.publicUrl) return null;
  return verifiedSchedulingUrl(config.publicUrl);
}

export function bookOnlineUrl(config = scheduling) {
  if (!config.bookOnline || !config.publicUrl) return null;
  return verifiedSchedulingUrl(config.publicUrl);
}

export const visitPlannerPage = Object.freeze({
  kind: 'visitPlanner', slug: '/plan-your-visit/', modified: '2026-11-16',
  navLabel: 'Plan your visit', title: 'Plan Your First Visit | Apex Wellness',
  description: 'Walk through the visit format, clinic hours, costs and how to book at Apex Wellness in Merrillville. Online booking is open for visits from November 20.',
  eyebrow: 'Your first step', h1: 'Let’s plan your first visit.',
  intro: 'A short walkthrough of where you’ll come, what to expect about costs, and how to book. No medical details needed.',
  sections: []
});

// The one place the public Apex Tebra online-booking address is kept.
// No patient information or campaign query parameters are forwarded from this site.
// - bookOnline: shows the "Book online" button in the launch-offer blocks. Set it to false to remove the button everywhere.
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
  kind: 'visitPlanner', slug: '/plan-your-visit/', modified: '2026-11-15',
  navLabel: 'Plan your visit', title: 'Plan Your First Visit | Apex Wellness',
  description: 'Walk through the planned visit format, costs and next steps at Apex Wellness in Merrillville. Coming soon; appointment availability is not yet confirmed.',
  eyebrow: 'Your first step · Coming soon', h1: 'Let’s plan your first visit.',
  intro: 'A short walkthrough of where you’ll come, what to expect about costs, and how scheduling will work. No medical details needed.',
  sections: []
});

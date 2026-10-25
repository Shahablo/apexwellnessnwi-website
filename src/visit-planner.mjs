// Add only the verified public Apex Tebra URL after practice readiness is confirmed.
// No patient information or campaign query parameters are forwarded from this page.
export const scheduling = Object.freeze({ publicUrl: '', ready: false });

export function schedulingUrl(config = scheduling) {
  if (!config.ready || !config.publicUrl) return null;
  const url = new URL(config.publicUrl);
  const approvedHosts = ['practice.kareo.com', 'www.tebra.com', 'tebra.com'];
  if (url.protocol !== 'https:' || !approvedHosts.includes(url.hostname) || url.username || url.password || url.search || url.hash || url.pathname === '/') {
    throw new Error('Use a verified HTTPS Apex practice scheduling URL without credentials or tracking parameters.');
  }
  return url.href;
}

export const visitPlannerPage = Object.freeze({
  kind: 'visitPlanner', slug: '/plan-your-visit/', modified: '2026-10-25',
  navLabel: 'Plan your visit', title: 'Plan Your First Visit | Apex Wellness',
  description: 'Walk through the planned visit format, costs and next steps at Apex Wellness in Merrillville. Coming soon; appointment availability is not yet confirmed.',
  eyebrow: 'Your first step · Coming soon', h1: 'Let’s plan your first visit.',
  intro: 'A short walkthrough of where you’ll come, what to expect about costs, and how scheduling will work. No medical details needed.',
  sections: []
});

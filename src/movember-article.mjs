import { readFileSync } from 'node:fs';

// Keep the reviewed editorial source byte-for-byte in src/editorial. The build
// converts only its limited paragraph, heading, emphasis and link formatting.
const source = readFileSync(new URL('./editorial/movember-v3.md', import.meta.url), 'utf8');

// Booking status only. The reviewed source said scheduling was not open, which was true on
// November 4. The owner confirmed on November 16, 2026 that online booking is open for visits
// from November 20, so the published copy states that instead. The source file is unchanged,
// no clinical wording is touched, and the build fails if the reviewed sentence ever moves.
const bookingStatusUpdate = Object.freeze({
  reviewed: 'Scheduling is not open yet. Clinical staffing, appointment availability, final services, and pricing still need to be confirmed before visits begin.',
  current: 'Online booking is open for visits from November 20. Clinical staffing, final services, and pricing still need to be confirmed before visits begin.'
});
if (!source.includes(bookingStatusUpdate.reviewed)) {
  throw new Error('The reviewed Movember source no longer contains the booking-status sentence that is updated at build time.');
}

const body = source.replace(bookingStatusUpdate.reviewed, bookingStatusUpdate.current).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
const sectionsText = body.replace(/^### Source and scope$/m, '## Source and scope').split(/^## /m);
const intro = sectionsText.shift().replace(/^# [^\n]+\r?\n/, '').trim();
const sections = sectionsText.map((text) => {
  const [heading, ...rest] = text.trim().split(/\r?\n/);
  return { heading: heading.trim(), paragraphs: rest.join('\n').trim().split(/\r?\n\s*\r?\n/).filter(Boolean) };
});

export const movemberArticle = Object.freeze({
  slug: '/blog/movember-mens-health-merrillville/',
  status: 'published',
  editorialType: 'clinical-owner-attested-verbal-review',
  title: 'The Mustache Is Optional: A Clearer Movember Conversation in Merrillville',
  description: "Movember can start a men's health conversation. Apex Wellness explains its specific planned focus in Merrillville without slogans or miracle promises.",
  eyebrow: 'Apex Wellness updates',
  readTime: '4 minute read',
  h1: 'The mustache is optional. The conversation is the point.',
  intro,
  excerpt: 'A few days late to Movember, with a clear introduction to the men’s hormone-health area Apex is preparing in Merrillville.',
  published: '2026-11-04',
  modified: '2026-11-16',
  category: 'About Apex',
  author: 'Apex Wellness Editorial Team',
  heroImage: null,
  richText: true,
  relatedService: { label: "Explore planned men's hormone health", href: '/mens-hormone-health/' },
  sections,
  sources: [
    { label: 'Movember: Raise funds. Save lives. (September 30, 2026)', href: 'https://movember.com/articles/raise-funds-save-lives' },
    { label: 'Apex Wellness: Planned men’s hormone health', href: 'https://apexwellnessnwi.com/mens-hormone-health/' },
    { label: 'Apex Wellness: Book online', href: 'https://apexwellnessnwi.com/founding-patients/' }
  ],
  disclaimerHeading: 'About this article',
  disclaimer: 'This article describes a planned care area at a clinic preparing to open. It provides general information, not medical advice, diagnosis, treatment, screening guidance, or an assessment of any individual concern.',
  editorialNote: 'Prepared by the Apex Wellness Editorial Team. The Movember campaign date and purpose are attributed to Movember; Apex does not claim partnership or participation. Updated November 16, 2026 for booking status only: online booking is open for visits from November 20.',
  ctaBody: 'Read about the planned care area.'
});

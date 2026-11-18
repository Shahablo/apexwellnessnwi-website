// Short booking pages, one per Google ad group, built from the same template as /founding-patients/
// (renderBookingLanding in scripts/build.mjs). Added November 16, 2026.
// Only the fields below vary per page. The offer line, steps, fine print, hours and booking link are shared.
// The pages overlap the service pages, so they are noindex and stay out of the sitemap and navigation.
// Wording is drawn from the matching service page: no drug names, no named lab tests, no outcome promises.
import { bookingStatus } from './clinic-facts.mjs';

const adPages = [
  {
    key: 'book-weight-loss',
    slug: '/book/weight-loss/',
    navLabel: 'Book medical weight loss',
    title: 'Medical Weight Loss in Merrillville | Book for $49 | Apex Wellness',
    description:
      'Book a first visit for medical weight loss at Apex Wellness in Merrillville. Grand opening: $49 for labs and your first visit, for the first 50 appointments scheduled. Online booking is open.',
    eyebrow: 'Medical weight loss · Opening Friday, November 20',
    h1: 'Medical weight loss in Merrillville. Start for $49.',
    lead: 'Care that begins with an evaluation of your history, risks and goals.',
    covers: [
      'Your medical history, goals and what you have tried before.',
      'Relevant measurements, with labs as clinically appropriate.',
      'Reasonable options and next steps, including nutrition and activity support.'
    ],
    learnMore: { label: 'Learn more about medical weight loss', href: '/weight-management/' }
  },
  {
    key: 'book-hormone-health',
    slug: '/book/hormone-health/',
    navLabel: 'Book men’s hormone health',
    title: 'Men’s Hormone Health in Merrillville | Book for $49 | Apex Wellness',
    description:
      'Book a first visit for men’s hormone health at Apex Wellness in Merrillville. Grand opening: $49 for labs and your first visit, for the first 50 appointments scheduled. Online booking is open.',
    eyebrow: 'Men’s hormone health · Opening Friday, November 20',
    h1: 'Men’s hormone health in Merrillville. Start for $49.',
    lead: 'Symptoms, testing and health risks are reviewed together. One lab number does not decide the plan.',
    covers: [
      'Your symptoms, medical history and current medications.',
      'Testing as clinically appropriate, based on your history.',
      'What the numbers may mean, the alternatives and next steps.'
    ],
    learnMore: { label: 'Learn more about men’s hormone health', href: '/mens-hormone-health/' }
  },
  {
    key: 'book-womens-midlife',
    slug: '/book/womens-midlife/',
    navLabel: 'Book women’s midlife care',
    title: 'Perimenopause and Menopause Care in Merrillville | Book for $49 | Apex Wellness',
    description:
      'Book a first visit for perimenopause and menopause care at Apex Wellness in Merrillville. Grand opening: $49 for labs and your first visit, for the first 50 appointments scheduled. Online booking is open.',
    eyebrow: 'Women’s midlife care · Opening Friday, November 20',
    h1: 'Perimenopause and menopause care in Merrillville. Start for $49.',
    lead: 'An individualized look at perimenopause, menopause, weight, sleep and related midlife concerns.',
    covers: [
      'Your symptoms, history and what matters most to you.',
      'An individualized risk assessment, with labs as clinically appropriate.',
      'A clear discussion of options, hormonal and non-hormonal.'
    ],
    learnMore: { label: 'Learn more about women’s midlife care', href: '/womens-midlife-care/' }
  },
  {
    key: 'book-hair-loss',
    slug: '/book/hair-loss/',
    navLabel: 'Book hair-loss care',
    title: 'Hair-Loss Care in Merrillville | Book for $49 | Apex Wellness',
    description:
      'Book a first visit for hair-loss care at Apex Wellness in Merrillville. Grand opening: $49 for labs and your first visit, for the first 50 appointments scheduled. Online booking is open.',
    eyebrow: 'Hair-loss care · Opening Friday, November 20',
    h1: 'Hair-loss care in Merrillville. Start for $49.',
    lead: 'Clinical evaluation for adults with thinning hair and hair loss.',
    covers: [
      'Your concerns, goals and medical history.',
      'An individual evaluation, with labs as clinically appropriate.',
      'Clear information on options and costs before you decide.'
    ],
    learnMore: { label: 'Learn more about hair-loss care', href: '/hair-loss-care/' }
  },
  {
    // Added November 17, 2026. Google restricts prescription drug terms on ad landing pages,
    // so this page says "peptide therapy" only and never names a peptide.
    key: 'book-peptide-therapy',
    slug: '/book/peptide-therapy/',
    navLabel: 'Book peptide therapy',
    title: 'Peptide Therapy in Merrillville | Book for $49 | Apex Wellness',
    description:
      'Book a first visit for peptide therapy at Apex Wellness in Merrillville. Grand opening: $49 for labs and your first visit, for the first 50 appointments scheduled. Online booking is open.',
    eyebrow: 'Peptide therapy · Opening Friday, November 20',
    h1: 'Peptide therapy in Merrillville. Start for $49.',
    lead: 'An in-person visit first, so any plan fits your goals and history.',
    covers: [
      'Your goals, injuries or symptoms and current medications.',
      'An individual evaluation, with labs as clinically appropriate.',
      'Whether a peptide fits, with options and costs before you decide.'
    ],
    learnMore: { label: 'Learn more about peptide therapy', href: '/peptide-therapy/' }
  }
];

// `shared` is the booking block of /founding-patients/ (call label, hours, address, steps, fine print).
export function bookingAdPages(shared) {
  const { care, careHeading, ...common } = shared;
  return Object.fromEntries(adPages.map((page) => [page.key, {
    slug: page.slug,
    modified: '2026-11-16',
    navLabel: page.navLabel,
    title: page.title,
    description: page.description,
    announcement: `Opening November 20 in Merrillville · ${bookingStatus}`,
    eyebrow: page.eyebrow,
    h1: page.h1,
    h1Accent: 'Start for $49.',
    intro: '$49 for labs and your first visit. First 50 appointments only.',
    landing: true,
    noindex: true,
    booking: {
      ...common,
      lead: page.lead,
      coversHeading: 'At your first visit',
      covers: page.covers,
      learnMore: page.learnMore,
      otherServices: { label: 'See our other services', href: '/founding-patients/#services' }
    },
    sections: []
  }]));
}

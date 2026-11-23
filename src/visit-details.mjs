import { bookingStatus } from './clinic-facts.mjs';

// Owner-confirmed October 25 launch format. Online booking and clinic hours were
// owner-confirmed November 16; no clinical eligibility promise.
// An FAQ item with bookOnline: true gets the Book online link after its answer.
export const visitDetails = Object.freeze({
  format: 'In-person visits at launch',
  formatNote: 'Visits are in person in Merrillville. Telehealth is not offered.',
  locationPath: '/merrillville/',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=8550%20Broadway%2C%20Suite%20B%2C%20Merrillville%2C%20IN%2046410',
  quickAnswers: [
    { question: 'Where will visits take place?', answer: `At 8550 Broadway, Suite B, Merrillville, IN 46410. Visits are in person. ${bookingStatus}`, bookOnline: true },
    { question: 'Will Apex offer telehealth at launch?', answer: 'No. Visits are in person.' },
    { question: 'What will care cost, and is insurance accepted?', answer: 'Apex is planning a cash-pay model. Final prices will be published on the Pricing page, with package inclusions and any separate costs explained.' }
  ],
  planningLinks: [
    { title: 'Costs and inclusions', body: 'See what is still being finalized, what fees will explain, and how to compare the full cost of care.', href: '/pricing/', label: 'Review pricing details' },
    { title: 'Your first steps', body: 'Understand the process from opening updates to a possible appointment and evaluation.', href: '/how-it-works/', label: 'See how it works' },
    { title: 'Our Merrillville location', body: 'Find Suite B, open directions and read about the in-person visit format.', href: '/merrillville/', label: 'View location details' }
  ]
});

export const merrillvillePage = Object.freeze({
  slug: '/merrillville/', navLabel: 'Location', modified: '2026-11-16',
  title: 'Merrillville Location & In-Person Care | Apex Wellness',
  description: 'Apex Wellness is open at 8550 Broadway, Suite B, Merrillville, IN 46410. Find directions, clinic hours, in-person visit details and online booking.',
  eyebrow: 'Our Merrillville location',
  h1: 'A local place to take your next step.',
  intro: 'We are getting Apex Wellness ready at 8550 Broadway, Suite B, in Merrillville. Weight and metabolic care, men’s hormone health, women’s midlife care and hair-loss care are offered, with visits in person at launch.',
  heroImage: 'behindWindow',
  cta: { label: 'Book online', href: '/founding-patients/' },
  secondaryCta: { label: 'Open directions', href: visitDetails.directionsUrl },
  ctaNote: `${bookingStatus} Photo: setting up our Merrillville space, October 2026.`,
  sections: [
    { type: 'locationDetails', heading: 'Find Apex on Broadway.', eyebrow: '8550 Broadway · Suite B', body: 'Use the full address, including Suite B, when planning your trip. Parking and arrival instructions will be shared before appointments begin.' },
    { type: 'detail', heading: 'One Merrillville location. Part of Northwest Indiana.', eyebrow: 'Our community', body: 'Our clinic is in Merrillville, with care intended for adults from Crown Point, Schererville, Munster, Dyer, St. John, Highland, Hobart and surrounding Northwest Indiana communities. These are nearby communities we hope to serve, not additional Apex locations.' },
    { type: 'linkCards', heading: 'Coming from a nearby town?', eyebrow: 'Plan the trip', items: [
      { title: 'From Munster', body: 'Start with the Calumet Avenue and US 30 connection, then check the live route to Suite B.', href: '/visit-from-munster/', label: 'Plan from Munster' },
      { title: 'From Crown Point', body: 'Find the right Broadway address and check driving or current transit information.', href: '/visit-from-crown-point/', label: 'Plan from Crown Point' },
      { title: 'From Schererville', body: 'Compare directions from the US 41/US 30 crossroads or downtown before you go.', href: '/visit-from-schererville/', label: 'Plan from Schererville' }
    ] },
    { type: 'linkCards', heading: 'Explore our care.', eyebrow: 'Four areas of care', items: [
      { title: 'Weight & metabolic care', body: 'Read about the approach to medical weight management.', href: '/weight-management/', label: 'Explore weight care' },
      { title: 'Men’s hormone health', body: 'Read about the approach to hormone evaluation.', href: '/mens-hormone-health/', label: 'Explore men’s care' },
      { title: 'Women’s midlife care', body: 'Read about care for perimenopause and menopause concerns.', href: '/womens-midlife-care/', label: 'Explore midlife care' },
      { title: 'Hair-loss care', body: 'Read about the evaluation of hair-loss concerns.', href: '/hair-loss-care/', label: 'Explore hair-loss care' }
    ] },
    { type: 'faq', heading: 'Before planning a visit', items: [
      { question: 'Is the clinic open for appointments or walk-ins?', answer: `Apex is open. ${bookingStatus} Walk-in visits have not been announced, so please book ahead or call (219) 207-2456.`, bookOnline: true },
      { question: 'Do I have to live in Merrillville to visit?', answer: 'No. Neighbors in Munster and elsewhere in Northwest Indiana are welcome too. Apex has one location at 8550 Broadway, Suite B, Merrillville; visits are in person there.' },
      visitDetails.quickAnswers[1],
      { question: 'Can I ask about the location or access?', answer: 'Call (219) 207-2456 or email hello@apexwellnessnwi.com with a general location or accessibility question. Please keep medical details out of ordinary email.' },
      { question: 'Where can I find fees and visit details?', answer: `The Pricing and How It Works pages explain the process. Final fees will be posted on the Pricing page. ${bookingStatus}`, bookOnline: true }
    ] }
  ]
});

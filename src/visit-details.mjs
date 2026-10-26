// Owner-confirmed October 25 launch format; no booking or clinical eligibility promise.
export const visitDetails = Object.freeze({
  format: 'In-person visits at launch',
  formatNote: 'Apex is preparing for in-person care in Merrillville. Telehealth is not planned for launch.',
  locationPath: '/merrillville/',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=8550%20Broadway%2C%20Suite%20B%2C%20Merrillville%2C%20IN%2046410',
  quickAnswers: [
    { question: 'Where will visits take place?', answer: 'At 8550 Broadway, Suite B, Merrillville, IN 46410. Apex is coming soon, with in-person visits planned at launch. Appointment availability will be announced when it is confirmed.' },
    { question: 'Will Apex offer telehealth at launch?', answer: 'No. Visits are planned to be in person at launch. Join the Launch List for opening updates; joining does not book an appointment.' },
    { question: 'What will care cost, and is insurance accepted?', answer: 'Apex is planning a cash-pay model. Final prices will be published before scheduling opens, with package inclusions and any separate costs explained. Joining the Launch List is free.' },
    { question: 'What happens after I join the Launch List?', answer: 'You can receive opening updates and details about pricing and how to book when they are ready. The Launch List asks for your name, email and phone number. Keep health information for the secure clinical intake process after an appointment is confirmed.' }
  ],
  planningLinks: [
    { title: 'Costs and inclusions', body: 'See what is still being finalized, what fees will explain, and how to compare the full cost of care.', href: '/pricing/', label: 'Review pricing details' },
    { title: 'Your first steps', body: 'Understand the planned process from opening updates to a possible appointment and evaluation.', href: '/how-it-works/', label: 'See how it works' },
    { title: 'Our Merrillville location', body: 'Find Suite B, open directions and read about the planned in-person visit format.', href: '/merrillville/', label: 'View location details' }
  ]
});

export const merrillvillePage = Object.freeze({
  slug: '/merrillville/', navLabel: 'Location', modified: '2026-10-25',
  title: 'Merrillville Location & In-Person Care | Apex Wellness',
  description: 'Apex Wellness is coming soon to 8550 Broadway, Suite B, Merrillville, IN 46410. Find directions, planned in-person visit details and opening updates.',
  eyebrow: 'Our Merrillville location · Coming soon',
  h1: 'A local place to take your next step.',
  intro: 'We are getting Apex Wellness ready at 8550 Broadway, Suite B, in Merrillville. Weight and metabolic care, men’s hormone health, women’s midlife care and hair-loss care are planned, with visits in person at launch.',
  heroImage: 'behindWindow',
  cta: { label: 'Join the Launch List', href: '/founding-patients/' },
  secondaryCta: { label: 'Open directions', href: visitDetails.directionsUrl },
  ctaNote: 'Coming soon. Scheduling is not open yet. Photo: preparing our Merrillville space, October 2026.',
  sections: [
    { type: 'locationDetails', heading: 'Find Apex on Broadway.', eyebrow: '8550 Broadway · Suite B', body: 'Use the full address, including Suite B, when planning your trip. Opening hours and parking or arrival instructions will be shared before appointments begin.' },
    { type: 'detail', heading: 'One Merrillville location. Part of Northwest Indiana.', eyebrow: 'Our community', body: 'Our planned clinic is in Merrillville, with care intended for adults from Crown Point, Schererville, Munster, Dyer, St. John, Highland, Hobart and surrounding Northwest Indiana communities. These are nearby communities we hope to serve, not additional Apex locations.' },
    { type: 'linkCards', heading: 'Explore the care we are preparing.', eyebrow: 'Four areas of care', items: [
      { title: 'Weight & metabolic care', body: 'Read about the planned approach to medical weight management.', href: '/weight-management/', label: 'Explore weight care' },
      { title: 'Men’s hormone health', body: 'Read about the planned approach to hormone evaluation.', href: '/mens-hormone-health/', label: 'Explore men’s care' },
      { title: 'Women’s midlife care', body: 'Read about planned care for perimenopause and menopause concerns.', href: '/womens-midlife-care/', label: 'Explore midlife care' },
      { title: 'Hair-loss care', body: 'Read about the planned evaluation of hair-loss concerns.', href: '/hair-loss-care/', label: 'Explore hair-loss care' }
    ] },
    { type: 'faq', heading: 'Before planning a visit', items: [
      { question: 'Is the clinic open for appointments or walk-ins?', answer: 'Not yet. Apex is coming soon, and scheduling is not open. The Launch List is for updates; it does not reserve a visit or establish care.' },
      visitDetails.quickAnswers[1],
      { question: 'Can I ask about the location or access?', answer: 'Call (219) 207-2456 or email hello@apexwellnessnwi.com with a general location or accessibility question. Please keep medical details out of ordinary email and the Launch List form.' },
      { question: 'Where can I find fees and visit details?', answer: 'The Pricing and How It Works pages explain the planned process. Final fees, clinician details and appointment availability will be shared before scheduling opens.' }
    ] }
  ]
});

import { bookingStatus, clinicHours } from './clinic-facts.mjs';

export const hormoneCareHubPage = {
  slug: '/hormone-care-merrillville/',
  modified: '2026-11-16',
  offerBand: true,
  navLabel: 'Hormone Care',
  title: 'Hormone Care in Merrillville, IN | Apex Wellness',
  description: 'Explore men’s hormone health and women’s midlife care at Apex Wellness in Merrillville. Compare the care areas. Online booking is open for visits from November 20.',
  eyebrow: 'Coming soon · Merrillville, Indiana',
  h1: 'Hormone care in Merrillville starts with a clear path.',
  intro: 'Apex Wellness is preparing two distinct hormone-focused care paths at one Northwest Indiana clinic. Choose the page that fits what you want to explore. You can book a first visit online or call with a general clinic question.',
  heroImage: 'behindWindow',
  cta: { label: 'Call Apex with a general question', href: 'tel:+12192072456' },
  ctaNote: 'Coming soon at 8550 Broadway, Suite B. Please save personal medical details for a secure clinical process.',
  sections: [
    {
      type: 'linkCards',
      eyebrow: 'Find the right starting page',
      heading: 'Two care areas, explained separately.',
      items: [
        {
          title: 'Men’s hormone health',
          body: 'See the care area, how Apex describes its approach, and what remains to be confirmed before visits begin.',
          label: 'Explore men’s hormone health',
          href: '/mens-hormone-health/'
        },
        {
          title: 'Women’s midlife care',
          body: 'See the midlife care area and read about the approach before you book.',
          label: 'Explore women’s midlife care',
          href: '/womens-midlife-care/'
        }
      ]
    },
    {
      type: 'detail',
      eyebrow: 'One local location',
      heading: 'The clinic is on Broadway in Merrillville.',
      body: `Apex Wellness is preparing in-person visits at 8550 Broadway, Suite B, Merrillville, IN 46410. ${bookingStatus} ${clinicHours.sentence} Fees will be posted on the Pricing page.`
    },
    {
      type: 'linkCards',
      eyebrow: 'Choose a next step',
      heading: 'Book, ask, or get updates.',
      items: [
        {
          title: 'Plan a first visit',
          body: `${bookingStatus} See the location, clinic hours, costs and the Book online button.`,
          label: 'Plan your first visit',
          href: '/plan-your-visit/'
        },
        {
          title: 'Ask a general clinic question',
          body: 'Call the published Apex number about the location, the opening or booking a visit.',
          label: 'Call (219) 207-2456',
          href: 'tel:+12192072456'
        }
      ]
    },
    {
      type: 'faq',
      heading: 'Before you get in touch',
      items: [
        {
          question: 'Can I book hormone care today?',
          answer: `You can book a first visit. Apex is coming soon. ${bookingStatus} You can also call (219) 207-2456.`,
          bookOnline: true
        },
        {
          question: 'What should I share when I call?',
          answer: 'Use the public number for general clinic questions. Please keep symptoms, medications, test results and other private medical details for a secure clinical process after a visit is arranged.'
        },
        {
          question: 'Where can I learn more about the visit process?',
          answer: 'The How It Works page explains the steps. Clinic hours are on the Location page, and fees will be posted on the Pricing page.'
        }
      ]
    },
    {
      type: 'linkCards',
      eyebrow: 'Plan ahead',
      heading: 'More practical details.',
      items: [
        {
          title: 'How Apex plans to work',
          body: 'See the process, from a first visit to a written plan.',
          label: 'See how it works',
          href: '/how-it-works/'
        },
        {
          title: 'Find the Merrillville location',
          body: 'Check the Suite B address, clinic hours and directions for the one clinic location.',
          label: 'View location details',
          href: '/merrillville/'
        }
      ]
    }
  ]
};

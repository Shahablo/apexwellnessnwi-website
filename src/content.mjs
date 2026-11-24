import { womensHrtPage } from './womens-hrt-page.mjs';
import { hormoneCareHubPage } from './hormone-care-hub.mjs';
import { peptidePages } from './peptide-pages.mjs';
import { merrillvillePage, visitDetails } from './visit-details.mjs';
import { visitPlannerPage } from './visit-planner.mjs';
import { nearbyVisitPages } from './nearby-visit-pages.mjs';
import { bookingAdPages } from './booking-pages.mjs';
import { bookingStatus, clinicHours, grandOpeningOffer, clinicPhone } from './clinic-facts.mjs';

// Sitewide call to action. Since November 16, 2026 it opens the booking page; the Launch List signup is no longer on the site.
const bookingPageCta = Object.freeze({
  label: 'Book online',
  href: '/founding-patients/'
});

// Terms, Accessibility and Cancellation were revised November 16, 2026 when online booking opened.
const effectiveDate = 'November 16, 2026';

const clinicAddress = '8550 Broadway, Suite B, Merrillville, IN 46410';

const emergencyNotice =
  'Apex Wellness does not provide urgent or emergency care. If you are experiencing a medical emergency, call 911 or go to the nearest emergency department.';

const prelaunchNotice =
  'Apex Wellness is open at 8550 Broadway, Suite B, Merrillville.';

export const site = Object.freeze({
  name: 'Apex Wellness',
  canonicalUrl: 'https://apexwellnessnwi.com',
  googleBusinessUrl: 'https://www.google.com/maps/place/Apex+Wellness/data=!4m2!3m1!1s0x8811efe2ce1d593b:0x2689d71d9a9b7eeb?hl=en',
  region: 'Northwest Indiana',
  address: { streetAddress: '8550 Broadway, Suite B', addressLocality: 'Merrillville', addressRegion: 'IN', postalCode: '46410', addressCountry: 'US', label: clinicAddress },
  status: 'Prelaunch',
  email: 'hello@apexwellnessnwi.com',
  phone: clinicPhone.display,
  phoneHref: clinicPhone.href,
  tagline: 'Thoughtful care. Built around you.',
  contentUpdated: '2026-11-16',
  launch: { date: '2026-11-20', label: 'November 20, 2026', status: 'Opened' },
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/apexwellnessnwi/' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593954582564' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/apex-wellness-nwi/' },
    { label: 'NWI wellness community', href: 'https://www.facebook.com/groups/1778107663214102/' }
  ],
  description:
    'Apex Wellness offers weight, metabolic, hormone, hair-loss and peptide care for adults in Northwest Indiana.',
  announcement:
    'Now open in Merrillville · Northwest Indiana.',
  cta: bookingPageCta,
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Weight & Metabolic', href: '/weight-management/', section: 'care' },
    { label: "Men's Hormone Health", href: '/mens-hormone-health/', section: 'care' },
    { label: "Women's Midlife Care", href: '/womens-midlife-care/', section: 'care' },
    { label: "Women's HRT", href: '/womens-hormone-replacement-therapy/', section: 'care' },
    { label: 'Hair-Loss Care', href: '/hair-loss-care/', section: 'care' },
    { label: 'Peptide Therapy', href: '/peptide-therapy/', section: 'care' },
    { label: 'Hormone Care Overview', href: '/hormone-care-merrillville/' },
    { label: 'How It Works', href: '/how-it-works/' },
    { label: 'Plan Your Visit', href: '/plan-your-visit/' },
    { label: 'Pricing', href: '/pricing/' },
    { label: 'Location', href: '/merrillville/' },
    { label: 'From Munster', href: '/visit-from-munster/', section: 'nearby' },
    { label: 'From Crown Point', href: '/visit-from-crown-point/', section: 'nearby' },
    { label: 'From Schererville', href: '/visit-from-schererville/', section: 'nearby' },
    { label: 'About', href: '/about/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'FAQ', href: '/faq/' }
  ],
  policyNavigation: [
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Terms of Use', href: '/terms/' },
    { label: 'Communications Consent', href: '/communications-consent/' },
    { label: 'Accessibility Statement', href: '/accessibility/' },
    { label: 'Cancellation and Refunds', href: '/cancellation-refunds/' }
  ],
  notices: {
    prelaunch: prelaunchNotice,
    emergency: emergencyNotice,
    medical:
      'Website information is educational and is not medical advice, diagnosis, or treatment. Using this website does not create a clinician-patient relationship.',
    pricing:
      'Final fees will be published before payment becomes available. Clinical eligibility and informed consent are required before any treatment.'
  },
  footer: {
    summary:
      'Weight, metabolic, hormone, and hair-loss care for adults in Northwest Indiana.',
    location:
      `${clinicAddress}.`,
    copyright: '© 2026 Apex Wellness.'
  }
});

// Booking block shared by /founding-patients/ and the four ad booking pages in src/booking-pages.mjs.
const generalBooking = Object.freeze({
  badge: { top: 'Grand opening', price: '$49', bottom: 'Labs + first visit' },
  callLabel: `Call ${clinicPhone.display}`,
  hoursLine: 'Wed–Fri 11 a.m.–5 p.m. · Sat 9 a.m.–1 p.m.',
  addressLine: clinicAddress,
  stepsHeading: 'How it works',
  steps: [
    'Book online in about a minute.',
    'Come in for your first visit and labs.',
    'Review your results and next steps with our care team.'
  ],
  careHeading: 'What we help with',
  // The four ad groups land here. Each card has an id so an ad can link straight to it (/founding-patients/#weight).
  care: [
    { id: 'weight', label: 'Medical weight loss', line: 'A plan built on your history and labs.', href: '/weight-management/' },
    { id: 'hormones', label: 'Men’s hormone health', line: 'Symptoms and testing reviewed before any plan.', href: '/mens-hormone-health/' },
    { id: 'midlife', label: 'Women’s midlife care', line: 'Support through perimenopause and menopause.', href: '/womens-midlife-care/' },
    { id: 'hair', label: 'Hair-loss care', line: 'Evaluation and care for hair loss and thinning.', href: '/hair-loss-care/' },
    { id: 'peptides', label: 'Peptide therapy', line: 'Recovery and hormone-support peptides, after a visit.', href: '/peptide-therapy/' }
  ],
  // Owner-supplied fine print for this page, word for word.
  finePrint:
    'The $49 covers your first visit and the labs. Labs as clinically appropriate. One per person. First 50 appointments scheduled. Additional testing or treatment is separate. Appointments subject to availability.',
  closedNote: `${clinicHours.closed} ${clinicHours.holiday.note}`
});

export const pages = Object.freeze({
  'hormone-care-merrillville': hormoneCareHubPage,
  'womens-hormone-replacement-therapy': womensHrtPage,
  ...peptidePages,
  'plan-your-visit': visitPlannerPage,
  merrillville: merrillvillePage,
  'visit-from-munster': nearbyVisitPages.munster,
  'visit-from-crown-point': nearbyVisitPages.crownPoint,
  'visit-from-schererville': nearbyVisitPages.schererville,
  home: {
    slug: '/',
    navLabel: 'Home',
    modified: '2026-11-23',
    title: 'Weight, Hormone, Hair-Loss & Peptide Care in Merrillville | Apex Wellness',
    description:
      `Weight, metabolic, hormone, hair-loss and peptide care in Merrillville, Indiana. Now open at 8550 Broadway, Suite B. Book online or call ${clinicPhone.display}.`,
    eyebrow: 'Now open · Merrillville, Northwest Indiana',
    h1: 'Weight, hormones, hair loss, peptides. Now open in Merrillville.',
    headlineLead: 'Weight, hormones, hair loss, peptides.',
    headlineEmphasis: 'Now open in Merrillville.',
    intro:
      'Apex Wellness offers weight and metabolic care, men’s hormone health, women’s midlife care, hair-loss care for thinning and balding, and peptide therapy. Now open at 8550 Broadway, Suite B.',
    cta: bookingPageCta,
    secondaryCta: {
      label: 'Explore care options',
      href: '/weight-management/'
    },
    ctaNote: 'Online booking is open.',
    editorial: {
      careHeading: 'Five ways in.\nOne standard of care.',
      careAside: 'Evaluated before treated.\nNo shortcuts, no templates.',
      approachHeading: 'Thoughtful care.\nBuilt around you.',
      approachBody: `We built this practice around careful evaluation, clear conversations, and individual goals. ${bookingStatus}`,
      processHeading: 'A simple first step.\nSpace to decide.',
      process: [
        { title: 'See the details.', body: 'Review the care areas, clinic hours and our Merrillville location. Ask questions before you decide.' },
        { title: 'Book when you are ready.', body: `${bookingStatus} Book online or call ${clinicPhone.display}.` }
      ]
    },
    sections: [
      {
        type: 'trustPoints',
        items: [
          'Individual goals from the start',
          'Focused areas of care, including peptides',
          'Individual evaluation before treatment',
          'Clear information before you book'
        ]
      },
      {
        type: 'cards',
        eyebrow: 'Five areas of care',
        heading: 'Five areas of care. One individualized approach.',
        cards: [
          {
            title: 'Weight & metabolic care',
            body:
              'Evaluation, meaningful measurements, nutrition and muscle-preservation support, and medication only when clinically indicated.',
            href: '/weight-management/'
          },
          {
            title: "Men’s hormone health",
            body:
              'A risk-aware evaluation of symptoms and appropriate testing, with treatment considered only after the full clinical picture is reviewed.',
            href: '/mens-hormone-health/'
          },
          {
            title: 'Women’s midlife care',
            body:
              'Individualized discussion of perimenopause, menopause, weight, sleep, and metabolic concerns, including hormonal and non-hormonal options.',
            href: '/womens-midlife-care/'
          },
          {
            title: 'Hair-loss care',
            body:
              'Clinical evaluation and treatment for hair-loss concerns, with individual care decisions and clear details before treatment.',
            href: '/hair-loss-care/'
          },
          {
            title: 'Peptide therapy',
            body:
              'Recovery and hormone-support peptides, prescribed only after an in-person visit and through a licensed compounding pharmacy.',
            href: '/peptide-therapy/'
          }
        ]
      },
      {
        type: 'linkCards',
        eyebrow: 'Looking for hormone care?',
        heading: 'Find the right starting page.',
        items: [{
          title: 'Hormone care in Merrillville',
          body: 'Compare the men’s hormone health and women’s midlife care paths, then book a first visit.',
          label: 'Explore hormone care',
          href: '/hormone-care-merrillville/'
        }, {
          title: 'Peptide therapy',
          body: 'Recovery, sleep and hormone-support peptides, prescribed only after an in-person visit.',
          label: 'Explore peptide therapy',
          href: '/peptide-therapy/'
        }]
      },
      {
        type: 'prelaunch',
        eyebrow: 'Book a first visit',
        heading: 'Your next step starts with clear information.',
        body:
          `${bookingStatus} Book online or call ${clinicPhone.display}.`,
        cta: bookingPageCta
      },
      {
        type: 'steps',
        eyebrow: 'From request to possible appointment',
        heading: 'Know what happens before you submit.',
        items: [
          {
            title: 'Send a contact request.',
            body: 'Your name, email and phone number. Keep medical details for your visit.'
          },
          {
            title: 'Review verified launch details.',
            body: 'Apex may email you when clinician availability, visit modality, pricing, policies, and consultation availability are confirmed.'
          },
          {
            title: 'Decide whether to schedule.',
            body: 'If an appropriate time is available, you can decide whether to book after reviewing the applicable details and terms.'
          },
          {
            title: 'Use the secure clinical process.',
            body: 'Clinical history and medical information will be collected only through the appropriate intake process after an appointment is confirmed.'
          }
        ]
      },
      {
        type: 'statement',
        eyebrow: 'Our approach',
        heading: 'The plan starts with the person, not a product.',
        body:
          'Apex uses a care model in which history, concerns, goals, risks, and appropriate testing are considered before a plan is written. Medication is discussed only when clinically appropriate, and outcomes are never guaranteed.'
      },
      {
        type: 'featureList',
        eyebrow: 'Why Apex',
        heading: 'What our approach means.',
        items: [
          'Care begins with an individual clinical evaluation and a plan appropriate to the person.',
          'Dosing, monitoring, and referral decisions rely on clinical judgment rather than an automatic protocol.',
          'The practice stays focused on four care areas with clear fees and exclusions.',
          'Progress is reviewed using symptoms, measurements, laboratory data when relevant, function, adherence, and side effects.',
          'When another clinician is the better destination, the plan is to say so clearly.'
        ]
      },
      {
        type: 'prelaunch',
        eyebrow: 'Opening in Northwest Indiana',
        heading: 'Review the real details before deciding whether to book.',
        body:
          `${clinicAddress}. Open since November 20, 2026.`,
        cta: bookingPageCta
      },
      {
        type: 'serviceArea',
        eyebrow: 'Region served',
        heading: 'Northwest Indiana',
        body:
          `At ${clinicAddress}, serving adults in Merrillville, Crown Point, Schererville, Munster, Dyer, St. John, Highland, Hobart, and surrounding Northwest Indiana communities.`
      }
    ]
  },

  'weight-management': {
    slug: '/weight-management/',
    modified: '2026-11-16',
    offerBand: true,
    navLabel: 'Weight & Metabolic',
    title: 'Medical Weight Loss in Merrillville, IN | Apex Wellness',
    description:
      'Explore medical weight loss and metabolic care at Apex Wellness in Merrillville, with in-person visits. Online booking is open.',
    eyebrow: 'Merrillville, Indiana · Weight & metabolic care',
    h1: 'Medical Weight Management in Merrillville, IN',
    intro:
      'Care starts with an evaluation of your history, goals and relevant measurements, then a plan built around you: nutrition, strength, and medication when clinically appropriate.',
    cta: bookingPageCta,
    sections: [
      {
        type: 'audience',
        heading: 'Who this care may fit',
        body:
          'Adults who want an evidence-informed plan that can include nutrition, protein and resistance-training support, appropriate measurements, careful medication consideration, side-effect review, plateau management, and maintenance planning.'
      },
      {
        type: 'detail',
        eyebrow: 'Evaluation',
        heading: 'A fuller picture before a plan.',
        body:
          'The intended evaluation covers relevant medical history and risks, goals, prior approaches, current medications, and factors that may affect weight or metabolic health. Findings and reasonable options, including no medication, are summarized before a treatment decision.'
      },
      {
        type: 'options',
        eyebrow: 'Possible plan elements',
        heading: 'More than medication fulfillment.',
        items: [
          {
            title: 'Nutrition and protein guidance',
            body: 'Practical targets that support health and muscle preservation.'
          },
          {
            title: 'Resistance-training support',
            body: 'A plan appropriate to the person’s current ability and goals.'
          },
          {
            title: 'Prescription medication, when appropriate',
            body: 'Candidacy, alternatives, titration, side effects, monitoring, and total cost are discussed before treatment.'
          },
          {
            title: 'Maintenance or discontinuation planning',
            body: 'The longer-term plan is considered before an intervention begins.'
          }
        ]
      },
      {
        type: 'faq',
        heading: 'Weight and metabolic care questions',
        items: [
          {
            question: 'Do I need labs before an evaluation?',
            answer:
              'Bring recent results to your visit if you have them. Any additional testing should be based on the evaluation and clinical need.'
          },
          {
            question: 'Will medication be included in the clinical fee?',
            answer:
              'Pricing is being finalized. Published fees will explain whether medication, laboratory work or supplies are included in a package or billed separately.'
          },
          {
            question: 'What if medication is not right for me?',
            answer:
              'Medication is only one possible tool. A plan may focus on other interventions or recommend care from a different clinician.'
          }
        ]
      }
    ]
  },

  'mens-hormone-health': {
    slug: '/mens-hormone-health/',
    modified: '2026-11-16',
    offerBand: true,
    navLabel: "Men's Hormone Health",
    title: 'Testosterone & Hormone Evaluation in Merrillville | Apex Wellness',
    description:
      'Explore men’s hormone and testosterone evaluation at Apex Wellness in Merrillville. Treatment depends on an individual clinical evaluation.',
    eyebrow: 'Merrillville, Indiana · Men’s hormone health',
    h1: 'Men’s Hormone Health in Merrillville, IN',
    intro:
      'Symptoms, repeat testing when it matters, health risks, fertility goals and the alternatives all go into the plan. One lab number does not decide it.',
    cta: bookingPageCta,
    sections: [
      {
        type: 'linkCards',
        eyebrow: 'From the Apex blog',
        heading: 'A November introduction to men’s health.',
        items: [{
          title: 'The mustache is optional',
          body: 'Read how Apex introduces its men’s health conversations in Merrillville.',
          label: 'Read the Movember article',
          href: '/blog/movember-mens-health-merrillville/'
        }]
      },
      {
        type: 'audience',
        heading: 'Who this care may fit',
        body:
          'Men with symptoms or findings that merit a thoughtful evaluation and who want to understand what the numbers may mean, what alternatives exist, and what responsible monitoring would involve.'
      },
      {
        type: 'detail',
        eyebrow: 'Evaluation',
        heading: 'Symptoms and risk reviewed together.',
        body:
          'The evaluation considers relevant medical history, sleep, cardiovascular and blood-pressure factors, fertility goals, current medications, symptoms, and prior results. Options may include no hormone treatment.'
      },
      {
        type: 'options',
        eyebrow: 'Possible plan elements',
        heading: 'Treatment alternatives considered on their merits.',
        items: [
          {
            title: 'Sleep, lifestyle, and metabolic factors',
            body: 'These may be part of the plan and, in some cases, the primary focus.'
          },
          {
            title: 'Testosterone therapy, when indicated',
            body: 'Potential benefits, limits, risks, routes, monitoring, and fertility considerations require discussion first.'
          },
          {
            title: 'Alternatives to testosterone',
            body: 'Other approaches may be considered when relevant, including when fertility matters.'
          },
          {
            title: 'Structured monitoring',
            body: 'The written plan should define visit and laboratory review based on the therapy and individual risk.'
          }
        ]
      },
      {
        type: 'faq',
        heading: "Men's hormone care questions",
        items: [
          {
            question: 'Will I receive testosterone at the first visit?',
            answer:
              'No treatment should be promised before an appropriate evaluation, necessary testing, risk review, and informed consent.'
          },
          {
            question: 'Will home administration be available?',
            answer:
              'Visits are in person. Medication fulfillment, administration pathways, training and supply details are still being finalized and will be published before care opens.'
          },
          {
            question: 'Does Apex use one “optimal” testosterone number?',
            answer:
              'No single number tells the whole story. Symptoms, appropriately timed and repeated results when needed, risks, goals, and alternative explanations should be considered together.'
          }
        ]
      }
    ]
  },

  'womens-midlife-care': {
    slug: '/womens-midlife-care/',
    modified: '2026-11-16',
    offerBand: true,
    navLabel: "Women's Midlife Care",
    title: 'Menopause & Midlife Care in Merrillville, IN | Apex Wellness',
    description:
      'Women’s midlife care is offered at Apex Wellness in Merrillville. Explore the care approach. Online booking is open.',
    eyebrow: 'Merrillville, Indiana · Women’s midlife care',
    h1: 'Women’s Midlife Care in Merrillville, IN',
    intro:
      'Care for perimenopause and menopause, built around your symptoms and goals. Hormonal and non-hormonal options are both on the table.',
    cta: bookingPageCta,
    sections: [
      {
        type: 'linkCards',
        eyebrow: 'From the Apex blog',
        heading: 'Why this care area is part of the Apex plan.',
        items: [{
          title: 'Women’s midlife care in Merrillville',
          body: 'Read the local introduction to this area of care and the clinic being prepared on Broadway.',
          label: 'Read the introduction',
          href: '/blog/womens-midlife-care-merrillville-conversation/'
        }]
      },
      {
        type: 'linkCards',
        eyebrow: 'Explore hormone therapy',
        heading: 'Could HRT be part of your plan?',
        items: [{
          title: 'Women’s hormone replacement therapy',
          body: 'Review symptoms, potential benefits, treatment options and common questions about HRT.',
          label: 'Explore women’s HRT',
          href: '/womens-hormone-replacement-therapy/'
        }]
      },
      {
        type: 'audience',
        heading: 'Who this care may fit',
        body:
          'Women with perimenopause, menopause, weight, sleep, metabolic, or related midlife concerns who want an individualized risk assessment and a clear discussion of options.'
      },
      {
        type: 'detail',
        eyebrow: 'Evaluation',
        heading: 'Individual risk matters.',
        body:
          'The intended evaluation considers symptoms and goals alongside reproductive context when relevant, abnormal bleeding, cancer and clot history, cardiovascular and liver factors, sleep, metabolic health, current medications, and care already provided elsewhere.'
      },
      {
        type: 'options',
        eyebrow: 'Possible plan elements',
        heading: 'Benefits, risks, limits, and alternatives explained.',
        items: [
          {
            title: 'Hormone therapy, when appropriate',
            body: 'Route, formulation, anticipated benefit, risk, and monitoring are individualized.'
          },
          {
            title: 'Non-hormonal options',
            body: 'Alternatives may be considered when hormone therapy is not suitable or not preferred.'
          },
          {
            title: 'Weight and metabolic support',
            body: 'Nutrition, muscle preservation, activity, sleep, and medication only when clinically indicated.'
          },
          {
            title: 'Coordination with existing care',
            body: 'Primary care, gynecology, and other specialist care remain important when relevant.'
          }
        ]
      },
      {
        type: 'faq',
        heading: "Women's midlife care questions",
        items: [
          {
            question: 'Would Apex replace my primary care or OB/GYN clinician?',
            answer:
              'No. Ongoing primary and gynecologic care, screening, and specialist services remain important. Apex intends to coordinate or refer when those services are the appropriate destination.'
          },
          {
            question: 'Is hormone therapy required?',
            answer:
              'No. Hormonal and non-hormonal options may be discussed, and choosing no treatment is also a valid outcome of an evaluation.'
          },
          {
            question: 'Will pellet procedures be offered?',
            answer:
              'The treatment menu is being finalized and will be published before we open.'
          }
        ]
      }
    ]
  },

  'hair-loss-care': {
    slug: '/hair-loss-care/',
    modified: '2026-11-16',
    offerBand: true,
    navLabel: 'Hair-Loss Care',
    title: 'Hair-Loss Care in Merrillville & NWI | Apex Wellness',
    description:
      'Hair-loss care is coming to Apex Wellness in Merrillville, Northwest Indiana. Explore the service. Online booking is open.',
    eyebrow: 'Merrillville, Indiana · Hair-loss care',
    h1: 'Hair-Loss Care in Merrillville, IN',
    intro:
      'Clinical evaluation and treatment for adults with thinning hair or balding, with clear pricing before treatment.',
    cta: bookingPageCta,
    sections: [
      {
        type: 'detail',
        eyebrow: 'Our approach',
        heading: 'Start with your concerns and goals.',
        body:
          'Once care opens, an individual evaluation will guide the conversation about treatment and next steps. The plan will reflect your circumstances and the scope of care available at Apex.'
      },
      {
        type: 'faq',
        heading: 'Hair-loss care questions',
        items: [
          {
            question: 'Can I book hair-loss care now?',
            answer:
              `Yes. ${bookingStatus} You can also call ${clinicPhone.display}.`,
            bookOnline: true
          },
          {
            question: 'Which hair-loss treatments will Apex offer?',
            answer:
              'Hair-loss treatment is part of our care. Specific options and service details are being finalized; an individual evaluation will determine whether a treatment is appropriate.'
          },
          {
            question: 'Should I send photos or medical details through the website?',
            answer:
              'No. Website forms ask only for contact details. Medical information and photographs belong in a secure clinical intake process after an appointment is confirmed.'
          }
        ]
      }
    ]
  },

  'how-it-works': {
    slug: '/how-it-works/',
    modified: '2026-11-16',
    navLabel: 'How It Works',
    title: 'How Care Works | Apex Wellness',
    description:
      'See the four-step Apex Wellness process, from choosing a care area through evaluation, appropriate testing, and a written plan.',
    eyebrow: 'How it works',
    h1: 'Thoughtful care, from the first conversation.',
    intro:
      'An evaluation, appropriate testing, a written plan and follow-up, with costs explained up front.',
    cta: bookingPageCta,
    sections: [
      {
        type: 'linkCards',
        eyebrow: 'Why Apex is taking this approach',
        heading: 'Four connected areas of care.',
        items: [{
          title: 'Why these four areas?',
          body: 'Read the founder’s introduction to the areas Apex offers in Merrillville.',
          label: 'Read the Apex story',
          href: '/blog/why-four-areas-of-care/'
        }]
      },
      {
        type: 'steps',
        heading: 'The care journey',
        items: [
          {
            title: 'Choose your care area.',
            body:
              'Weight and metabolic care, men’s hormone health, women’s midlife care or hair loss. If you are not sure which, that is what the first visit is for.'
          },
          {
            title: 'Complete an evaluation.',
            body:
              'Clinical history will be collected through a secure intake process rather than the marketing form. Costs and reservation terms will be shown before payment.'
          },
          {
            title: 'Complete appropriate testing.',
            body:
              'Recent outside results may be considered. Additional labs or measurements should be ordered only when clinically useful, with separate costs disclosed in advance.'
          },
          {
            title: 'Review a written plan.',
            body:
              'The plan should explain findings, reasonable options including no treatment, total costs, follow-up, monitoring, and when referral is appropriate.'
          }
        ]
      }
    ]
  },

  pricing: {
    slug: '/pricing/',
    navLabel: 'Pricing',
    title: 'Pricing | Apex Wellness',
    description:
      'Learn how Apex Wellness plans to present cash-pay fees and which pricing details are still pending.',
    eyebrow: 'Pricing',
    h1: 'Clarity before commitment.',
    intro:
      'Apex plans to publish the evaluation fee, care-area fees, common outside costs, billing cadence, and cancellation terms together. Final amounts are still being confirmed, so no placeholder prices are displayed.',
    cta: bookingPageCta,
    sections: [
      {
        type: 'status',
        heading: 'Pricing is coming before we open.',
        body:
          'Apex is cash-pay. Fees will be posted here, with what is included spelled out.'
      },
      {
        type: 'pricingPrinciples',
        heading: 'What the published pricing will explain',
        items: [
          {
            title: 'Evaluation fee',
            body: 'The amount, what the evaluation includes, and whether any credit applies to later enrollment.'
          },
          {
            title: 'Clinical-care fee',
            body: 'The billing cadence, included follow-up, monitoring, and communications for each care area.'
          },
          {
            title: 'Separately billed items',
            body: 'Laboratory testing, medication, supplies, delivery, or outside services that are not included.'
          },
          {
            title: 'Representative early-care total',
            body: 'A practical estimate combining typical first-month or first-90-day costs, with clear limits and assumptions.'
          },
          {
            title: 'Payment and cancellation terms',
            body: 'When billing begins, how to cancel or reschedule, when refunds may apply, and what happens if treatment is not clinically appropriate.'
          }
        ]
      },
      {
        type: 'faq',
        heading: 'Pricing questions',
        items: [
          {
            question: 'Is Apex Wellness cash-pay?',
            answer:
              'The model is cash-pay. Final fees, payment methods, documentation, and any insurance-related information will be published on this page.'
          },
          {
            question: 'Are labs or medications included?',
            answer:
              'No inclusion should be assumed. The final pricing page will distinguish clinical fees from outside labs, medication, supplies, delivery, and other separate costs.'
          },
          {
            question: 'Can I pay or reserve an appointment now?',
            answer:
              `You can book a visit now. ${bookingStatus} You can also call ${clinicPhone.display}. This website does not take payment.`,
            bookOnline: true
          },
          {
            question: 'Can I cancel or receive a refund?',
            answer:
              'There is currently no paid service to cancel or refund. Final booking, cancellation, rescheduling, pause, and refund terms will be presented before any future payment.'
          }
        ]
      }
    ]
  },

  about: {
    slug: '/about/',
    navLabel: 'About',
    title: 'Meet the Team | Apex Wellness Northwest Indiana',
    description:
      'Meet founder Shahab Siddique, family nurse practitioner Shanon Mekola, and medical assistant Alexandria Auriemma of Apex Wellness in Merrillville.',
    eyebrow: 'The people behind Apex',
    h1: 'Meet the people behind Apex.',
    intro:
      'Get to know the founder, family nurse practitioner and medical assistant behind Apex Wellness in Merrillville.',
    cta: bookingPageCta,
    sections: [
      {
        type: 'teamProfiles',
        label: 'Meet the team',
        profiles: [
          {
            id: 'shahab-siddique',
            name: 'Shahab Siddique',
            context: 'Founder',
            headline: 'More years doing the things you love.',
            image: { file: 'shahab-siddique-warm-v1.webp', width: 1254, height: 1254 },
            paragraphs: [
              'Shahab grew up wrestling and remains an active weightlifter who enjoys Brazilian jiu-jitsu, Muay Thai, and boxing. His interest in wellness starts with a question that gets more relevant with every birthday: how do you keep doing the things you love as you get older?',
              'His professional background is in health technology and clinical workflows. His motivation for Apex is more personal: helping build a practice that takes long-term strength, function, and individual ambitions seriously.',
              'For Shahab, health is about more than a number on a scale. It is about another round on the mats, time under the bar, and staying engaged in a life that feels like yours.'
            ],
            aside: 'Birthdays can stay. Automatically retiring your favorite hobbies? Less appealing.'
          },
          {
            id: 'alexandria-auriemma',
            name: 'Alexandria Auriemma',
            context: 'Medical Assistant',
            headline: 'A warm welcome matters.',
            image: { file: 'alexandria-auriemma-warm-v2.webp', width: 1254, height: 1254 },
            paragraphs: [
              'Alexandria is Apex’s medical assistant. She brings more than 10 years of healthcare experience and says her priority is helping people feel comfortable, supported, and treated with kindness and respect.',
              'Away from work, she enjoys time with her family and her dog. Family is important to her, and she loves making memories with the people closest to her.'
            ],
            aside: 'Her dog has not submitted an application for a clinic badge.'
          },
          {
            id: 'shanon-mekola',
            name: 'Shanon Mekola',
            context: 'Family Nurse Practitioner',
            headline: 'Twenty-seven years of care, and counting.',
            image: { file: 'shanon-mekola-warm-v1.webp', width: 1254, height: 1254 },
            paragraphs: [
              'Shanon is Apex’s family nurse practitioner. Her nursing career began in 1999, and she has practiced as a family nurse practitioner since 2018.',
              'Outside of healthcare, she is a proud mom of four grown children and grandma to two grandchildren. She hits the gym at least four days a week and is passionate about animal rescue, from fostering to helping animals get the second chance they deserve.',
              'She and her husband love to travel, and when time permits, she will happily disappear into a good book.'
            ],
            aside: 'Four kids, two grandkids, four gym days a week and a rotating cast of foster animals. A busy clinic day does not scare her.'
          }
        ],
        note: 'Apex focuses on weight, metabolic, hormone and hair-loss care. Keep your primary care doctor; we work alongside them, not instead of them.'
      },
      {
        type: 'values',
        eyebrow: 'Our standards',
        heading: 'What should define the experience',
        items: [
          {
            title: 'Clarity',
            body: 'People should understand what happens, what it costs, and what comes next.'
          },
          {
            title: 'Credibility',
            body: 'Care should begin with evaluation and clinical judgment, not a guaranteed product.'
          },
          {
            title: 'Continuity',
            body: 'Support and clinical responsibility should continue after the evaluation or treatment decision.'
          },
          {
            title: 'Measurement',
            body: 'Progress should be assessed with relevant symptoms, measurements, laboratory data, function, adherence, and side effects.'
          },
          {
            title: 'Respect',
            body: 'The experience should be private, inclusive, nonjudgmental, and designed for adults with real schedules and responsibilities.'
          }
        ]
      }
    ]
  },

  faq: {
    slug: '/faq/',
    modified: '2026-11-16',
    navLabel: 'FAQ',
    title: 'Frequently Asked Questions | Apex Wellness',
    description:
      'Answers about Apex Wellness opening status, care, eligibility, costs, privacy, location, clinic hours, and online booking.',
    eyebrow: 'Frequently asked questions',
    h1: 'Questions, answered before you commit.',
    intro:
      'Get to know our care areas, location, and approach at Apex Wellness in Merrillville. Online booking is open.',
    cta: bookingPageCta,
    sections: [
      {
        type: 'faqGroup',
        heading: 'Opening and availability',
        items: [
          {
            question: 'Is Apex Wellness open?',
            answer:
              `Apex opened November 20, 2026. ${bookingStatus}`,
            bookOnline: true
          },
          {
            question: 'Where is Apex located?',
            answer:
              `${clinicAddress}. We opened November 20, 2026. ${clinicPhone.callOrText} ${clinicPhone.display}, or email hello@apexwellnessnwi.com. ${clinicHours.sentence} Ask us about parking when you book.`
          },
          {
            question: 'When can I book an appointment?',
            answer:
              `${bookingStatus} You can also call ${clinicPhone.display} to schedule.`,
            bookOnline: true
          },
          {
            question: 'Does sending a contact request reserve an appointment?',
            answer:
              `No. A contact request asks Apex to call or email you about arranging a visit. To reserve a time, book online or call ${clinicPhone.display}.`,
            bookOnline: true
          }
        ]
      },
      {
        type: 'faqGroup',
        heading: 'Care and eligibility',
        items: [
          {
            question: 'Will Apex offer hair-loss treatment?',
            answer:
              'Yes. Hair-loss care is part of our care, alongside weight and metabolic care, men’s hormone health, and women’s midlife care. Specific treatment options and fees are being finalized.'
          },
          {
            question: 'Does an evaluation guarantee treatment or a prescription?',
            answer:
              'No. Future treatment will require an appropriate evaluation, clinical eligibility, and informed consent. Another clinician or no treatment may be the right recommendation.'
          },
          {
            question: 'Who will provide care?',
            answer:
              'Care-team members, their roles and credentials will be published on this site.'
          },
          {
            question: 'Will Apex replace primary or specialist care?',
            answer:
              'No. Apex is intended as focused care within a defined scope and will not replace routine primary care, recommended screening, urgent or emergency care, or specialist services when those are appropriate.'
          },
          {
            question: 'Can I send medical information through the form?',
            answer:
              'Please don’t. The form asks for your name, email and phone number. Medical details belong in a secure clinical conversation, not in this signup.'
          }
        ]
      },
      {
        type: 'faqGroup',
        heading: 'Cost and logistics',
        items: [
          visitDetails.quickAnswers[1],
          {
            question: 'What will care cost?',
            answer:
              'Apex is cash-pay. Full pricing will be posted on the Pricing page.'
          },
          {
            question: 'Will Apex accept insurance?',
            answer:
              'The model is cash-pay. Final billing and documentation details will be published on the Pricing page.'
          },
          {
            question: 'Will labs and medications be included?',
            answer:
              'No inclusion should be assumed. Pricing will clearly separate clinical fees from laboratory testing, medication, supplies, delivery, and outside services.'
          },
          {
            question: 'How will clinical information and messages be handled?',
            answer:
              'Website forms collect contact details and a consent record. They are not clinical intake. Details about secure clinical intake, record handling, response times and patient communications will be published before care opens.'
          }
        ]
      },
      {
        type: 'notice',
        heading: 'Urgent or emergency needs',
        body: emergencyNotice
      }
    ]
  },

  // The printed-QR, ad and profile-link destination. Since November 16, 2026 it is a short booking page:
  // the offer, one Book online action, and nothing that competes with it. The route must not change.
  'founding-patients': {
    slug: '/founding-patients/',
    modified: '2026-11-16',
    navLabel: 'Book online',
    title: 'Book Online | $49 Grand Opening | Apex Wellness Merrillville',
    description:
      `Grand opening: promotional labs for $49. The $49 covers your first visit and the labs, for the first 50 appointments scheduled. Book online or call ${clinicPhone.display}.`,
    announcement: `Now open in Merrillville · ${bookingStatus}`,
    launchLabel: 'November 20, 2026',
    eyebrow: 'Grand opening · Now open · Merrillville',
    h1: 'Now booking first visits.',
    h1Accent: 'first visits.',
    // Offer line under the headline: the first sentence is set large, the second beside it.
    intro: '$49 for labs and your first visit. First 50 appointments only.',
    landing: true,
    booking: generalBooking,
    sections: []
  },

  ...bookingAdPages(generalBooking),

  privacy: {
    slug: '/privacy/',
    navLabel: 'Privacy Policy',
    title: 'Privacy Policy | Apex Wellness',
    description:
      'Read how the Apex Wellness website handles contact requests and optional Pexy website-question follow-ups.',
    eyebrow: 'Updated October 28, 2026',
    h1: 'Privacy Policy',
    intro:
      'This policy explains the limited information collected through the Apex Wellness website, its contact forms, and Pexy’s optional follow-up form. It may be updated as clinical services and secure patient systems are introduced.',
    cta: bookingPageCta,
    effectiveDate: 'October 28, 2026',
    sections: [
      {
        type: 'policySection',
        heading: 'Information we collect',
        paragraphs: [
          'The Launch List form asks for your name, email address and phone number. Its required email checkbox covers opening updates. A separate optional checkbox permits a manual call only to clarify your signup or share confirmed scheduling availability; leaving it unchecked does not prevent joining. It does not authorize text messages, automated calls or unrelated promotional calls. If you select website or accessibility support instead, the phone field is not required or submitted and Apex uses your name and email to respond. The separate Plan Your Visit form asks for your name, email and phone number so Apex can follow up about arranging a future visit. If Pexy cannot answer a general website question, its optional follow-up form asks for your name, email and a newly typed general question. Each request has its own purpose and consent; a Pexy follow-up does not subscribe you to marketing emails or text messages, reserve a visit, or start clinical intake. Please do not submit symptoms, diagnoses, medications, laboratory values, insurance information, or other sensitive medical details.',
          'For security, reliability, and consent records, the site may also record the submission time, consent version, source domain, browser or device information, and whether the submission passed anti-spam checks. The raw IP address is not retained. Only a one-way salted hash derived from it is retained for abuse prevention and rate limiting.',
          'Earlier priority-list records remain associated with the consent provided when they were submitted. They are not silently converted into consultation requests.'
        ]
      },
      {
        type: 'policySection',
        heading: 'How information is used',
        bullets: [
          'To record, review, and respond to your contact request.',
          'To send verified opening information and future consultation-availability information you requested.',
          'To answer a website or accessibility help request submitted through the form.',
          'To review and reply by email to a general website question you separately submit through Pexy’s follow-up form.',
          'To protect the form and website from abuse, fraud, spam, and security threats.',
          'To maintain a record of consent and honor unsubscribe or deletion requests where applicable.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Automated website guide',
        paragraphs: [
          'Pexy uses fixed informational answers within your browser. Questions typed to Pexy are not sent to Apex or an external AI service, and Pexy does not save the conversation. If Pexy cannot answer a general question, you may choose to type a new question, name, and email into its separate follow-up form. Only that form submission is sent to Apex for a reply; the original Pexy question is not automatically copied or sent. Do not enter personal health information in either place.',
          'A temporary session preference remembers if you dismiss the launch invitation. It does not contain your questions or contact details. The Launch List, visit-request, and Pexy follow-up forms record information only when you choose to submit them with the consent shown for that form.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Privacy-minimized site measurement',
        paragraphs: [
          'Apex counts page views, clicks to the Launch List, Plan Your Visit, phone or email actions, and whether a website form was viewed, started or successfully submitted. These counts are sent only to an Apex website endpoint and stored as daily totals. Reports may separate the specific website page, originating page for an action, broad device category, broad geographic region, referring website domain, and normalized UTM source, medium and campaign labels supplied in an Apex marketing link.',
          'The measurement does not set cookies, create visitor or session profiles, or store raw IP addresses, IP hashes, device identifiers, full URLs, query strings, exact locations, form values, Pexy questions, or the full referring-page address. Geographic reporting is limited to Indiana, elsewhere in the United States, outside the United States, or unknown. Referrer reporting keeps only the website domain. Form measurement records only the form category and funnel step, never what someone typed.',
          'Apex also uses the Google tag for Google Ads. It tells Apex whether a visit followed a click on one of its Google ads, and to do that it sends Google the address of the page viewed, sets an advertising cookie in your browser and shares standard browser details such as IP address. Ad personalization and remarketing are turned off, and Apex does not send Google what you type into any form. Google handles this information under its own privacy policy. You can block it with your browser’s privacy settings or an ad blocker and still use the whole site.',
          'Google Analytics, Meta Pixel, and other advertising tags are not installed on this website.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Sharing and service providers',
        paragraphs: [
          'Apex does not sell consultation-request information. Information may be handled by service providers that support website hosting, form delivery, email, security, or data storage, but only for those services and subject to applicable safeguards.',
          'Information may also be disclosed when reasonably necessary to comply with law, respond to valid legal process, protect rights or safety, or address suspected misuse. The marketing form is not intended to receive protected health information or create a clinical record.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Security and retention',
        paragraphs: [
          'Apex uses administrative, technical, and organizational safeguards intended to protect submitted information. No website, transmission, or storage method can be guaranteed completely secure.',
          'Consultation-request information, Pexy follow-up questions, earlier priority-list information, and related consent records are retained only as long as reasonably needed for their stated purposes, to honor communication preferences, resolve disputes, meet applicable obligations, and protect the service. Records are deleted or de-identified when no longer reasonably needed, subject to legal or security requirements.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Your choices',
        paragraphs: [
          `You may unsubscribe from marketing using the link in an email. You may also call ${clinicPhone.display} or email hello@apexwellnessnwi.com to request access, correction, or deletion of your website contact or Pexy follow-up information. Do not include medical details in that request.`,
          'Browser privacy controls may limit cookies or similar technologies. Essential security and form-protection functions may still be required for the site to operate.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Children and policy changes',
        paragraphs: [
          'The consultation-request pathway is intended for adults and is not knowingly directed to children. If information from a child is discovered, Apex will take reasonable steps to delete it.',
          'The effective date at the top identifies this version. Material changes will be reflected on this page before the updated policy applies to new submissions.'
        ]
      }
    ]
  },

  terms: {
    slug: '/terms/',
    navLabel: 'Terms of Use',
    title: 'Terms of Use | Apex Wellness',
    description:
      'Read the terms governing use of the Apex Wellness website and consultation-request form.',
    eyebrow: `Effective ${effectiveDate}`,
    h1: 'Terms of Use',
    intro:
      'These terms apply to the Apex Wellness website. The site currently provides general information, contact request forms and a link to a separate online booking page. The site itself does not provide payment, clinical intake, or medical care.',
    cta: bookingPageCta,
    effectiveDate,
    sections: [
      {
        type: 'policySection',
        heading: 'Educational information only',
        paragraphs: [
          'Website content is general educational information and is not medical advice, diagnosis, treatment, or a substitute for care from a qualified professional who knows your circumstances.',
          'Using the site, submitting a consultation request, or receiving an email does not create a clinician-patient relationship and does not guarantee an appointment, eligibility, treatment, prescription, or result.'
        ]
      },
      {
        type: 'policySection',
        heading: 'No urgent or emergency care',
        paragraphs: [emergencyNotice]
      },
      {
        type: 'policySection',
        heading: 'Website limitations',
        paragraphs: [
          'Descriptions of the practice, services, workflows, pricing structure, visit modalities, and availability may change before launch. Only information identified as finalized should be relied upon for a care or payment decision.',
          `Our location at ${clinicAddress}, clinic hours and an opening date are identified on the site. Online booking is open. Detailed clinical responsibilities, licensure information, legal practice details, contact channels, and pricing are still being finalized.`
        ]
      },
      {
        type: 'policySection',
        heading: 'Acceptable use',
        bullets: [
          'Provide accurate information when submitting the consultation-request form.',
          'Do not submit clinical, payment, insurance, or other sensitive information through the marketing form.',
          'Do not interfere with site operation, bypass security measures, submit spam, impersonate another person, or use the site unlawfully.',
          'Do not copy, modify, or exploit site content in a way that infringes intellectual-property or other rights.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Availability and third-party services',
        paragraphs: [
          'Apex may modify, suspend, or discontinue site features and cannot promise uninterrupted or error-free availability. Links or service-provider features may be governed by separate terms and privacy practices.',
          'To the extent permitted by applicable law, the site is provided as available without promises that all content is complete, current, or suitable for a particular medical or commercial decision.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Changes and questions',
        paragraphs: [
          'The effective date at the top identifies this version. Updated terms will be posted here before they govern new use of the site.',
          'For a website or policy question, email hello@apexwellnessnwi.com. Please keep medical information out of email.'
        ]
      }
    ]
  },

  'communications-consent': {
    slug: '/communications-consent/',
    navLabel: 'Communications Consent',
    title: 'Communications Consent | Apex Wellness',
    description:
      'Understand Apex Wellness consent for opening updates, visit requests, and replies to general Pexy website questions.',
    eyebrow: 'Updated October 26, 2026',
    h1: 'Communications Consent',
    intro:
      `Separate permissions apply to Launch List emails, optional manual Launch List calls, appointment follow-up and Pexy’s general-question follow-up. The Launch List requires a phone number, but Apex will not call from that signup unless the separate optional call box is checked. For website or accessibility support, call ${clinicPhone.display} or email hello@apexwellnessnwi.com. Pexy’s form requests an email for a reply to one general question. None of these forms authorizes text messages, automated calls or unrelated promotional calls.`,
    cta: bookingPageCta,
    effectiveDate: 'October 26, 2026',
    sections: [
      {
        type: 'policySection',
        heading: 'What you agree to receive',
        paragraphs: [
          'The required Launch List email checkbox asks permission for opening updates; you can unsubscribe from emails. A separate optional checkbox permits only a manual call to clarify your signup or share confirmed scheduling availability. Leaving that box unchecked does not prevent joining the list. Neither checkbox authorizes text messages, automated calls or unrelated promotional calls. The appointment follow-up checkbox separately asks permission for Apex to call or email you about arranging a future visit when availability is confirmed. Pexy’s follow-up checkbox asks permission for Apex to email you only about the general question you type into that form. Pexy does not send its earlier question or a transcript. These permissions are stored separately. A Pexy follow-up does not subscribe you to marketing messages, reserve a visit, or start clinical care.',
          'If you check the website or accessibility support option, Apex may email you to respond to that request; it will not treat that selection as a consultation-marketing request. Consultation-related messages may be informational and promotional. Messages are not medical advice, clinical messages, appointment confirmations, or emergency communications.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Consent is optional and revocable',
        paragraphs: [
          'Submitting any contact request is optional. Consent to marketing email is not a condition of receiving medical care or making a purchase, neither of which is currently available through the site.',
          'You may unsubscribe at any time using the link in an email. Apex may retain a limited suppression record so that the unsubscribe request continues to be honored.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Consent records',
        paragraphs: [
          'Apex may record the name, email address, phone number where requested, submission time, optional website-accessibility flag, consent language and version, source domain, and technical information reasonably needed to document the request and protect the form from abuse. Pexy follow-up records also include the newly typed general question you submit. The raw IP address is not retained. Only a one-way salted hash derived from it is retained for abuse prevention and rate limiting.',
          'Earlier priority-list consent remains limited to the purpose and language presented when that consent was collected; it is not reclassified as a consultation request.',
          'Consent records are protected and retained as described in the Privacy Policy.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Protect your privacy',
        paragraphs: [
          'Email may not be appropriate for sensitive clinical information. Do not reply with symptoms, diagnoses, medications, laboratory values, photographs, insurance details, or urgent concerns.',
          'Secure clinical communication methods and response expectations will be published before care opens. For a medical emergency, call 911 or go to the nearest emergency department.'
        ]
      }
    ]
  },

  accessibility: {
    slug: '/accessibility/',
    navLabel: 'Accessibility Statement',
    title: 'Accessibility Statement | Apex Wellness',
    description:
      'Read the Apex Wellness commitment to an accessible website and learn how to request accessibility assistance.',
    eyebrow: `Effective ${effectiveDate}`,
    h1: 'Accessibility Statement',
    intro:
      'Apex Wellness is working to make its website understandable and usable for people with a wide range of abilities, devices, browsers, and assistive technologies.',
    cta: bookingPageCta,
    effectiveDate,
    sections: [
      {
        type: 'policySection',
        heading: 'Our accessibility goal',
        paragraphs: [
          'The site is being developed with responsive layouts, keyboard navigation, visible focus, meaningful headings, readable contrast, descriptive alternatives for important images, and accessible form feedback.',
          'Apex aims to follow WCAG 2.2 Level AA as the website and future patient services evolve. Accessibility is an ongoing process, and some content or third-party features may not yet meet that goal.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Request help or report a barrier',
        paragraphs: [
          `Until a dedicated accessibility contact is published, call ${clinicPhone.display} or email hello@apexwellnessnwi.com. Do not add health details; Apex can request only the minimum additional information needed when responding.`,
          'Do not include medical or other sensitive information. Apex will use the email address you provide to respond and work toward a reasonable accessible alternative.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Representative imagery and plain-language content',
        paragraphs: [
          'Website photographs are representative imagery and do not identify Apex clinicians, patients, or facilities. Important information is intended to remain available in text rather than relying on an image alone.',
          `Our location is ${clinicAddress}. Parking, physical-access details, visit modality, and other accommodation information will be published here as they are confirmed. Please do not assume specific access features are available until those details are confirmed.`
        ]
      },
      {
        type: 'policySection',
        heading: 'Feedback and updates',
        paragraphs: [
          'Accessibility feedback helps prioritize corrections. The effective date at the top identifies this version, and the statement will be updated as material improvements or contact channels change.'
        ]
      }
    ]
  },

  'cancellation-refunds': {
    slug: '/cancellation-refunds/',
    navLabel: 'Cancellation and Refunds',
    title: 'Cancellation and Refunds | Apex Wellness',
    description:
      'Read the Apex Wellness cancellation and refund status, and how to change a visit booked online.',
    eyebrow: `Effective ${effectiveDate}`,
    h1: 'Cancellation and Refunds',
    intro:
      `Online booking is open. This website does not accept enrollment or payment, so there is presently no payment made through it to refund. To change or cancel a visit you booked, call ${clinicPhone.display}.`,
    cta: bookingPageCta,
    effectiveDate,
    sections: [
      {
        type: 'policySection',
        heading: 'Pre-opening consultation requests',
        paragraphs: [
          'A consultation request is not an appointment, reservation, membership, deposit, or promise of treatment.',
          'You may unsubscribe from email using the link in any message. You may request deletion of your website contact information as described in the Privacy Policy.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Terms before future payment',
        paragraphs: [
          'Before Apex accepts any payment, the applicable price, services included and excluded, billing cadence, rescheduling deadline, late-cancellation or missed-visit rule, pause and termination process, refund eligibility, and any evaluation-fee credit will be shown in plain language.',
          'You will have an opportunity to review and accept those terms before completing payment. Terms may differ by service and will not be applied retroactively to a website contact request.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Clinical eligibility',
        paragraphs: [
          'Future payment for an evaluation will not guarantee treatment, a prescription, or a particular outcome. The terms shown before payment will explain what is delivered when treatment is not clinically appropriate and whether any credit or refund applies.',
          'Medication, laboratory, pharmacy, shipping, or third-party refund terms may be separate and will be identified before purchase when applicable.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Questions',
        paragraphs: [
          'For a billing or policy question, email hello@apexwellnessnwi.com. Do not send payment details or medical information by email.'
        ]
      }
    ]
  },

  blog: {
    slug: '/blog/',
    navLabel: 'Blog',
    title: 'Weight, Hormones & Hair Loss Articles | Apex Wellness NWI',
    description:
      'Clear, source-backed articles on weight, metabolic health, hormones, hair loss and staying active from Apex Wellness in Merrillville, Indiana.',
    eyebrow: 'Apex Wellness field notes',
    h1: 'Health has enough fine print.',
    intro:
      'We read past the bold claims and ask the useful questions about weight, hormones, hair loss and staying active. Straight answers from a practice in Northwest Indiana, with sources you can check.',
    cta: bookingPageCta,
    kind: 'blogIndex',
    modified: '2026-09-25',
    sections: []
  }
});

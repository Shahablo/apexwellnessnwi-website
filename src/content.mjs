import { merrillvillePage, visitDetails } from './visit-details.mjs';
import { visitPlannerPage } from './visit-planner.mjs';

const priorityListCta = Object.freeze({
  label: 'Join the Launch List',
  href: '/founding-patients/'
});

const effectiveDate = 'September 12, 2026';

const clinicAddress = '8550 Broadway, Suite B, Merrillville, IN 46410';

const emergencyNotice =
  'Apex Wellness does not provide urgent or emergency care. If you are experiencing a medical emergency, call 911 or go to the nearest emergency department.';

const prelaunchNotice =
  'Apex Wellness is coming soon to Merrillville. Find launch updates at apexwellnessnwi.com.';

export const site = Object.freeze({
  name: 'Apex Wellness',
  canonicalUrl: 'https://apexwellnessnwi.com',
  region: 'Northwest Indiana',
  address: { streetAddress: '8550 Broadway, Suite B', addressLocality: 'Merrillville', addressRegion: 'IN', postalCode: '46410', addressCountry: 'US', label: clinicAddress },
  status: 'Prelaunch',
  email: 'hello@apexwellnessnwi.com',
  phone: '(219) 207-2456',
  phoneHref: 'tel:+12192072456',
  tagline: 'Thoughtful care. Built around you.',
  contentUpdated: '2026-10-23',
  launch: { date: '2026-11-16', label: 'November 16, 2026', status: 'Planned launch' },
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/apexwellnessnwi/' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593954582564' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/apex-wellness-nwi/' },
    { label: 'NWI wellness community', href: 'https://www.facebook.com/groups/1778107663214102/' }
  ],
  description:
    'Apex Wellness is preparing weight, metabolic, hormone, and hair-loss care for adults in Northwest Indiana.',
  announcement:
    'Planned launch: November 16, 2026 · Northwest Indiana.',
  cta: priorityListCta,
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Weight & Metabolic', href: '/weight-management/', section: 'care' },
    { label: "Men's Hormone Health", href: '/mens-hormone-health/', section: 'care' },
    { label: "Women's Midlife Care", href: '/womens-midlife-care/', section: 'care' },
    { label: 'Hair-Loss Care', href: '/hair-loss-care/', section: 'care' },
    { label: 'How It Works', href: '/how-it-works/' },
    { label: 'Plan Your Visit', href: '/plan-your-visit/' },
    { label: 'Pricing', href: '/pricing/' },
    { label: 'Location', href: '/merrillville/' },
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
      'Final fees will be published before scheduling or payment becomes available. Clinical eligibility and informed consent are required before any treatment.'
  },
  footer: {
    summary:
      'Weight, metabolic, hormone, and hair-loss care for adults in Northwest Indiana.',
    location:
      `Coming soon to ${clinicAddress}.`,
    copyright: '© 2026 Apex Wellness.'
  }
});

export const pages = Object.freeze({
  'plan-your-visit': visitPlannerPage,
  merrillville: merrillvillePage,
  home: {
    slug: '/',
    navLabel: 'Home',
    modified: '2026-10-25',
    title: 'Weight, Hormone & Hair-Loss Care in Merrillville | Apex Wellness',
    description:
      'Weight, metabolic, hormone, and hair-loss care in Northwest Indiana. Coming soon to Merrillville. Join the Launch List for opening updates.',
    eyebrow: 'Planned launch · November 16, 2026 · Northwest Indiana',
    h1: 'Weight, hormones, hair loss. Coming to Merrillville.',
    headlineLead: 'Weight, hormones, hair loss.',
    headlineEmphasis: 'Coming to Merrillville.',
    intro:
      'Apex Wellness is preparing to open with weight and metabolic care, men’s hormone health, women’s midlife care, and hair-loss care for thinning and balding. Coming soon to 8550 Broadway, Suite B.',
    cta: priorityListCta,
    secondaryCta: {
      label: 'Explore care options',
      href: '/weight-management/'
    },
    ctaNote: 'Find launch updates at apexwellnessnwi.com',
    editorial: {
      careHeading: 'Four ways in.\nOne standard of care.',
      careAside: 'Evaluated before treated.\nNo shortcuts, no templates.',
      approachHeading: 'Thoughtful care.\nBuilt around you.',
      approachBody: 'We are building a practice around careful evaluation, clear conversations, and individual goals. Care-team details and appointment availability will be shared before scheduling opens.',
      processHeading: 'A simple first step.\nSpace to decide.',
      process: [
        { title: 'Stay in the know.', body: 'Join the Launch List with your name and email. That is all we ask for.' },
        { title: 'Get the details.', body: 'We email you the opening date, pricing and how to book, as each is ready.' },
        { title: 'Choose your next step.', body: 'Review the details, ask questions, and decide whether to request an available appointment when scheduling opens.' }
      ]
    },
    sections: [
      {
        type: 'trustPoints',
        items: [
          'Individual goals from the start',
          'Four focused areas of care',
          'Individual evaluation before treatment',
          'Clear information before you book'
        ]
      },
      {
        type: 'cards',
        eyebrow: 'Four areas of care',
        heading: 'Four areas of care. One individualized approach.',
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
              'Planned clinical evaluation and treatment for hair-loss concerns, with individual care decisions and clear details before treatment.',
            href: '/hair-loss-care/'
          }
        ]
      },
      {
        type: 'prelaunch',
        eyebrow: 'Stay in the know',
        heading: 'Your next step starts with clear information.',
        body:
          'Join the Launch List with your name and email for opening updates from Apex.',
        cta: priorityListCta
      },
      {
        type: 'steps',
        eyebrow: 'From request to possible appointment',
        heading: 'Know what happens before you submit.',
        items: [
          {
            title: 'Send a contact request.',
            body: 'Your name and email. Keep medical details for your visit.'
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
          'Apex is preparing a care model in which history, concerns, goals, risks, and appropriate testing are considered before a plan is written. Medication is discussed only when clinically appropriate, and outcomes are never guaranteed.'
      },
      {
        type: 'featureList',
        eyebrow: 'Why Apex',
        heading: 'What our planned approach means.',
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
          `Coming soon to ${clinicAddress}. Our planned launch is November 16, 2026, subject to readiness. Find launch updates at apexwellnessnwi.com.`,
        cta: priorityListCta
      },
      {
        type: 'serviceArea',
        eyebrow: 'Region served',
        heading: 'Northwest Indiana',
        body:
          `Coming soon to ${clinicAddress}, serving adults in Merrillville, Crown Point, Schererville, Munster, Dyer, St. John, Highland, Hobart, and surrounding Northwest Indiana communities.`
      }
    ]
  },

  'weight-management': {
    slug: '/weight-management/',
    modified: '2026-10-25',
    navLabel: 'Weight & Metabolic',
    title: 'Medical Weight Loss in Merrillville, IN | Apex Wellness',
    description:
      'Explore planned medical weight loss and metabolic care at Apex Wellness in Merrillville. Coming soon, with in-person visits and pricing before booking.',
    eyebrow: 'Coming soon to Merrillville · Weight & metabolic care',
    h1: 'Weight care, with the whole person in mind.',
    intro:
      'The care model begins with evaluation, risks, goals, and relevant measurements. Medication may be discussed when clinically indicated, but it is never the only lever and is never guaranteed.',
    cta: priorityListCta,
    sections: [
      {
        type: 'audience',
        heading: 'Who this care may fit',
        body:
          'Adults who want an evidence-informed plan that can include nutrition, protein and resistance-training support, appropriate measurements, careful medication consideration, side-effect review, plateau management, and maintenance planning.',
        note:
          'If you are looking for a specific prescription without an evaluation, this is not the right fit. Everything here starts with a clinical evaluation.'
      },
      {
        type: 'detail',
        eyebrow: 'Evaluation',
        heading: 'A fuller picture before a plan.',
        body:
          'The intended evaluation covers relevant medical history and risks, goals, prior approaches, current medications, and factors that may affect weight or metabolic health. Findings and reasonable options, including no medication, are summarized before a treatment decision.'
      },
      {
        type: 'detail',
        eyebrow: 'Testing and measurement',
        heading: 'Ordered only when clinically useful.',
        body:
          'Depending on your history, your clinician may look at metabolic and cardiovascular markers, body composition and any recent outside results. Testing is ordered when it changes the plan, and its cost is shown separately.'
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
        ],
        note:
          'Whether medication makes sense is a decision you and your clinician make together. Compounded and FDA-approved products are different things, and we will talk through the difference before anything is prescribed.'
      },
      {
        type: 'followUp',
        heading: 'Follow-up is part of responsible care.',
        body:
          'If care begins after launch, the written plan will define follow-up, relevant measurements, side-effect escalation, dose review when indicated, and criteria for maintaining, changing, stopping, or referring care.'
      },
      {
        type: 'referral',
        heading: 'When another clinician is the right destination',
        body:
          'Apex may recommend primary care, endocrinology, cardiology, bariatric medicine or surgery, nutrition services, or another specialty when findings fall outside the practice scope or a different service is more appropriate.'
      },
      {
        type: 'faq',
        heading: 'Weight and metabolic care questions',
        items: [
          {
            question: 'Do I need labs before an evaluation?',
            answer:
              'Bring recent results once scheduling opens if you have them. Any additional testing should be based on the evaluation and clinical need.'
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
    modified: '2026-10-25',
    navLabel: "Men's Hormone Health",
    title: 'Testosterone & Hormone Evaluation in Merrillville | Apex Wellness',
    description:
      'Explore planned men’s hormone and testosterone evaluation at Apex Wellness in Merrillville. Coming soon; treatment depends on an individual clinical evaluation.',
    eyebrow: 'Coming soon to Merrillville · Men’s hormone health',
    h1: 'A fuller picture of your hormone health.',
    intro:
      'Symptoms, repeat testing when it matters, health risks, fertility goals and the alternatives all go into the plan. One lab number does not decide it.',
    cta: priorityListCta,
    sections: [
      {
        type: 'audience',
        heading: 'Who this care may fit',
        body:
          'Men with symptoms or findings that merit a thoughtful evaluation and who want to understand what the numbers may mean, what alternatives exist, and what responsible monitoring would involve.',
        note:
          'If you want a prescription without an evaluation, this is not the place. If you want to know what is going on, it is.'
      },
      {
        type: 'detail',
        eyebrow: 'Evaluation',
        heading: 'Symptoms and risk reviewed together.',
        body:
          'The evaluation considers relevant medical history, sleep, cardiovascular and blood-pressure factors, fertility goals, current medications, symptoms, and prior results. Options may include no hormone treatment.'
      },
      {
        type: 'detail',
        eyebrow: 'Testing',
        heading: 'No diagnosis from one number.',
        body:
          'Appropriate testing may include repeat morning hormone measurements and other safety or explanatory markers based on history. Exact tests vary, and outside laboratory costs will be disclosed separately.'
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
        ],
        note:
          'Not every symptom is a hormone problem, and we will tell you when it is not.'
      },
      {
        type: 'followUp',
        heading: 'Monitoring continues after a treatment decision.',
        body:
          'If treatment is clinically appropriate after launch, follow-up will address response, adverse effects, relevant safety markers, dosing decisions, adherence, and whether treatment should continue.'
      },
      {
        type: 'referral',
        heading: 'When another clinician is the right destination',
        body:
          'Findings involving fertility, pituitary or testicular conditions, cardiovascular or blood concerns, cancer screening, or another issue outside the practice scope may require primary care or specialist evaluation.'
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
              'Visits are planned to be in person at launch. Medication fulfillment, administration pathways, training and supply details are still being finalized and will be published before care opens.'
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
    modified: '2026-10-25',
    navLabel: "Women's Midlife Care",
    title: 'Menopause & Midlife Care in Merrillville, IN | Apex Wellness',
    description:
      'Learn about the individualized approach to perimenopause, menopause, weight, sleep, and metabolic concerns at Apex Wellness.',
    eyebrow: 'Coming soon to Merrillville · Women’s midlife care',
    h1: 'Midlife care, built around your next chapter.',
    intro:
      'The approach is individualized rather than built around a generic “hormone balancing” promise. Hormonal and non-hormonal options may be discussed, and coordination or referral remains part of good care.',
    cta: priorityListCta,
    sections: [
      {
        type: 'audience',
        heading: 'Who this care may fit',
        body:
          'Women with perimenopause, menopause, weight, sleep, metabolic, or related midlife concerns who want an individualized risk assessment and a clear discussion of options.',
        note:
          'Apex will not replace routine primary care, gynecologic care, recommended screening, urgent care, or emergency care.'
      },
      {
        type: 'detail',
        eyebrow: 'Evaluation',
        heading: 'Individual risk matters.',
        body:
          'The intended evaluation considers symptoms and goals alongside reproductive context when relevant, abnormal bleeding, cancer and clot history, cardiovascular and liver factors, sleep, metabolic health, current medications, and care already provided elsewhere.'
      },
      {
        type: 'detail',
        eyebrow: 'Testing',
        heading: 'Individualized, not automatic.',
        body:
          'Laboratory testing is not always necessary to recognize perimenopause or menopause. Metabolic, thyroid, lipid, or other testing may be considered based on history, and appropriate outside results may reduce duplicate testing.'
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
        ],
        note:
          'Hormone therapy is right for some people and not others. We will be straight with you about which.'
      },
      {
        type: 'followUp',
        heading: 'The plan includes reassessment.',
        body:
          'If care begins after launch, follow-up should address response, side effects, relevant monitoring, new risk information, and whether the current approach should continue, change, stop, or be referred.'
      },
      {
        type: 'referral',
        heading: 'When another clinician is the right destination',
        body:
          'Abnormal bleeding, pregnancy, findings that may need gynecologic or oncologic evaluation, complex cardiovascular or clotting concerns, or another condition outside the practice scope may require prompt coordination or referral.'
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
    modified: '2026-10-25',
    navLabel: 'Hair-Loss Care',
    title: 'Hair-Loss Care in Merrillville & NWI | Apex Wellness',
    description:
      'Hair-loss care is coming to Apex Wellness in Merrillville, Northwest Indiana. Explore the planned service and join the Launch List.',
    eyebrow: 'Coming soon to Merrillville · Hair-loss care',
    h1: 'Hair-loss concerns deserve a thoughtful conversation.',
    intro:
      'Apex is preparing to offer clinical evaluation and treatment for adults with hair-loss concerns. Individual care decisions come first, with service details and pricing available before scheduling opens.',
    cta: priorityListCta,
    sections: [
      {
        type: 'detail',
        eyebrow: 'Our approach',
        heading: 'Start with your concerns and goals.',
        body:
          'Once care opens, an individual evaluation will guide the conversation about treatment and next steps. The plan will reflect your circumstances and the scope of care available at Apex.'
      },
      {
        type: 'detail',
        eyebrow: 'Before treatment',
        heading: 'Clear information before you decide.',
        body:
          'Treatment options, costs and follow-up are being finalized. Every plan starts with an evaluation, and we will be honest about what each option can and cannot do.'
      },
      {
        type: 'faq',
        heading: 'Hair-loss care questions',
        items: [
          {
            question: 'Can I book hair-loss care now?',
            answer:
              'Not yet. Hair-loss care is planned for opening, but scheduling is not available. Join the Launch List for updates.'
          },
          {
            question: 'Which hair-loss treatments will Apex offer?',
            answer:
              'Hair-loss treatment is part of the planned care offering. Specific options and service details will be published before scheduling opens; an individual evaluation will determine whether a treatment is appropriate.'
          },
          {
            question: 'Should I send photos or medical details through the launch form?',
            answer:
              'No. The Launch List collects your name and email for opening updates. Medical information and photographs belong in a secure clinical intake process after an appointment is confirmed.'
          }
        ]
      }
    ]
  },

  'how-it-works': {
    slug: '/how-it-works/',
    navLabel: 'How It Works',
    title: 'How Care Is Planned to Work | Apex Wellness',
    description:
      'See the four-step Apex Wellness process, from choosing a care area through evaluation, appropriate testing, and a written plan.',
    eyebrow: 'How it works',
    h1: 'Thoughtful care, from the first conversation.',
    intro:
      'Apex is preparing a process in which evaluation, appropriate testing, clinical options, full costs, and follow-up expectations are reviewed before treatment begins.',
    cta: priorityListCta,
    sections: [
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
              'After scheduling opens, clinical history will be collected through a secure intake process rather than the marketing form. Costs and reservation terms will be shown before payment.'
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
      },
      {
        type: 'featureList',
        eyebrow: 'After the evaluation',
        heading: 'Follow-through is part of the care model.',
        items: [
          'Results, side effects, refills, and dose changes are reviewed within the clinical process rather than handled by an automatic threshold.',
          'Visits and relevant testing follow a cadence defined in the written plan.',
          'Progress may be assessed with symptoms, measurements, laboratory data when relevant, function, adherence, and side effects.',
          'Interventions may be introduced deliberately, with maintenance or discontinuation considered in advance.',
          'Questions outside the approved practice scope are referred to an appropriate clinician.'
        ]
      },
      {
        type: 'prelaunch',
        heading: 'What is available today',
        body:
          'Apex is coming soon to Merrillville. Join the Launch List for opening updates and details about getting started.',
        cta: priorityListCta
      }
    ]
  },

  pricing: {
    slug: '/pricing/',
    navLabel: 'Pricing',
    title: 'Pricing and Prelaunch Status | Apex Wellness',
    description:
      'Learn how Apex Wellness plans to present cash-pay fees and what pricing details remain pending before appointments open.',
    eyebrow: 'Pricing',
    h1: 'Clarity before commitment.',
    intro:
      'Apex plans to publish the evaluation fee, care-area fees, common outside costs, billing cadence, and cancellation terms together. Final amounts are still being confirmed, so no placeholder prices are displayed.',
    cta: priorityListCta,
    sections: [
      {
        type: 'status',
        heading: 'Pricing is coming before we open.',
        body:
          'Apex is cash-pay. Fees will be posted here before scheduling opens, with what is included spelled out. Joining the Launch List is free.'
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
        type: 'notice',
        heading: 'Payment will not guarantee treatment.',
        body:
          'When payment becomes available, treatment will still require appropriate evaluation, clinical eligibility, and informed consent. A prescription will never be promised in exchange for a fee.'
      },
      {
        type: 'faq',
        heading: 'Pricing questions',
        items: [
          {
            question: 'Is Apex Wellness cash-pay?',
            answer:
              'The planned model is cash-pay. Final fees, payment methods, documentation, and any insurance-related information will be published before scheduling opens.'
          },
          {
            question: 'Are labs or medications included?',
            answer:
              'No inclusion should be assumed during prelaunch. The final pricing page will distinguish clinical fees from outside labs, medication, supplies, delivery, and other separate costs.'
          },
          {
            question: 'Can I pay or reserve an appointment now?',
            answer:
              'Not yet. Join the Launch List and we will email you when scheduling is confirmed.'
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
      'Meet founder Shahab Siddique and learn about the personal motivations behind Apex Wellness in Northwest Indiana.',
    eyebrow: 'The people behind Apex',
    h1: 'A personal reason to build Apex.',
    intro:
      'Staying strong, capable, and involved in the things we love. Our reasons for building Apex are personal—and your reasons for seeking care should matter just as much.',
    cta: priorityListCta,
    sections: [
      {
        type: 'teamProfiles',
        eyebrow: 'Meet the team',
        heading: 'People first. In the practice, too.',
        intro: 'A personal interest in staying active raised a question: how can thoughtful care support the life someone wants to keep living? You do not need to be an athlete to belong here. Your goals set the context.',
        profiles: [
          {
            id: 'shahab-siddique',
            name: 'Shahab Siddique',
            context: 'Health technology · A personal reason to build Apex',
            headline: 'More years doing the things you love.',
            image: { file: 'shahab-siddique-warm-v1.webp', width: 1254, height: 1254 },
            paragraphs: [
              'Shahab grew up wrestling and remains an active weightlifter who enjoys Brazilian jiu-jitsu, Muay Thai, and boxing. His interest in wellness starts with a question that gets more relevant with every birthday: how do you keep doing the things you love as you get older?',
              'His professional background is in health technology and clinical workflows. His motivation for Apex is more personal: helping build a practice that takes long-term strength, function, and individual ambitions seriously.',
              'For Shahab, health is about more than a number on a scale. It is about another round on the mats, time under the bar, and staying engaged in a life that feels like yours.'
            ],
            aside: 'Birthdays can stay. Automatically retiring your favorite hobbies? Less appealing.'
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
      },
      {
        type: 'verificationStatus',
        eyebrow: 'Location and access',
        heading: 'Operational details are still being finalized.',
        body:
          `Find us at ${clinicAddress}. Coming soon. Find launch updates at apexwellnessnwi.com.`
      },
      {
        type: 'notice',
        eyebrow: 'Photography',
        heading: 'Real people. Clearly labeled photography.',
        body: 'The portrait on this page is founder Shahab Siddique. Other photographs on the site are illustrative.'
      }
    ]
  },

  faq: {
    slug: '/faq/',
    modified: '2026-10-25',
    navLabel: 'FAQ',
    title: 'Frequently Asked Questions | Apex Wellness',
    description:
      'Answers about Apex Wellness prelaunch status, planned care, eligibility, costs, privacy, location, and appointment availability.',
    eyebrow: 'Frequently asked questions',
    h1: 'Questions, answered before you commit.',
    intro:
      'Get to know our care areas, location, and approach. Coming soon to Merrillville. Find launch updates at apexwellnessnwi.com.',
    cta: priorityListCta,
    sections: [
      {
        type: 'faqGroup',
        heading: 'Prelaunch and availability',
        items: [
          {
            question: 'Is Apex Wellness open?',
            answer:
              'Coming soon. Find launch updates at apexwellnessnwi.com or join the Launch List to hear from us by email.'
          },
          {
            question: 'Where is Apex located?',
            answer:
              `${clinicAddress}. We are preparing to open. Call or text (219) 207-2456, or email hello@apexwellnessnwi.com. Hours and parking details will be posted before we open.`
          },
          {
            question: 'When will appointments open?',
            answer:
              'November 16, 2026 is our planned launch, subject to readiness. We will announce scheduling when it is confirmed. Join the Launch List for updates.'
          },
          {
            question: 'Does submitting a consultation request reserve an appointment?',
            answer:
              'No. It puts you on the list for opening updates and first access to booking. It is free.'
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
              'Yes. Hair-loss care is part of the planned offering, alongside weight and metabolic care, men’s hormone health, and women’s midlife care. Coming soon; specific treatment options and fees will be published before scheduling opens.'
          },
          {
            question: 'Does an evaluation guarantee treatment or a prescription?',
            answer:
              'No. Future treatment will require an appropriate evaluation, clinical eligibility, and informed consent. Another clinician or no treatment may be the right recommendation.'
          },
          {
            question: 'Who will provide care?',
            answer:
              'Care-team members, their roles and credentials, and appointment availability will be published before scheduling opens.'
          },
          {
            question: 'Will Apex replace primary or specialist care?',
            answer:
              'No. Apex is intended as focused care within a defined scope and will not replace routine primary care, recommended screening, urgent or emergency care, or specialist services when those are appropriate.'
          },
          {
            question: 'Can I send medical information through the form?',
            answer:
              'Please don’t. The form is just for your name and email. Medical details belong in your visit, where they are private.'
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
              'Apex is cash-pay. Full pricing will be posted before scheduling opens.'
          },
          {
            question: 'Will Apex accept insurance?',
            answer:
              'The planned model is cash-pay. Final billing and documentation details will be published before appointments become available.'
          },
          {
            question: 'Will labs and medications be included?',
            answer:
              'No inclusion should be assumed during prelaunch. Future pricing will clearly separate clinical fees from laboratory testing, medication, supplies, delivery, and outside services.'
          },
          {
            question: 'How will clinical information and messages be handled?',
            answer:
              'The pre-opening form collects only a name, email address, consent record, and an optional website-accessibility flag. Details about secure clinical intake, record handling, response times, and patient communications will be published before care opens.'
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

  'founding-patients': {
    slug: '/founding-patients/',
    modified: '2026-10-25',
    navLabel: 'Launch List',
    title: 'Apex Wellness Launch List | Care Coming to Merrillville',
    description:
      'Join the Apex Wellness Launch List for opening updates and details of the first 100 assessments offer. Coming soon to Merrillville.',
    announcement: 'Coming soon to Merrillville · Thoughtful care',
    launchLabel: 'November 16, 2026 (planned; subject to readiness)',
    eyebrow: 'Apex Wellness · Northwest Indiana',
    h1: 'Merrillville, meet Apex.',
    intro:
      'We’re preparing to open with weight and metabolic care, men’s hormone health, women’s midlife care, and hair-loss care for thinning and balding. Join the list for opening and scheduling updates; signing up does not book a visit.',
    cta: {
      label: 'Join the Launch List',
      href: '#consultation-request'
    },
    offer: {
      eyebrow: 'First 100 assessments · After opening',
      heading: 'First 100 assessments, on us.',
      terms: 'For the first 100 initial wellness assessments after opening, selected baseline labs are included when clinically appropriate. One per person; no purchase required. Additional care or testing may cost extra. The Launch List is not a reservation.'
    },
    ctaNote: 'Free to join. No appointment booked. No commitment to care.',
    landing: true,
    visitPlanner: true,
    form: {
      action: '/api/founding-consultation',
      method: 'post',
      heading: 'Get opening updates.',
      submitLabel: 'Join the Launch List',
      consentVersion: 'launch-list-2026-09-21',
      consentLabel:
        'Email me opening updates from Apex Wellness. I can unsubscribe anytime, and I have read the Privacy Policy and Communications Consent.',
      accessibilityLabel: 'This is a website or accessibility question, not a Launch List signup.',
      privacyNote:
        'Join the Apex Launch List with your name and email. Save medical details for your visit.',
      successMessage:
        'You’re on the Apex Launch List. We’ll share opening news and let you know when clinical evaluations can be booked. No appointment has been booked.'
    },
    sections: [
      {
        type: 'trustPoints',
        items: [
          'Free to join',
          'Thoughtful care',
          'No commitment to care',
          'Merrillville · Northwest Indiana'
        ]
      },
      {
        type: 'detail',
        eyebrow: 'A thoughtful first step',
        heading: 'Your questions. A thoughtful conversation.',
        body:
          'Apex is preparing to bring weight, metabolic, hormone and hair-loss care to Merrillville. Joining the list lets you follow our opening plans and decide whether an evaluation is right for you.'
      },
      {
        type: 'cards',
        eyebrow: 'Care areas',
        heading: 'Explore whether Apex may fit what you are looking for.',
        cards: [
          {
            title: 'Weight & metabolic care',
            body: 'An individualized approach to evaluation, meaningful measurements, sustainable habits, and medication only when clinically indicated.',
            href: '/weight-management/'
          },
          {
            title: "Men’s hormone health",
            body: 'A risk-aware evaluation of symptoms and appropriate testing before any treatment decision.',
            href: '/mens-hormone-health/'
          },
          {
            title: "Women’s midlife care",
            body: 'An individualized discussion of perimenopause, menopause, weight, sleep, and metabolic concerns.',
            href: '/womens-midlife-care/'
          },
          {
            title: 'Hair-loss care',
            body: 'Clinical evaluation and treatment for thinning and balding, for men and women.',
            href: '/hair-loss-care/'
          }
        ]
      },
      {
        type: 'steps',
        eyebrow: 'What happens next',
        heading: 'Stay in the loop. Decide in your own time.',
        items: [
          {
            title: 'Join the list.',
            body: 'Leave your name and email, and choose to receive opening updates.'
          },
          {
            title: 'Get the details.',
            body: 'Watch for opening news, clinical-evaluation availability and details of the launch offer as plans are confirmed.'
          },
          {
            title: 'Book if it fits.',
            body: 'When scheduling opens, you can review the details and decide whether to book. Joining the list does not reserve an appointment.'
          }
        ]
      },
      {
        type: 'faq',
        heading: 'A few things to know.',
        items: [
          {
            question: 'Does this reserve an appointment?',
            answer: 'No. This is an email signup for opening news and notice when clinical evaluations can be booked. It does not reserve an appointment or guarantee treatment.'
          },
          {
            question: 'Does it cost anything?',
            answer: 'No. Joining the Launch List is free, and you can unsubscribe at any time.'
          },
          {
            question: 'How does the first 100 assessments offer work?',
            answer: 'After opening, the first 100 initial assessments will include the assessment and selected baseline labs at no charge when clinically appropriate. One offer per person; no purchase required. The clinician determines which tests, if any, are appropriate; additional testing or care may have a cost. Joining this email list does not book an assessment or reserve the offer. We will share scheduling and full terms when confirmed.'
          },
          {
            question: 'Should I include medical information?',
            answer: 'No. Just your name and email. Your history is for your visit.'
          },
          {
            question: 'When and where will Apex open?',
            answer: `We’re preparing to open at ${clinicAddress}. November 16, 2026 is the planned date, subject to readiness. We will announce clinical-evaluation availability when confirmed.`
          }
        ]
      }
    ]
  },

  privacy: {
    slug: '/privacy/',
    navLabel: 'Privacy Policy',
    title: 'Privacy Policy | Apex Wellness',
    description:
      'Read how the Apex Wellness prelaunch website handles contact requests and optional Pexy website-question follow-ups.',
    eyebrow: 'Updated October 26, 2026',
    h1: 'Privacy Policy',
    intro:
      'This prelaunch policy explains the limited information collected through the Apex Wellness website, its contact forms, and Pexy’s optional follow-up form. It may be updated as clinical services and secure patient systems are introduced.',
    cta: priorityListCta,
    effectiveDate: 'October 26, 2026',
    sections: [
      {
        type: 'policySection',
        heading: 'Information we collect',
        paragraphs: [
          'The Launch List form asks for your name and email address for opening updates. You may optionally identify the request as website or accessibility support. The separate Plan Your Visit form asks for your name, email and phone number so Apex can follow up about arranging a future visit. If Pexy cannot answer a general website question, its optional follow-up form asks for your name, email and a newly typed general question. Each request has its own purpose and consent; a Pexy follow-up does not subscribe you to marketing emails or text messages, reserve a visit, or start clinical intake. Please do not submit symptoms, diagnoses, medications, laboratory values, insurance information, or other sensitive medical details.',
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
          'You may unsubscribe from marketing using the link in an email. You may also use the Founding Patient form, check the website or accessibility support option, and request access, correction, or deletion of your prelaunch contact or Pexy follow-up information. Do not include medical details in that request.',
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
      'Read the terms governing use of the prelaunch Apex Wellness website and consultation-request form.',
    eyebrow: `Effective ${effectiveDate}`,
    h1: 'Terms of Use',
    intro:
      'These terms apply to the prelaunch Apex Wellness website. The site currently provides general information and a request for future consultation contact; it does not book appointments or provide payment, clinical intake, or medical care.',
    cta: priorityListCta,
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
        heading: 'Prelaunch limitations',
        paragraphs: [
          'Descriptions of the planned practice, services, workflows, pricing structure, visit modalities, and availability may change before launch. Only information identified as finalized at the time scheduling opens should be relied upon for a care or payment decision.',
          `Our location at ${clinicAddress} and a planned launch date are identified on the site. Detailed clinical responsibilities, licensure information, legal practice details, contact channels, hours, pricing, and appointment availability are still being finalized.`
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
      'These separate permissions apply to the Launch List, appointment follow-up form, and Pexy’s optional general-question follow-up form. The appointment form requests a phone number for a call about your request. Pexy’s form requests an email for a reply to one general question. Neither form enrolls you in marketing calls or text messages.',
    cta: priorityListCta,
    effectiveDate: 'October 26, 2026',
    sections: [
      {
        type: 'policySection',
        heading: 'What you agree to receive',
        paragraphs: [
          'The Launch List checkbox asks permission to send opening updates, with the option to unsubscribe. The appointment follow-up checkbox asks permission for Apex to call or email you about arranging a future visit when availability is confirmed. Pexy’s follow-up checkbox asks permission for Apex to email you only about the general question you type into that form. Pexy does not send its earlier question or a transcript. These permissions are stored separately. A Pexy follow-up does not subscribe you to marketing messages, reserve a visit, or start clinical care.',
          'If you check the website or accessibility support option, Apex may email you to respond to that request; it will not treat that selection as a consultation-marketing request. Consultation-related messages may be informational and promotional. Messages are not medical advice, clinical messages, appointment confirmations, or emergency communications.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Consent is optional and revocable',
        paragraphs: [
          'Submitting any contact request is optional. Consent to prelaunch email is not a condition of receiving medical care or making a purchase, neither of which is currently available through the site.',
          'You may unsubscribe at any time using the link in an email. Apex may retain a limited suppression record so that the unsubscribe request continues to be honored.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Consent records',
        paragraphs: [
          'Apex may record the email address, submission time, optional website-accessibility flag, consent language and version, source domain, and technical information reasonably needed to document the request and protect the form from abuse. Pexy follow-up records also include the name and newly typed general question you submit. The raw IP address is not retained. Only a one-way salted hash derived from it is retained for abuse prevention and rate limiting.',
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
      'Read the Apex Wellness commitment to an accessible website and learn how to request accessibility assistance during prelaunch.',
    eyebrow: `Effective ${effectiveDate}`,
    h1: 'Accessibility Statement',
    intro:
      'Apex Wellness is working to make its website understandable and usable for people with a wide range of abilities, devices, browsers, and assistive technologies.',
    cta: priorityListCta,
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
          'Until a dedicated accessibility contact is published, use the Founding Patient form and check the website or accessibility support option. Provide only your name and email through the form; Apex can request the minimum additional information needed when responding.',
          'Do not include medical or other sensitive information. Apex will use the email address you provide to respond and work toward a reasonable accessible alternative.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Representative imagery and plain-language content',
        paragraphs: [
          'Prelaunch photographs are representative imagery and do not identify Apex clinicians, patients, or facilities. Important information is intended to remain available in text rather than relying on an image alone.',
          `Our location is ${clinicAddress}. Parking, physical-access details, visit modality, and other accommodation information will be published before scheduling opens. Please do not assume specific access features are available until those details are confirmed.`
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
      'Read the Apex Wellness prelaunch cancellation and refund status before appointments or payments become available.',
    eyebrow: `Effective ${effectiveDate}`,
    h1: 'Cancellation and Refunds',
    intro:
      'Apex Wellness is in prelaunch and does not currently accept appointment reservations, enrollment, or payment. As a result, there is presently no paid service to cancel and no payment to refund.',
    cta: priorityListCta,
    effectiveDate,
    sections: [
      {
        type: 'policySection',
        heading: 'Pre-opening consultation requests',
        paragraphs: [
          'Submitting a Founding Patient consultation request is free. It is not an appointment, reservation, membership, deposit, or promise of treatment.',
          'You may unsubscribe from email using the link in any message. You may request deletion of your prelaunch contact information as described in the Privacy Policy.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Terms before future payment',
        paragraphs: [
          'Before Apex accepts any payment, the applicable price, services included and excluded, billing cadence, rescheduling deadline, late-cancellation or missed-visit rule, pause and termination process, refund eligibility, and any evaluation-fee credit will be shown in plain language.',
          'You will have an opportunity to review and accept those terms before completing payment. Terms may differ by service and will not be applied retroactively to a free prelaunch consultation request.'
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
          'For a billing or policy question during prelaunch, email hello@apexwellnessnwi.com. Do not send payment details or medical information by email.'
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
    cta: priorityListCta,
    kind: 'blogIndex',
    modified: '2026-09-25',
    sections: []
  }
});

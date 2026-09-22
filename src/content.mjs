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
  tagline: 'Physician-led care. Built around you.',
  contentUpdated: '2026-09-20',
  launch: { date: '2026-11-01', label: 'November 1, 2026', status: 'Planned launch' },
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/apexwellnessnwi/' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593954582564' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/apex-wellness-nwi/' },
    { label: 'NWI wellness community', href: 'https://www.facebook.com/groups/1778107663214102/' }
  ],
  description:
    'Apex Wellness is preparing physician-led weight, metabolic, hormone, and hair-loss care for adults in Northwest Indiana.',
  announcement:
    'Planned launch: November 1, 2026 · Northwest Indiana.',
  cta: priorityListCta,
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Weight & Metabolic', href: '/weight-management/', section: 'care' },
    { label: "Men's Hormone Health", href: '/mens-hormone-health/', section: 'care' },
    { label: "Women's Midlife Care", href: '/womens-midlife-care/', section: 'care' },
    { label: 'Hair-Loss Care', href: '/hair-loss-care/', section: 'care' },
    { label: 'How It Works', href: '/how-it-works/' },
    { label: 'Pricing', href: '/pricing/' },
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
      'Physician-led weight, metabolic, hormone, and hair-loss care for adults in Northwest Indiana.',
    location:
      `Coming soon to ${clinicAddress}.`,
    copyright: '© 2026 Apex Wellness.'
  }
});

export const pages = Object.freeze({
  home: {
    slug: '/',
    navLabel: 'Home',
    modified: '2026-09-22',
    title: 'Weight, Hormone & Hair-Loss Care in NWI | Apex Wellness',
    description:
      'Physician-led weight, metabolic, hormone, and hair-loss care in Northwest Indiana. Coming soon to Merrillville. Join the Launch List for opening updates.',
    eyebrow: 'Planned launch · November 1, 2026 · Northwest Indiana',
    h1: 'Medical expertise. Focused on your goals.',
    headlineLead: 'Medical expertise.',
    headlineEmphasis: 'Focused on your goals.',
    intro:
      'Thoughtful weight, metabolic, hormone, and hair-loss care for adults in Northwest Indiana. Led by Atif Muhammad, MD, Apex is preparing to open with an individualized approach, built around the person seeking care.',
    cta: priorityListCta,
    secondaryCta: {
      label: 'Explore care options',
      href: '/weight-management/'
    },
    ctaNote: 'Find launch updates at apexwellnessnwi.com',
    editorial: {
      careHeading: 'Four ways in.\nOne standard of care.',
      careAside: 'Evaluated before treated.\nNo shortcuts, no templates.',
      physicianHeading: 'Physician-led.\nPerson by person.',
      physicianBody: 'Atif Muhammad, MD, brings a physician’s perspective to Apex. We are building a practice around careful evaluation, clear conversations, and responsible treatment decisions.',
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
          'Physician-led from the start',
          'Four focused areas of care',
          'Individual evaluation before treatment',
          'Clear information before you book'
        ]
      },
      {
        type: 'cards',
        eyebrow: 'Four areas of care',
        heading: 'Four areas of care. One physician-led approach.',
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
              'Planned physician-led evaluation and treatment for hair-loss concerns, with individual care decisions and clear details before treatment.',
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
        heading: 'What physician management is intended to mean here.',
        items: [
          'A physician reviews each evaluation, relevant result, and written clinical plan.',
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
          `Coming soon to ${clinicAddress}. Our planned launch is November 1, 2026. Find launch updates at apexwellnessnwi.com.`,
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
    navLabel: 'Weight & Metabolic',
    title: 'Medical Weight Management in Northwest Indiana | Apex Wellness',
    description:
      'Learn about the physician-managed approach to medical weight and metabolic care at Apex Wellness in Northwest Indiana.',
    eyebrow: 'Care area · Medical weight and metabolic care',
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
          'If you are looking for a specific prescription without an evaluation, this is not the right fit. Everything here starts with a physician visit.'
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
          'Depending on your history, your physician may look at metabolic and cardiovascular markers, body composition and any recent outside results. Testing is ordered when it changes the plan, and its cost is shown separately.'
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
          'Whether medication makes sense is a decision you and your physician make together. Compounded and FDA-approved products are different things, and we will talk through the difference before anything is prescribed.'
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
              'Pricing is being finalized. Medication and outside lab work will be listed separately from the visit fee so you can see exactly what you are paying for.'
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
    navLabel: "Men's Hormone Health",
    title: "Men's Hormone Health in Northwest Indiana | Apex Wellness",
    description:
      "Learn about Apex Wellness's physician-managed evaluation of men's hormone concerns in Northwest Indiana.",
    eyebrow: "Care area · Men's hormone health",
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
              'Visit modality, medication fulfillment, administration pathways, training, and supply details are still being finalized and will be published before care opens.'
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
    navLabel: "Women's Midlife Care",
    title: 'Menopause & Midlife Care in Northwest Indiana | Apex Wellness',
    description:
      'Learn about the physician-managed approach to perimenopause, menopause, weight, sleep, and metabolic concerns at Apex Wellness.',
    eyebrow: "Care area · Women's midlife hormone and metabolic care",
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
    navLabel: 'Hair-Loss Care',
    title: 'Hair-Loss Care in Merrillville & NWI | Apex Wellness',
    description:
      'Physician-led hair-loss care is coming to Apex Wellness in Merrillville, Northwest Indiana. Explore the planned service and join the Launch List.',
    eyebrow: 'Coming soon · Hair-loss care',
    h1: 'Hair-loss concerns deserve a thoughtful conversation.',
    intro:
      'Apex is preparing to offer physician-led evaluation and treatment for adults with hair-loss concerns. Individual care decisions come first, with service details and pricing available before scheduling opens.',
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
              'Not yet. We open in November. Join the Launch List and you will hear first.'
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
              'Not yet. Booking opens in November. Join the Launch List and we will email you when it does.'
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
      'Meet Shahab Siddique and Atif Muhammad, MD, and learn about the personal motivations behind Apex Wellness in Northwest Indiana.',
    eyebrow: 'The people behind Apex',
    h1: 'Different backgrounds. One shared motivation.',
    intro:
      'Staying strong, capable, and involved in the things we love. Our reasons for building Apex are personal—and your reasons for seeking care should matter just as much.',
    cta: priorityListCta,
    sections: [
      {
        type: 'teamProfiles',
        eyebrow: 'Meet the team',
        heading: 'People first. In the practice, too.',
        intro: 'A shared enthusiasm for fitness brought us to the same question: how can thoughtful, physician-led care support the life someone wants to keep living? You do not need to be an athlete to belong here. Your goals set the context.',
        profiles: [
          {
            id: 'shahab-siddique',
            name: 'Shahab Siddique',
            context: 'Health technology · A personal reason to build Apex',
            headline: 'More years doing the things you love.',
            image: { file: 'shahab-siddique-warm-v1.webp', width: 1254, height: 1254 },
            paragraphs: [
              'Shahab grew up wrestling and remains an active weightlifter who enjoys Brazilian jiu-jitsu, Muay Thai, and boxing. His interest in wellness starts with a question that gets more relevant with every birthday: how do you keep doing the things you love as you get older?',
              'His professional background is in health technology and clinical workflows. His motivation for Apex is more personal: helping build a physician-led practice that takes long-term strength, function, and individual ambitions seriously.',
              'For Shahab, health is about more than a number on a scale. It is about another round on the mats, time under the bar, and staying engaged in a life that feels like yours.'
            ],
            aside: 'Birthdays can stay. Automatically retiring your favorite hobbies? Less appealing.'
          },
          {
            id: 'atif-muhammad',
            name: 'Atif Muhammad, MD',
            context: 'Physician leadership · Fitness enthusiast · Traveler',
            headline: 'Fitness for a life beyond the gym.',
            image: { file: 'atif-muhammad-warm-v3.png', width: 1316, height: 1195 },
            paragraphs: [
              'Dr. Atif Muhammad is an active weightlifter, enjoys traveling, and is passionate about fitness. Those interests connect with a simple idea behind Apex: health matters not only in the gym, but in the life you want to enjoy beyond it.',
              'That might mean pursuing a training goal, feeling capable while exploring somewhere new, or continuing the everyday routines that matter to you. Different people have different priorities, and that personal context deserves a place in a clinical conversation.',
              'Atif’s enthusiasm for fitness fits Apex’s focus on thoughtful, physician-led care rather than one definition of success. The point is not to make everyone’s goals look the same. It is to understand what being well means to each person.'
            ],
            aside: 'There is a world beyond the weight room. Conveniently, Atif is interested in both.'
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
        body: 'The portraits on this page are Shahab Siddique and Atif Muhammad, MD. Other photographs on the site are illustrative.'
      }
    ]
  },

  faq: {
    slug: '/faq/',
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
              `${clinicAddress}. We open in November. Call or text (219) 207-2456, or email hello@apexwellnessnwi.com. Hours and parking details will be posted before we open.`
          },
          {
            question: 'When will appointments open?',
            answer:
              'Our planned launch is November 1, 2026. Find launch updates at apexwellnessnwi.com.'
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
              'Yes. Physician-led hair-loss care is part of the planned offering, alongside weight and metabolic care, men’s hormone health, and women’s midlife care. Coming soon; specific treatment options and fees will be published before scheduling opens.'
          },
          {
            question: 'Does an evaluation guarantee treatment or a prescription?',
            answer:
              'No. Future treatment will require an appropriate evaluation, clinical eligibility, and informed consent. Another clinician or no treatment may be the right recommendation.'
          },
          {
            question: 'Who will provide care?',
            answer:
              'Apex is physician-led by Atif Muhammad, MD. Detailed clinical responsibilities and individual appointment availability will be published before scheduling opens.'
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
    modified: '2026-09-22',
    navLabel: 'Launch List',
    title: 'Join the Apex Wellness Launch List | Northwest Indiana',
    description:
      'Join the Apex Wellness Launch List for opening updates. Physician-led weight, metabolic, hormone, and hair-loss care. Coming soon to Merrillville.',
    eyebrow: 'Planned launch · November 1, 2026',
    h1: 'Be ready for what comes next.',
    intro:
      'Join the Launch List for opening updates from Apex. Share your name and email, and get to know the practice as we prepare to open.',
    cta: {
      label: 'Go to the request form',
      href: '#consultation-request'
    },
    secondaryCta: {
      label: 'Explore the full site',
      href: '/'
    },
    ctaNote: 'Free · Name and email only',
    landing: true,
    form: {
      action: '/api/founding-consultation',
      method: 'post',
      heading: 'Join the launch list',
      submitLabel: 'Join the Launch List',
      consentVersion: 'launch-list-2026-09-21',
      consentLabel:
        'Email me opening updates from Apex Wellness. I can unsubscribe anytime, and I have read the Privacy Policy and Communications Consent.',
      accessibilityLabel: 'This is a website or accessibility question, not a Launch List signup.',
      privacyNote:
        'Just your name and email. Save the medical details for your visit.',
      successMessage:
        'You’re on the Launch List. Thanks for joining us. Find launch updates at apexwellnessnwi.com.'
    },
    sections: [
      {
        type: 'trustPoints',
        items: [
          'Free to join',
          'Name and email only',
          'First to hear when booking opens',
          'Built for Northwest Indiana adults'
        ]
      },
      {
        type: 'detail',
        eyebrow: 'What you are signing up for',
        heading: 'Hear it first.',
        body:
          'The opening date, pricing and the first booking window go to the Launch List before anywhere else.'
      },
      {
        type: 'cards',
        eyebrow: 'Care areas',
        heading: 'Explore whether Apex may fit what you are looking for.',
        cards: [
          {
            title: 'Weight & metabolic care',
            body: 'A physician-managed approach to evaluation, meaningful measurements, sustainable habits, and medication only when clinically indicated.',
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
            body: 'Physician-led evaluation and treatment for thinning and balding, for men and women.',
            href: '/hair-loss-care/'
          }
        ]
      },
      {
        type: 'steps',
        eyebrow: 'What happens next',
        heading: 'What happens next',
        items: [
          {
            title: 'Join the list.',
            body: 'Name and email. Takes ten seconds.'
          },
          {
            title: 'Get the details.',
            body: 'We email the opening date, pricing and how care works, as each is confirmed.'
          },
          {
            title: 'Book if it fits.',
            body: 'When scheduling opens, Launch List members hear first.'
          },
          {
            title: 'Share your history at your visit.',
            body: 'Medical intake happens securely once you have an appointment, not on this form.'
          }
        ]
      },
      {
        type: 'faq',
        heading: 'Before you submit',
        items: [
          {
            question: 'Does this reserve an appointment?',
            answer: 'No. It gets you opening updates and first access when booking opens.'
          },
          {
            question: 'Does it cost anything?',
            answer: 'No.'
          },
          {
            question: 'Should I include medical information?',
            answer: 'No. Just your name and email. Your history is for your visit.'
          },
          {
            question: 'When will I hear from you?',
            answer: 'As soon as there is something worth telling you: the opening date, pricing, and the first booking window.'
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
      'Read how the Apex Wellness prelaunch website collects, uses, protects, and retains consultation-request information.',
    eyebrow: `Effective ${effectiveDate}`,
    h1: 'Privacy Policy',
    intro:
      'This prelaunch policy explains the limited information collected through the Apex Wellness website and Founding Patient contact form. It may be updated as clinical services and secure patient systems are introduced.',
    cta: priorityListCta,
    effectiveDate,
    sections: [
      {
        type: 'policySection',
        heading: 'Information we collect',
        paragraphs: [
          'The Founding Patient form asks for your name and email address. You may optionally identify the request as website or accessibility support. The form does not ask which care area interests you. Please do not submit symptoms, diagnoses, medications, laboratory values, insurance information, or other sensitive medical details.',
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
          'To protect the form and website from abuse, fraud, spam, and security threats.',
          'To maintain a record of consent and honor unsubscribe or deletion requests where applicable.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Automated website guide',
        paragraphs: [
          'The Ask Apex guide uses fixed informational answers within your browser. Questions entered there are not sent to Apex or an external AI service, and the guide does not save conversation content. Please do not enter personal or medical information. Closing the guide clears its displayed answer.',
          'A temporary session preference remembers if you dismiss the launch invitation. It does not contain your questions or contact details. The separate launch-list form records information only when you choose to submit it with contact consent.'
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
          'Consultation-request information, earlier priority-list information, and related consent records are retained only as long as reasonably needed for their stated purposes, to honor communication preferences, resolve disputes, meet applicable obligations, and protect the service. Records are deleted or de-identified when no longer reasonably needed, subject to legal or security requirements.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Your choices',
        paragraphs: [
          'You may unsubscribe using the link in an email. You may also use the Founding Patient form, check the website or accessibility support option, and request access, correction, or deletion of your prelaunch contact information. Do not include medical details in that request.',
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
          `Physician leadership, our location at ${clinicAddress}, and a planned launch date are identified on the site. Detailed clinical responsibilities, licensure information, legal practice details, contact channels, hours, pricing, and appointment availability are still being finalized.`
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
      'Understand consent for Apex Wellness prelaunch emails, how consent is recorded, and how to unsubscribe.',
    eyebrow: `Effective ${effectiveDate}`,
    h1: 'Communications Consent',
    intro:
      'This consent applies to prelaunch email requested through the Founding Patient contact form. Apex does not currently request a phone number or permission for marketing texts or calls.',
    cta: priorityListCta,
    effectiveDate,
    sections: [
      {
        type: 'policySection',
        heading: 'What you agree to receive',
        paragraphs: [
          'By checking the consent box and submitting the form, you ask Apex Wellness to email you about your request. If your request concerns a consultation, emails may include verified opening information and future consultation availability.',
          'If you check the website or accessibility support option, Apex may email you to respond to that request; it will not treat that selection as a consultation-marketing request. Consultation-related messages may be informational and promotional. Messages are not medical advice, clinical messages, appointment confirmations, or emergency communications.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Consent is optional and revocable',
        paragraphs: [
          'Submitting a consultation request is optional. Consent to prelaunch email is not a condition of receiving medical care or making a purchase, neither of which is currently available through the site.',
          'You may unsubscribe at any time using the link in an email. Apex may retain a limited suppression record so that the unsubscribe request continues to be honored.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Consent records',
        paragraphs: [
          'Apex may record the email address, submission time, optional website-accessibility flag, consent language and version, source domain, and technical information reasonably needed to document the request and protect the form from abuse. The raw IP address is not retained. Only a one-way salted hash derived from it is retained for abuse prevention and rate limiting.',
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
    title: 'Weight, Metabolic & Hormone Health Articles | Apex Wellness',
    description:
      'Plain-language articles about weight, metabolic, and hormone health for adults in Northwest Indiana from Apex Wellness.',
    eyebrow: 'Apex Wellness field notes',
    h1: 'Clear answers. Thoughtful care.',
    intro:
      'Practical explanations about weight, metabolic, and hormone health—with sources, honest limits, and questions worth bringing to a clinical visit.',
    cta: priorityListCta,
    kind: 'blogIndex',
    modified: '2026-09-11',
    sections: []
  }
});

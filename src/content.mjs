const priorityListCta = Object.freeze({
  label: 'Join the Priority List',
  href: '/priority-list/'
});

const effectiveDate = 'September 2, 2026';

const emergencyNotice =
  'Apex Wellness does not provide urgent or emergency care. If you are experiencing a medical emergency, call 911 or go to the nearest emergency department.';

const prelaunchNotice =
  'Apex Wellness is in prelaunch. Appointments, treatment, prescriptions, and payments are not currently available through this website.';

export const site = Object.freeze({
  name: 'Apex Wellness',
  canonicalUrl: 'https://apexwellnessnwi.com',
  region: 'Northwest Indiana',
  status: 'Prelaunch',
  tagline: 'Weight and hormone care built around physician management.',
  description:
    'Apex Wellness is preparing a physician-managed weight, metabolic, and hormone care practice for adults in Northwest Indiana.',
  announcement:
    'Opening in Northwest Indiana. Join the priority list for launch updates and appointment availability.',
  cta: priorityListCta,
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Weight & Metabolic', href: '/weight-management/' },
    { label: "Men's Hormone Health", href: '/mens-hormone-health/' },
    { label: "Women's Midlife Care", href: '/womens-midlife-care/' },
    { label: 'How It Works', href: '/how-it-works/' },
    { label: 'Pricing', href: '/pricing/' },
    { label: 'About', href: '/about/' },
    { label: 'FAQ', href: '/faq/' }
  ],
  policyNavigation: [
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Terms of Use', href: '/terms/' },
    { label: 'Communications Consent', href: '/communications-consent/' },
    { label: 'Accessibility Statement', href: '/accessibility/' },
    { label: 'Cancellation and Refunds', href: '/cancellation-refunds/' }
  ],
  careInterests: [
    { label: 'Medical weight and metabolic care', value: 'weight_management' },
    { label: "Men's hormone health", value: 'mens_hormone_health' },
    { label: "Women's midlife hormone and metabolic care", value: 'womens_midlife_care' },
    { label: 'Not sure yet', value: 'not_sure' },
    { label: 'Website or accessibility help', value: 'website_or_accessibility' }
  ],
  representativeImageryNotice:
    'Representative imagery. People and spaces shown are illustrative and are not identified as Apex Wellness clinicians, patients, or facilities.',
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
      'A physician-managed approach to weight, metabolic, and hormone care for adults in Northwest Indiana.',
    location:
      'Opening in Northwest Indiana. A confirmed address, contact channels, office hours, and availability will be published before scheduling opens.',
    copyright: '© 2026 Apex Wellness.'
  }
});

export const pages = Object.freeze({
  home: {
    slug: '/',
    navLabel: 'Home',
    title: 'Physician-Managed Weight and Hormone Care | Apex Wellness',
    description:
      'Explore Apex Wellness, a prelaunch physician-managed weight, metabolic, and hormone care practice for adults in Northwest Indiana.',
    eyebrow: 'Medical wellness · Northwest Indiana',
    h1: 'Weight and hormone care, managed by a physician.',
    intro:
      'Apex Wellness is being built around a clear standard: a physician reviews the evaluation, appropriate testing, and the written plan, then remains responsible for clinical decisions and follow-up.',
    cta: priorityListCta,
    sections: [
      {
        type: 'trustPoints',
        items: [
          'Physician-reviewed evaluation and plan',
          'Testing interpreted in clinical context, not by one threshold',
          'Transparent cash-pay options before care begins',
          'Focused service for adults across Northwest Indiana'
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
        type: 'cards',
        eyebrow: 'Three areas of care',
        heading: 'Three focused lanes. One physician-managed standard.',
        cards: [
          {
            title: 'Medical Weight and Metabolic Care',
            body:
              'Evaluation, meaningful measurements, nutrition and muscle-preservation support, and medication only when clinically indicated.',
            href: '/weight-management/'
          },
          {
            title: "Men's Hormone Health",
            body:
              'A risk-aware evaluation of symptoms and appropriate testing, with treatment considered only after the full clinical picture is reviewed.',
            href: '/mens-hormone-health/'
          },
          {
            title: "Women's Midlife Hormone and Metabolic Care",
            body:
              'Individualized discussion of perimenopause, menopause, weight, sleep, and metabolic concerns, including hormonal and non-hormonal options.',
            href: '/womens-midlife-care/'
          }
        ]
      },
      {
        type: 'steps',
        eyebrow: 'How it works',
        heading: 'Nothing clinical begins before the case is reviewed.',
        items: [
          {
            title: 'Choose your care area.',
            body: 'Review the service that most closely matches your concern.'
          },
          {
            title: 'Complete an evaluation.',
            body: 'Discuss your history, concerns, goals, and risks through the secure clinical process available after launch.'
          },
          {
            title: 'Complete appropriate testing.',
            body: 'Labs or measurements are considered only when clinically indicated and are interpreted in context.'
          },
          {
            title: 'Review your written plan.',
            body: 'Understand the findings, options, costs, follow-up, and referral criteria before deciding whether to begin care.'
          }
        ]
      },
      {
        type: 'featureList',
        eyebrow: 'Why Apex',
        heading: 'What physician management is intended to mean here.',
        items: [
          'A physician reviews each evaluation, relevant result, and written clinical plan.',
          'Dosing, monitoring, and referral decisions rely on clinical judgment rather than an automatic protocol.',
          'The practice stays focused on three care areas with clear fees and exclusions.',
          'Progress is reviewed using symptoms, measurements, laboratory data when relevant, function, adherence, and side effects.',
          'When another clinician is the better destination, the plan is to say so clearly.'
        ]
      },
      {
        type: 'prelaunch',
        eyebrow: 'Opening in Northwest Indiana',
        heading: 'Launch details will be published before scheduling opens.',
        body:
          'Verified clinician names and credentials, the practice location, contact information, hours, final pricing, appointment availability, and reservation terms are still being finalized. Joining the priority list is free and does not create a clinician-patient relationship or guarantee treatment.',
        cta: priorityListCta
      },
      {
        type: 'serviceArea',
        eyebrow: 'Region served',
        heading: 'Northwest Indiana',
        body:
          'Apex Wellness is being developed for adults in Merrillville, Crown Point, Schererville, Munster, Dyer, St. John, Highland, Hobart, and surrounding communities. A confirmed address and visit-modality details will be published before opening.'
      }
    ]
  },

  'weight-management': {
    slug: '/weight-management/',
    navLabel: 'Weight & Metabolic',
    title: 'Medical Weight and Metabolic Care | Apex Wellness',
    description:
      'Learn about the planned physician-managed approach to medical weight and metabolic care at Apex Wellness in Northwest Indiana.',
    eyebrow: 'Care area · Medical weight and metabolic care',
    h1: 'Weight and metabolic care managed by a physician, not a menu.',
    intro:
      'The planned care model begins with evaluation, risks, goals, and relevant measurements. Medication may be discussed when clinically indicated, but it is never the only lever and is never guaranteed.',
    cta: priorityListCta,
    sections: [
      {
        type: 'audience',
        heading: 'Who this care may fit',
        body:
          'Adults who want an evidence-informed plan that can include nutrition, protein and resistance-training support, appropriate measurements, careful medication consideration, side-effect review, plateau management, and maintenance planning.',
        note:
          'This service is not designed for anyone seeking a guaranteed medication, a specific prescription without evaluation, or a promised amount of weight loss.'
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
          'Depending on history, a clinician may consider metabolic or cardiovascular markers, functional or body-composition measurements, and recent outside results. Testing is not automatic and, when ordered, its cost is disclosed separately.'
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
          'Apex does not promise weight loss or medication eligibility. Compounded drugs and FDA-approved products are not interchangeable, and product-specific risks and regulatory status must be discussed before use.'
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
              'Final pricing and inclusions are not yet published. Medication and outside testing will be shown separately unless a future published package expressly says otherwise.'
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
    title: "Men's Hormone Health | Apex Wellness",
    description:
      "Learn about Apex Wellness's planned physician-managed evaluation of men's hormone concerns in Northwest Indiana.",
    eyebrow: "Care area · Men's hormone health",
    h1: 'Hormone care built around context, safety, and follow-through.',
    intro:
      'Symptoms, repeat results when appropriate, health risks, fertility goals, and reasonable alternatives all matter. A single laboratory number does not decide the plan, and testosterone is never promised.',
    cta: priorityListCta,
    sections: [
      {
        type: 'audience',
        heading: 'Who this care may fit',
        body:
          'Men with symptoms or findings that merit a thoughtful evaluation and who want to understand what the numbers may mean, what alternatives exist, and what responsible monitoring would involve.',
        note:
          'This service is not intended for anyone seeking treatment without evaluation or a guaranteed testosterone prescription.'
      },
      {
        type: 'detail',
        eyebrow: 'Evaluation',
        heading: 'Symptoms and risk reviewed together.',
        body:
          'The planned evaluation considers relevant medical history, sleep, cardiovascular and blood-pressure factors, fertility goals, current medications, symptoms, and prior results. Options may include no hormone treatment.'
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
          'Apex does not treat every symptom as hormone deficiency and does not promise improvements in energy, mood, libido, fertility, body composition, or performance.'
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
    title: "Women's Midlife Hormone and Metabolic Care | Apex Wellness",
    description:
      'Learn about the planned physician-managed approach to perimenopause, menopause, weight, sleep, and metabolic concerns at Apex Wellness.',
    eyebrow: "Care area · Women's midlife hormone and metabolic care",
    h1: 'Midlife care that starts with your history, risks, and goals.',
    intro:
      'The planned approach is individualized rather than built around a generic “hormone balancing” promise. Hormonal and non-hormonal options may be discussed, and coordination or referral remains part of good care.',
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
          'Hormone therapy is not appropriate for everyone. Apex does not promise “balance,” youth restoration, weight loss, symptom resolution, or a specific prescription.'
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
              'Final treatment offerings are not yet published. No procedure or product should be assumed available during prelaunch.'
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
      'See the planned four-step Apex Wellness process, from choosing a care area through evaluation, appropriate testing, and a written plan.',
    eyebrow: 'How it works',
    h1: 'Four steps, each built around physician review.',
    intro:
      'Apex is preparing a process in which evaluation, appropriate testing, clinical options, full costs, and follow-up expectations are reviewed before treatment begins.',
    cta: priorityListCta,
    sections: [
      {
        type: 'steps',
        heading: 'The planned care journey',
        items: [
          {
            title: 'Choose your care area.',
            body:
              'Review medical weight and metabolic care, men’s hormone health, or women’s midlife care. Select “Not sure yet” on the priority-list form if you do not know which area fits.'
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
          'The website currently accepts priority-list requests only. It does not provide clinical intake, appointments, medical advice, prescriptions, or payment. Verified staffing, visit modality, response times, follow-up cadence, and launch availability will be published before scheduling opens.',
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
    h1: 'Clear costs before any appointment or payment.',
    intro:
      'Apex plans to publish the evaluation fee, care-area fees, common outside costs, billing cadence, and cancellation terms together. Final amounts are still being confirmed, so no placeholder prices are displayed.',
    cta: priorityListCta,
    sections: [
      {
        type: 'status',
        heading: 'Final pricing is not yet published.',
        body:
          'Apex is not accepting payment during prelaunch. Pricing will be posted only after clinical offerings, vendor terms, and operating details are confirmed. Joining the priority list is free.'
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
              'No. The current website does not accept payment or appointment reservations. The priority list is free and is only for updates and future availability.'
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
    title: 'About Apex Wellness | Northwest Indiana',
    description:
      'Learn the standards guiding Apex Wellness as it prepares a physician-managed weight, metabolic, and hormone care practice in Northwest Indiana.',
    eyebrow: 'About Apex',
    h1: 'A practice being built for clearer, more accountable care.',
    intro:
      'Apex Wellness is preparing a focused weight, metabolic, and hormone care practice for adults in Northwest Indiana. The intended model emphasizes physician review, understandable options, transparent costs, and dependable follow-through.',
    cta: priorityListCta,
    sections: [
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
        eyebrow: 'Clinical team',
        heading: 'Verified people and roles will be published before care opens.',
        body:
          'The site does not yet identify a clinician, medical director, founder, or legal practice entity. Names, degrees, professional credentials, Indiana licensure information, responsibilities, and care philosophy will be added only after verification and authorization for publication.'
      },
      {
        type: 'verificationStatus',
        eyebrow: 'Location and access',
        heading: 'Operational details are still being finalized.',
        body:
          'A confirmed street address, phone number, email address, office hours, opening timeline, visit modality, accessibility details, parking information, and response times will be published before scheduling opens.'
      },
      {
        type: 'imageryNotice',
        eyebrow: 'Photography',
        heading: 'Images are representative during prelaunch.',
        body: site.representativeImageryNotice
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
      'Apex Wellness is still in prelaunch. These answers separate what is planned from what is currently available and will be updated as verified operating details are finalized.',
    cta: priorityListCta,
    sections: [
      {
        type: 'faqGroup',
        heading: 'Prelaunch and availability',
        items: [
          {
            question: 'Is Apex Wellness open?',
            answer:
              'Not yet. This website currently provides information and accepts priority-list requests. It does not provide appointments, clinical intake, treatment, prescriptions, or payment.'
          },
          {
            question: 'Where is Apex located?',
            answer:
              'Apex is being developed for Northwest Indiana. The confirmed address, parking, accessibility details, phone, email, hours, and visit modality will be published before scheduling opens.'
          },
          {
            question: 'When will appointments open?',
            answer:
              'A launch date has not been published. Priority-list members may receive updates and notice when appointment availability is announced.'
          },
          {
            question: 'Does joining the list reserve an appointment?',
            answer:
              'No. It is a free request for updates and future availability, not a reservation or guarantee of an appointment, prescription, treatment, or outcome.'
          }
        ]
      },
      {
        type: 'faqGroup',
        heading: 'Care and eligibility',
        items: [
          {
            question: 'Does an evaluation guarantee treatment or a prescription?',
            answer:
              'No. Future treatment will require an appropriate evaluation, clinical eligibility, and informed consent. Another clinician or no treatment may be the right recommendation.'
          },
          {
            question: 'Who will provide care?',
            answer:
              'Verified names, credentials, Indiana licensure information, roles, and responsibilities are not yet published. They will be added before appointments open.'
          },
          {
            question: 'Will Apex replace primary or specialist care?',
            answer:
              'No. Apex is intended as focused care within a defined scope and will not replace routine primary care, recommended screening, urgent or emergency care, or specialist services when those are appropriate.'
          },
          {
            question: 'Can I send symptoms, diagnoses, medications, or lab values through the priority-list form?',
            answer:
              'No. The priority-list form is not clinical intake. Please do not submit medical or other sensitive information there.'
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
              'Final fees are not yet published, and Apex is not accepting payment. Complete pricing, inclusions, exclusions, and terms will appear before scheduling opens.'
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
              'The marketing form collects only basic contact information and care interest. Details about secure clinical intake, record handling, response times, and patient communications will be published before care opens.'
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

  'priority-list': {
    slug: '/priority-list/',
    navLabel: 'Priority List',
    title: 'Join the Priority List | Apex Wellness',
    description:
      'Join the Apex Wellness priority list for prelaunch updates and future appointment availability in Northwest Indiana.',
    eyebrow: 'Prelaunch priority list',
    h1: 'Join the priority list.',
    intro:
      'Receive launch updates and notice when appointment availability is announced. Joining is free and does not reserve an appointment or guarantee treatment.',
    cta: priorityListCta,
    sections: [
      {
        type: 'expectations',
        heading: 'What to expect',
        items: [
          'Apex may email you about launch progress and future appointment availability after you give consent.',
          'Final clinicians, credentials, location, hours, pricing, care terms, and availability will be published before scheduling opens.',
          'Clinical history will not be collected through this marketing form.',
          'Joining the list does not create a clinician-patient relationship or guarantee eligibility, treatment, a prescription, an outcome, or a place in a future schedule.'
        ]
      },
      {
        type: 'form',
        action: '/api/priority',
        method: 'post',
        submitLabel: 'Join the Priority List',
        fields: [
          {
            name: 'full_name',
            label: 'Name',
            type: 'text',
            autocomplete: 'name',
            required: true
          },
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            autocomplete: 'email',
            inputmode: 'email',
            required: true
          },
          {
            name: 'care_interest',
            label: 'Care interest',
            type: 'select',
            autocomplete: 'off',
            required: true,
            options: site.careInterests
          }
        ],
        consent: {
          name: 'consent',
          required: true,
          label:
            'I agree to receive email from Apex Wellness about launch updates and appointment availability, and I acknowledge the Privacy Policy and Communications Consent. I may unsubscribe at any time.'
        },
        privacyNote:
          'Please do not include symptoms, diagnoses, medications, laboratory values, insurance details, or other sensitive medical information. This is a marketing and availability form, not clinical intake.',
        successHeading: 'Your request was received.',
        successMessage: 'Thank you. We received your priority-list request.',
        errorHeading: 'We could not submit the form.',
        errorMessage:
          'Please review the highlighted fields and try again. If the problem continues, return later; a separate contact channel is not yet published.'
      },
      {
        type: 'notice',
        heading: 'No payment or clinical care through this form',
        body:
          'Apex does not accept payment or clinical information through the priority list. Medical questions cannot be evaluated here. For urgent or emergency needs, seek appropriate immediate care.'
      }
    ]
  },

  privacy: {
    slug: '/privacy/',
    navLabel: 'Privacy Policy',
    title: 'Privacy Policy | Apex Wellness',
    description:
      'Read how the Apex Wellness prelaunch website collects, uses, protects, and retains priority-list information.',
    eyebrow: `Effective ${effectiveDate}`,
    h1: 'Privacy Policy',
    intro:
      'This prelaunch policy explains the limited information collected through the Apex Wellness website and priority list. It may be updated as clinical services and secure patient systems are introduced.',
    cta: priorityListCta,
    effectiveDate,
    sections: [
      {
        type: 'policySection',
        heading: 'Information we collect',
        paragraphs: [
          'The priority-list form asks for your name, email address, and care interest. Please do not submit symptoms, diagnoses, medications, laboratory values, insurance information, or other sensitive medical details.',
          'For security, reliability, and consent records, the site may also record the submission time, policy or consent version, referring page, browser or device information, and whether the submission passed anti-spam checks. The raw IP address is not retained. Only a one-way salted hash derived from it is retained for abuse prevention and rate limiting.'
        ]
      },
      {
        type: 'policySection',
        heading: 'How information is used',
        bullets: [
          'To confirm and administer your priority-list request.',
          'To send launch updates and future appointment-availability information you requested.',
          'To answer a website or accessibility help request submitted through the form.',
          'To protect the form and website from abuse, fraud, spam, and security threats.',
          'To maintain a record of consent and honor unsubscribe or deletion requests where applicable.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Sharing and service providers',
        paragraphs: [
          'Apex does not sell priority-list information. Information may be handled by service providers that support website hosting, form delivery, email, security, or data storage, but only for those services and subject to applicable safeguards.',
          'Information may also be disclosed when reasonably necessary to comply with law, respond to valid legal process, protect rights or safety, or address suspected misuse. The marketing form is not intended to receive protected health information or create a clinical record.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Security and retention',
        paragraphs: [
          'Apex uses administrative, technical, and organizational safeguards intended to protect submitted information. No website, transmission, or storage method can be guaranteed completely secure.',
          'Priority-list information and related consent records are retained only as long as reasonably needed for the purposes described here, to honor communication preferences, resolve disputes, meet applicable obligations, and protect the service. Records are deleted or de-identified when no longer reasonably needed, subject to legal or security requirements.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Your choices',
        paragraphs: [
          'You may unsubscribe using the link in an email. You may also use the priority-list form and choose “Website or accessibility help” to request access, correction, or deletion of your prelaunch contact information. Do not include medical details in that request.',
          'Browser privacy controls may limit cookies or similar technologies. Essential security and form-protection functions may still be required for the site to operate.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Children and policy changes',
        paragraphs: [
          'The priority list is intended for adults and is not knowingly directed to children. If information from a child is discovered, Apex will take reasonable steps to delete it.',
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
      'Read the terms governing use of the prelaunch Apex Wellness website and priority list.',
    eyebrow: `Effective ${effectiveDate}`,
    h1: 'Terms of Use',
    intro:
      'These terms apply to the prelaunch Apex Wellness website. The site currently provides general information and a priority list; it does not provide appointments, payment, clinical intake, or medical care.',
    cta: priorityListCta,
    effectiveDate,
    sections: [
      {
        type: 'policySection',
        heading: 'Educational information only',
        paragraphs: [
          'Website content is general educational information and is not medical advice, diagnosis, treatment, or a substitute for care from a qualified professional who knows your circumstances.',
          'Using the site, joining the priority list, or receiving an email does not create a clinician-patient relationship and does not guarantee an appointment, eligibility, treatment, prescription, or result.'
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
          'Final clinician identities, professional credentials, licensure information, legal practice details, location, contact channels, hours, pricing, and opening timeline have not yet been published.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Acceptable use',
        bullets: [
          'Provide accurate information when submitting the priority-list form.',
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
          'Until a dedicated contact channel is published, use the priority-list form and select “Website or accessibility help” for a website-related question. Do not include medical information.'
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
      'This consent applies to prelaunch email requested through the priority-list form. Apex does not currently request a phone number or permission for marketing texts or calls.',
    cta: priorityListCta,
    effectiveDate,
    sections: [
      {
        type: 'policySection',
        heading: 'What you agree to receive',
        paragraphs: [
          'By checking the consent box and submitting the form, you ask Apex Wellness to email you about launch progress, priority-list administration, and future appointment availability.',
          'These messages are informational and promotional. They are not medical advice, clinical messages, appointment confirmations, or emergency communications.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Consent is optional and revocable',
        paragraphs: [
          'Joining the priority list is optional. Consent to prelaunch email is not a condition of receiving medical care or making a purchase, neither of which is currently available through the site.',
          'You may unsubscribe at any time using the link in an email. Apex may retain a limited suppression record so that the unsubscribe request continues to be honored.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Consent records',
        paragraphs: [
          'Apex may record the email address, submission time, selected care interest, consent language and version, source page, and technical information reasonably needed to document the request and protect the form from abuse. The raw IP address is not retained. Only a one-way salted hash derived from it is retained for abuse prevention and rate limiting.',
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
          'Until a dedicated accessibility contact is published, use the priority-list form and select “Website or accessibility help.” Provide only the minimum information needed to describe the page, feature, assistive technology, or alternative format involved.',
          'Do not include medical or other sensitive information. Apex will use the email address you provide to respond and work toward a reasonable accessible alternative.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Representative imagery and plain-language content',
        paragraphs: [
          'Prelaunch photographs are representative imagery and do not identify Apex clinicians, patients, or facilities. Important information is intended to remain available in text rather than relying on an image alone.',
          'Verified address, parking, physical-access details, visit modality, and other accommodation information will be published before scheduling opens.'
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
        heading: 'Priority-list requests',
        paragraphs: [
          'Joining the priority list is free. It is not an appointment, reservation, membership, deposit, or promise of treatment.',
          'You may unsubscribe from email using the link in any message. You may request deletion of your prelaunch contact information as described in the Privacy Policy.'
        ]
      },
      {
        type: 'policySection',
        heading: 'Terms before future payment',
        paragraphs: [
          'Before Apex accepts any payment, the applicable price, services included and excluded, billing cadence, rescheduling deadline, late-cancellation or missed-visit rule, pause and termination process, refund eligibility, and any evaluation-fee credit will be shown in plain language.',
          'You will have an opportunity to review and accept those terms before completing payment. Terms may differ by service and will not be applied retroactively to a prelaunch priority-list request.'
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
          'A dedicated billing contact is not yet published. During prelaunch, use the priority-list form and select “Website or accessibility help” for a website-policy question. Do not submit payment details or medical information.'
        ]
      }
    ]
  }
});

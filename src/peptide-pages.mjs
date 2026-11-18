// Peptide therapy pages, added November 17, 2026 at the owner's request.
// Regulatory basis checked November 17, 2026:
// - HHS interim enforcement discretion policy for 503A compounding of six peptides, including BPC-157 and TB-500
//   (Federal Register, FR Doc. 2026-22192, published October 30, 2026). It is not FDA approval, it requires a
//   single active ingredient per compounded product, and it allows TB-500 only by injection.
// - Sermorelin and gonadorelin are compounded under a patient-specific prescription.
// Copy rules for these pages: no outcome promises, no "FDA approved", "legal" or "legalized" wording, and no peptide
// names on the Google Ads landing pages (/founding-patients/ and the booking pages). See tests/static-site.test.mjs.

const bookingCta = Object.freeze({ label: 'Book online', href: '/founding-patients/' });
const ctaNote = 'Peptides are prescribed only after a visit, if they fit your goals and health history.';

const compoundedNote =
  'Compounded peptides are not FDA-approved. If one is prescribed, a state-licensed compounding pharmacy prepares it for you, with a prescription in your name.';

const athleteFaq = Object.freeze({
  question: 'I compete in a tested sport. Does that matter?',
  answer: 'Yes. Many peptides, including BPC-157, TB-500, sermorelin and gonadorelin, are on the World Anti-Doping Agency prohibited list. Tell us at your visit if you are drug tested.'
});

const costFaq = Object.freeze({
  question: 'What does it cost?',
  answer: 'Apex is cash-pay. Peptide fees depend on what is prescribed and are explained before you decide. Your first visit and labs are part of the $49 opening offer while it lasts.'
});

const finalSection = (heading) => ({
  type: 'prelaunch',
  heading,
  eyebrow: '8550 Broadway, Suite B · Merrillville',
  body: 'Start with a first visit. We review your goals, history and labs, then talk through whether a peptide makes sense.',
  cta: bookingCta
});

const morePeptides = (exclude) => ({
  type: 'linkCards',
  eyebrow: 'Peptide therapy at Apex',
  heading: 'More peptide pages.',
  items: [
    { title: 'Peptide therapy overview', body: 'What peptides are, how a visit works and what to know first.', label: 'Read the overview', href: '/peptide-therapy/' },
    { title: 'BPC-157', body: 'The peptide most often asked about for tendon, ligament and gut recovery.', label: 'Read about BPC-157', href: '/peptide-therapy/bpc-157/' },
    { title: 'TB-500', body: 'A fragment of thymosin beta-4, asked about for soft-tissue recovery.', label: 'Read about TB-500', href: '/peptide-therapy/tb-500/' },
    { title: 'The Wolverine stack', body: 'BPC-157 and TB-500 used together. What that means in practice.', label: 'Read about the Wolverine stack', href: '/peptide-therapy/wolverine-stack/' },
    { title: 'Sermorelin', body: 'A peptide that prompts the body to release its own growth hormone.', label: 'Read about sermorelin', href: '/peptide-therapy/sermorelin/' },
    { title: 'Gonadorelin', body: 'A peptide used in men’s hormone care to support the body’s own signals.', label: 'Read about gonadorelin', href: '/peptide-therapy/gonadorelin/' }
  ].filter((item) => item.href !== exclude)
});

export const peptideHubPage = {
  slug: '/peptide-therapy/',
  modified: '2026-11-17',
  navLabel: 'Peptide Therapy',
  title: 'Peptide Therapy in Merrillville, IN | Apex Wellness',
  description: 'Peptide therapy in Merrillville, Indiana: BPC-157, TB-500, sermorelin and gonadorelin, prescribed after an in-person visit at Apex Wellness on Broadway.',
  eyebrow: 'Peptide therapy · Merrillville, Indiana',
  h1: 'Peptide therapy in Merrillville. Prescribed after a real visit.',
  intro: 'Peptides are short chains of amino acids, the same building blocks as proteins. A few have become popular for recovery, sleep, body composition and men’s hormone care. At Apex, a peptide is never a mail-order shortcut. It starts with a visit, your history and labs, and a clear talk about what the evidence does and does not show.',
  heroImage: 'consultation',
  cta: bookingCta,
  ctaNote,
  sections: [
    {
      type: 'options',
      eyebrow: 'Peptides we discuss',
      heading: 'The peptides people ask us about.',
      items: [
        { title: 'BPC-157', body: 'Asked about for tendon, ligament, joint and gut recovery. Most research so far is in animals.' },
        { title: 'TB-500', body: 'A fragment of thymosin beta-4, asked about for soft-tissue recovery. Given by injection.' },
        { title: 'Wolverine stack', body: 'The nickname for BPC-157 and TB-500 used together, each as its own prescription.' },
        { title: 'Sermorelin', body: 'Prompts the pituitary gland to release the body’s own growth hormone.' },
        { title: 'Gonadorelin', body: 'Used in men’s hormone care to support the body’s own hormone signals.' }
      ],
      note: compoundedNote
    },
    {
      type: 'steps',
      eyebrow: 'How it works',
      heading: 'A visit first. Then a decision.',
      items: [
        { title: 'Talk it through', body: 'Your goals, injuries or symptoms, medications and health history.' },
        { title: 'Check the basics', body: 'Labs as clinically appropriate, so the plan rests on more than a hunch.' },
        { title: 'Decide together', body: 'If a peptide fits, you get the plan, the cost and how to use it safely. If it does not, we say so.' },
        { title: 'Follow up', body: 'We check how it is going and whether the plan should change or stop.' }
      ]
    },
    {
      type: 'detail',
      eyebrow: 'Straight talk',
      heading: 'What the research says, and what it does not.',
      body: 'Sermorelin and gonadorelin have a long history in medicine. BPC-157 and TB-500 are newer to clinics, and most of what is known comes from animal studies. Human research is limited, so nobody can promise a result. Peptides are not a substitute for physical therapy, sleep, strength training or treating the cause of a problem.'
    },
    {
      type: 'detail',
      eyebrow: 'Why it matters where they come from',
      heading: 'Pharmacy-prepared, not “research chemicals.”',
      body: 'Peptides sold online as “research use only” are not made for people, and what is in the vial is often unknown. Apex prescribes peptides only through state-licensed compounding pharmacies, for a named patient, with sourcing and quality records. In October 2026 HHS set out conditions under which pharmacies may compound BPC-157 and TB-500. That policy is not FDA approval, and these peptides remain unapproved drugs.'
    },
    {
      type: 'faq',
      heading: 'Peptide questions, answered.',
      items: [
        { question: 'Are peptides FDA-approved?', answer: 'The compounded peptides discussed on these pages are not FDA-approved. Sermorelin was once sold as an approved drug and was withdrawn by its maker. BPC-157 and TB-500 have never been approved.' },
        { question: 'Do I need a visit to get a peptide?', answer: 'Yes. A prescription requires an evaluation, and some people should not use certain peptides. That includes anyone pregnant or breastfeeding and anyone with active cancer or a history of it.' },
        { question: 'How are peptides taken?', answer: 'Most are small injections under the skin, which we show you how to do. BPC-157 can also be prepared as an oral or topical form. TB-500 is injection only.' },
        athleteFaq,
        costFaq,
        { question: 'Can I use peptides alongside weight or hormone care?', answer: 'Sometimes. Tell us everything you take, including supplements and anything bought online, so we can check for overlap and interactions.' }
      ]
    },
    finalSection('Curious about peptides? Start with a visit.'),
    morePeptides('/peptide-therapy/')
  ]
};

export const bpc157Page = {
  slug: '/peptide-therapy/bpc-157/',
  modified: '2026-11-17',
  navLabel: 'BPC-157',
  navParent: '/peptide-therapy/',
  title: 'BPC-157 in Merrillville, IN | Peptide Therapy | Apex Wellness',
  description: 'BPC-157 peptide therapy in Merrillville, Indiana. What it is, what the research shows, how it is prescribed and what to ask before you start.',
  eyebrow: 'Peptide therapy · BPC-157',
  h1: 'BPC-157 in Merrillville. Honest answers before you start.',
  intro: 'BPC-157 is a lab-made peptide of 15 amino acids, based on a protein found in the stomach. It is one of the most searched peptides for recovery from tendon, ligament and muscle injuries and for gut health. Here is what is known, what is not, and how Apex approaches it.',
  heroImage: 'clinic',
  cta: bookingCta,
  ctaNote,
  sections: [
    {
      type: 'options',
      eyebrow: 'Why people ask about it',
      heading: 'What brings people to BPC-157.',
      items: [
        { title: 'Tendon & ligament injuries', body: 'Slow-healing elbows, shoulders, knees and Achilles problems.' },
        { title: 'Muscle strains', body: 'Training injuries that keep coming back.' },
        { title: 'Gut complaints', body: 'BPC-157 was first studied for the lining of the stomach and gut.' }
      ],
      note: 'In animal studies, BPC-157 has supported healing of tendon, ligament, muscle and gut tissue. Good human trials are still missing, so results in people are not established.'
    },
    {
      type: 'detail',
      eyebrow: 'How it is prescribed',
      heading: 'Injection, oral or topical.',
      body: 'BPC-157 can be prepared as an injection under the skin or into muscle, as an oral form or as a topical. Which form, how much and for how long is decided at your visit. A course is usually a set number of weeks with a check-in, not open-ended use.'
    },
    {
      type: 'detail',
      eyebrow: 'Status',
      heading: 'Compounded, pharmacy-prepared, not FDA-approved.',
      body: 'BPC-157 has never been FDA-approved. Under an October 2026 HHS policy, state-licensed pharmacies may compound it under strict sourcing, testing and labeling conditions. Apex prescribes it only that way, never from “research use only” sellers.'
    },
    {
      type: 'faq',
      heading: 'BPC-157 questions.',
      items: [
        { question: 'Is BPC-157 safe?', answer: 'Short-term side effects reported so far are usually mild, such as injection-site irritation, nausea or dizziness. Long-term safety in people has not been studied well. Because it may affect blood-vessel growth, it is not for anyone with active cancer or a history of it.' },
        { question: 'How fast does BPC-157 work?', answer: 'There is no reliable human data to give you a timeline. We set a defined course, check in, and stop if it is not helping.' },
        { question: 'Do I still need physical therapy?', answer: 'Usually, yes. Peptides do not replace rehab, load management or an orthopedic evaluation when an injury needs one.' },
        athleteFaq,
        costFaq
      ]
    },
    finalSection('Dealing with a nagging injury? Let’s talk it through.'),
    morePeptides('/peptide-therapy/bpc-157/')
  ]
};

export const tb500Page = {
  slug: '/peptide-therapy/tb-500/',
  modified: '2026-11-17',
  navLabel: 'TB-500',
  navParent: '/peptide-therapy/',
  title: 'TB-500 in Merrillville, IN | Peptide Therapy | Apex Wellness',
  description: 'TB-500 (thymosin beta-4 fragment) peptide therapy in Merrillville, Indiana. What it is, the evidence so far, how it is given and what to ask first.',
  eyebrow: 'Peptide therapy · TB-500',
  h1: 'TB-500 in Merrillville. What it is and what to expect.',
  intro: 'TB-500 is a lab-made fragment of thymosin beta-4, a protein the body uses in tissue repair and cell movement. People ask about it for muscle, tendon and soft-tissue recovery, often together with BPC-157. Here is the honest picture.',
  heroImage: 'clinic',
  cta: bookingCta,
  ctaNote,
  sections: [
    {
      type: 'options',
      eyebrow: 'Why people ask about it',
      heading: 'What brings people to TB-500.',
      items: [
        { title: 'Soft-tissue recovery', body: 'Muscle and tendon injuries, especially ones that keep flaring.' },
        { title: 'Training recovery', body: 'Active adults who want to keep moving while an injury settles.' },
        { title: 'Pairing with BPC-157', body: 'The two are often discussed together. See the Wolverine stack page.' }
      ],
      note: 'Research on thymosin beta-4 and its fragments is mostly in animals and the lab. Results in people are not established.'
    },
    {
      type: 'detail',
      eyebrow: 'How it is prescribed',
      heading: 'Injection only, for a set course.',
      body: 'TB-500 is given as an injection under the skin or into muscle. It is not prepared as a pill or cream. Dose, schedule and length of the course are set at your visit, with a check-in before anything continues.'
    },
    {
      type: 'detail',
      eyebrow: 'Status',
      heading: 'Compounded, pharmacy-prepared, not FDA-approved.',
      body: 'TB-500 has never been FDA-approved. Under an October 2026 HHS policy, state-licensed pharmacies may compound it for injection under strict sourcing, testing and labeling conditions. Apex prescribes it only that way.'
    },
    {
      type: 'faq',
      heading: 'TB-500 questions.',
      items: [
        { question: 'Is TB-500 the same as thymosin beta-4?', answer: 'Not exactly. TB-500 is a short synthetic piece of thymosin beta-4, the part thought to drive its repair activity.' },
        { question: 'What are the side effects?', answer: 'Reported effects include injection-site irritation, tiredness and headache. Long-term safety in people is not well studied, and it is not for anyone with active cancer or a history of it.' },
        athleteFaq,
        costFaq
      ]
    },
    finalSection('Want to know if TB-500 fits? Book a visit.'),
    morePeptides('/peptide-therapy/tb-500/')
  ]
};

export const wolverineStackPage = {
  slug: '/peptide-therapy/wolverine-stack/',
  modified: '2026-11-17',
  navLabel: 'Wolverine stack',
  navParent: '/peptide-therapy/',
  title: 'Wolverine Stack (BPC-157 + TB-500) in Merrillville, IN | Apex Wellness',
  description: 'The Wolverine stack is BPC-157 and TB-500 used together. How Apex Wellness in Merrillville approaches it, what the evidence shows and what to ask first.',
  eyebrow: 'Peptide therapy · Wolverine stack',
  h1: 'The Wolverine stack. Less superhero, more plan.',
  intro: 'The “Wolverine stack” is the internet’s name for using BPC-157 and TB-500 together for injury recovery. The name promises a lot. The reality is two separate peptides, each with early-stage evidence, used together under a clinician’s plan.',
  heroImage: 'clinic',
  cta: bookingCta,
  ctaNote,
  sections: [
    {
      type: 'options',
      eyebrow: 'What it is',
      heading: 'Two peptides, two prescriptions.',
      items: [
        { title: 'BPC-157', body: 'Studied in animals for tendon, ligament, muscle and gut healing.', },
        { title: 'TB-500', body: 'A fragment of thymosin beta-4, studied for tissue repair.' },
        { title: 'Kept separate', body: 'Each is compounded as its own product. Pre-mixed blends fall outside the HHS pharmacy conditions.' }
      ],
      note: 'There are no published human trials of the two peptides used together. People combine them because of how each works on its own. Both are compounded and not FDA-approved.'
    },
    {
      type: 'steps',
      eyebrow: 'How Apex approaches it',
      heading: 'One injury, one plan, a clear end point.',
      items: [
        { title: 'Look at the injury', body: 'What happened, how long it has lasted and whether it needs imaging or an orthopedic opinion first.' },
        { title: 'Decide on one or both', body: 'Sometimes one peptide is enough. Two is not automatically better.' },
        { title: 'Set the course', body: 'A defined number of weeks, how to inject safely and what to watch for.' },
        { title: 'Check in', body: 'Keep going, change course or stop, based on how you are actually doing.' }
      ]
    },
    {
      type: 'faq',
      heading: 'Wolverine stack questions.',
      items: [
        { question: 'Why is it called the Wolverine stack?', answer: 'It is a nickname from fitness forums, after the comic-book character who heals fast. It is marketing, not a medical term.' },
        { question: 'Can I buy it pre-mixed?', answer: 'Pre-mixed vials sold online are usually “research use only” products not made for people. Apex prescribes each peptide separately through a licensed compounding pharmacy.' },
        { question: 'Is it safe to combine them?', answer: 'Combined use has not been studied in people. That is one more reason to start with a visit and a defined course rather than open-ended use.' },
        athleteFaq,
        costFaq
      ]
    },
    finalSection('Hurt and tired of waiting? Start with a visit.'),
    morePeptides('/peptide-therapy/wolverine-stack/')
  ]
};

export const sermorelinPage = {
  slug: '/peptide-therapy/sermorelin/',
  modified: '2026-11-17',
  navLabel: 'Sermorelin',
  navParent: '/peptide-therapy/',
  title: 'Sermorelin in Merrillville, IN | Peptide Therapy | Apex Wellness',
  description: 'Sermorelin peptide therapy in Merrillville, Indiana. How it prompts the body’s own growth hormone release, who it may suit and what to ask before starting.',
  eyebrow: 'Peptide therapy · Sermorelin',
  h1: 'Sermorelin in Merrillville. Working with your body’s own signals.',
  intro: 'Sermorelin is a lab-made version of the first part of growth hormone–releasing hormone, the signal the brain uses to tell the pituitary gland to release growth hormone. Instead of giving growth hormone itself, it prompts your body to release its own.',
  heroImage: 'men',
  cta: bookingCta,
  ctaNote,
  sections: [
    {
      type: 'options',
      eyebrow: 'Why people ask about it',
      heading: 'What brings people to sermorelin.',
      items: [
        { title: 'Sleep quality', body: 'Growth hormone is released mostly during deep sleep.' },
        { title: 'Body composition', body: 'Interest in muscle, fat and recovery as the years add up.' },
        { title: 'Energy & recovery', body: 'Feeling slower to bounce back from training or long weeks.' }
      ],
      note: 'Sermorelin was once an FDA-approved drug for children with growth problems. It was taken off the market in 2008 for reasons unrelated to safety. Evidence for its use in healthy adults is limited, so results vary and are not promised.'
    },
    {
      type: 'detail',
      eyebrow: 'How it is prescribed',
      heading: 'A small nightly injection, with labs to guide it.',
      body: 'Sermorelin is usually a small injection under the skin at bedtime. Labs help set the starting point and check how your body responds. The plan includes a set review date.'
    },
    {
      type: 'faq',
      heading: 'Sermorelin questions.',
      items: [
        { question: 'Is sermorelin the same as growth hormone?', answer: 'No. It is a signal that prompts your own pituitary gland to release growth hormone, so your body’s normal feedback controls stay involved.' },
        { question: 'What are the side effects?', answer: 'The most common are redness or soreness where you inject, flushing and headache. It is not for anyone pregnant or with active cancer, and some thyroid and pituitary conditions need a closer look first.' },
        { question: 'Is sermorelin FDA-approved today?', answer: 'Not as a brand-name product. It is available as a compounded medication, prepared by a licensed pharmacy with a prescription in your name. Compounded drugs are not FDA-approved.' },
        athleteFaq,
        costFaq
      ]
    },
    finalSection('Wondering if sermorelin fits? Ask at your first visit.'),
    morePeptides('/peptide-therapy/sermorelin/')
  ]
};

export const gonadorelinPage = {
  slug: '/peptide-therapy/gonadorelin/',
  modified: '2026-11-17',
  navLabel: 'Gonadorelin',
  navParent: '/peptide-therapy/',
  title: 'Gonadorelin in Merrillville, IN | Men’s Hormone Care | Apex Wellness',
  description: 'Gonadorelin in Merrillville, Indiana. How this peptide supports the body’s own hormone signals in men’s hormone care, and what to ask at your visit.',
  eyebrow: 'Peptide therapy · Gonadorelin',
  h1: 'Gonadorelin in Merrillville. Support for your body’s own hormone signals.',
  intro: 'Gonadorelin is a lab-made version of gonadotropin-releasing hormone (GnRH), the brain’s signal that tells the pituitary gland to release LH and FSH. Those hormones in turn tell the testes to do their job. In men’s hormone care it is used to keep that natural signaling active.',
  heroImage: 'men',
  cta: bookingCta,
  ctaNote,
  sections: [
    {
      type: 'options',
      eyebrow: 'Why it comes up',
      heading: 'Where gonadorelin fits in men’s hormone care.',
      items: [
        { title: 'Keeping natural signals going', body: 'Some hormone treatments quiet the body’s own LH and FSH. Gonadorelin may help keep them active.' },
        { title: 'Testicular size & function', body: 'A common concern for men on hormone treatment.' },
        { title: 'Family planning questions', body: 'Fertility needs its own conversation. Tell us early if it matters to you.' }
      ],
      note: 'Evidence for this use comes mostly from smaller studies and clinical experience. It does not ensure fertility, and fertility concerns may need a specialist.'
    },
    {
      type: 'detail',
      eyebrow: 'How it is prescribed',
      heading: 'Small injections, checked with labs.',
      body: 'Gonadorelin is a small injection under the skin, often a few times a week. Because the body clears it quickly, timing matters. Follow-up labs show whether the plan is doing what it should.'
    },
    {
      type: 'faq',
      heading: 'Gonadorelin questions.',
      items: [
        { question: 'Is gonadorelin the same as hCG?', answer: 'No. hCG acts on the testes directly. Gonadorelin works one step earlier, on the pituitary gland. Which option, if any, fits you is a visit-level decision.' },
        { question: 'What are the side effects?', answer: 'Usually injection-site irritation, headache or flushing. Allergic reactions are rare. We go over what to watch for before you start.' },
        { question: 'Is it FDA-approved?', answer: 'Gonadorelin is available as a compounded medication, prepared by a licensed pharmacy with a prescription in your name. Compounded drugs are not FDA-approved.' },
        athleteFaq,
        costFaq
      ]
    },
    finalSection('Questions about your hormones? Start with a visit.'),
    {
      type: 'linkCards',
      eyebrow: 'Related care',
      heading: 'More on men’s hormone health.',
      items: [
        { title: 'Men’s hormone health', body: 'Symptoms, testing and how Apex approaches men’s hormone care.', label: 'Explore men’s hormone health', href: '/mens-hormone-health/' },
        { title: 'Peptide therapy overview', body: 'What peptides are and how a visit works.', label: 'Read the overview', href: '/peptide-therapy/' }
      ]
    }
  ]
};

export const peptidePages = Object.freeze({
  'peptide-therapy': peptideHubPage,
  'peptide-bpc-157': bpc157Page,
  'peptide-tb-500': tb500Page,
  'peptide-wolverine-stack': wolverineStackPage,
  'peptide-sermorelin': sermorelinPage,
  'peptide-gonadorelin': gonadorelinPage
});

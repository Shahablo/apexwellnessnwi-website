// Menopause series, part 1, adapted from the Instagram carousel posted November 23, 2026.
// Clinical copy: keep status "draft" until version-specific medical authorization is recorded
// (docs/editorial-publishing.md). When it is approved, set status to "published", set
// `published` and `modified` to the real release date, and the Women's HRT page link card
// (src/womens-hrt-page.mjs) turns on automatically.
export const menopauseSymptomsArticle = Object.freeze({
  slug: '/blog/menopause-symptoms-more-than-hot-flashes/',
  status: 'draft',
  editorialType: 'clinical-pending-authorization',
  title: 'Menopause Symptoms: More Than Hot Flashes | Apex Wellness Merrillville',
  description: 'Brain fog, 3 a.m. wake-ups and a shorter fuse can all be menopause. Learn the symptoms women are rarely told about and when to talk with a clinician.',
  eyebrow: 'Women’s hormone care',
  readTime: '4 minute read',
  h1: 'Brain fog. 3 a.m. wake-ups. A short fuse. It could be menopause.',
  intro: 'Most women know about hot flashes. Far fewer are told that trouble sleeping, losing words mid-sentence or feeling unusually irritable can come from the same hormone shift.\n\nThis is part one of our menopause series: the symptoms that rarely get connected to hormones, how long they can last, and when it makes sense to talk with a clinician.',
  excerpt: 'Hot flashes get the attention. Here are the menopause symptoms women are rarely told about, and when to bring them up.',
  published: '2026-11-23',
  modified: '2026-11-23',
  richText: true,
  category: 'Women’s Midlife Care',
  author: 'Apex Wellness Editorial Team',
  heroImage: 'women',
  relatedService: { label: 'Explore women’s hormone replacement therapy', href: '/womens-hormone-replacement-therapy/' },
  sections: [
    {
      heading: 'Hot flashes are only part of the picture',
      paragraphs: [
        'In a 2026 Gallup survey, only 37% of women said they understand menopause symptoms. That gap matters, because many symptoms do not look like “hormones” at first glance.',
        'Perimenopause, the years of hormone change before your final period, often starts in your 40s. Symptoms can begin well before periods stop.'
      ]
    },
    {
      heading: 'Symptoms people rarely blame on hormones',
      paragraphs: ['The National Institute on Aging lists changes that many women never connect to menopause:'],
      bullets: [
        'Trouble falling or staying asleep, including night sweats that wake you up',
        'Forgetfulness, trouble concentrating or losing your train of thought',
        'Feeling moodier, more irritable or more anxious than usual',
        'Joint and muscle aches'
      ]
    },
    {
      heading: 'And the ones that are harder to bring up',
      paragraphs: ['Some symptoms are easy to keep quiet about, even with a doctor:'],
      bullets: [
        'Periods that become irregular, heavier or lighter',
        'Vaginal dryness or pain during sex',
        'A lower sex drive',
        'Bladder leaks when you laugh, sneeze or exercise',
        'Weight that settles around the waist more easily'
      ],
      paragraphsAfterBullets: [
        'These are common, and they are worth a real conversation. You do not need to wait until they become unbearable.'
      ]
    },
    {
      heading: 'This is not a rough month',
      paragraphs: [
        'In the Study of Women’s Health Across the Nation (SWAN), hot flashes and night sweats lasted a median of 7.4 years. For some women they lasted longer.',
        'That is a long time to lose sleep or feel unlike yourself without asking whether something can help.'
      ]
    },
    {
      heading: 'Most women just push through it',
      paragraphs: [
        'A CDC report from October 2026 found that about half of women ages 40 to 60 had menopause symptoms, yet only about 1 in 6 took prescription medication for them.',
        'Treatment is not right for everyone. Still, many women never hear what their options are, which may include hormonal and non-hormonal approaches depending on their health history.'
      ]
    },
    {
      heading: 'When to talk with a clinician',
      paragraphs: [
        'Consider a visit if symptoms are affecting your sleep, work, relationships or how you feel day to day. Other conditions can cause similar symptoms, so a good evaluation looks at the whole picture rather than assuming everything is hormonal.',
        'Unexpected bleeding, especially after menopause, always needs medical evaluation.',
        'If you want to know what care could involve, our page on [women’s hormone replacement therapy](https://apexwellnessnwi.com/womens-hormone-replacement-therapy/) explains the symptoms we look at, potential benefits, risks and options. You can also [book online](https://apexwellnessnwi.com/founding-patients/) at our Merrillville clinic.'
      ]
    }
  ],
  sources: [
    { label: 'Gallup: Women Enter Menopause Without Clear Information (2026)', href: 'https://news.gallup.com/poll/714596/women-enter-menopause-without-clear-information.aspx' },
    { label: 'National Institute on Aging: What Is Menopause?', href: 'https://www.nia.nih.gov/health/menopause/what-menopause' },
    { label: 'Avis et al., Duration of Menopausal Vasomotor Symptoms (SWAN), JAMA Internal Medicine, 2015', href: 'https://pubmed.ncbi.nlm.nih.gov/25686030/' },
    { label: 'CDC NCHS Data Brief No. 575: Menopause symptoms and treatment (2026)', href: 'https://www.cdc.gov/nchs/products/databriefs/db575.htm' },
    { label: 'Apex Wellness: Women’s Hormone Replacement Therapy', href: 'https://apexwellnessnwi.com/womens-hormone-replacement-therapy/' }
  ],
  disclaimerHeading: 'About this article',
  disclaimer: 'This article provides general educational information and is not medical advice, diagnosis, or treatment. Individual risks and treatment decisions require evaluation by a qualified healthcare professional. Apex Wellness does not provide urgent or emergency care. Call 911 or go to the nearest emergency department for a medical emergency.',
  editorialNote: 'Prepared by the Apex Wellness Editorial Team and adapted from part one of our menopause series on Instagram. Statistics are attributed to the linked sources. No individual clinician review is claimed.',
  ctaBody: 'Read about women’s hormone replacement therapy at Apex.'
});

import { launchListClosedNote, nowOpenNote, clinicPhone } from './clinic-facts.mjs';

export const comingSoonStatusArticle = Object.freeze({
  slug: '/blog/what-coming-soon-means-at-apex/',
  status: 'published',
  editorialType: 'nonmedical',
  title: 'What “Coming Soon” Means at Apex Wellness, Merrillville | Apex Wellness',
  description: 'A plain status update from Apex Wellness: what is confirmed about the Merrillville clinic today, what is still being finalized, and how to book a visit.',
  eyebrow: 'Apex Wellness updates',
  readTime: '3 minute read',
  h1: '“Coming soon” is doing a lot of work. Here is what it means.',
  intro: 'A sign that says Coming soon raises more questions than it answers. Where? When? What kind of clinic? Can I book yet? This is the plain version, first published in October 2026, with the confirmed parts separated from the parts still being finalized.\n\nIf you read nothing else: Apex is a new medical clinic in Merrillville focused on four areas of care, the planned opening is November 20, 2026, subject to readiness, and online booking is open for visits from November 20.',
  excerpt: 'The confirmed facts about Apex Wellness in Merrillville, the parts still being finalized, and how to book a visit.',
  published: '2026-10-20',
  modified: '2026-11-23',
  updateNote: nowOpenNote,
  category: 'Apex Wellness Updates',
  author: 'Apex Wellness Editorial Team',
  heroImage: 'clinic',
  relatedService: { label: 'See how care is planned to work', href: '/how-it-works/' },
  sections: [
    {
      heading: 'Confirmed today',
      paragraphs: [
        'These are the parts that are settled.'
      ],
      bullets: [
        'The address: 8550 Broadway, Suite B, Merrillville, IN 46410.',
        'The four areas of care: weight and metabolic care, men’s hormone health, women’s midlife care, and hair-loss care for thinning and balding.',
        'The model: a cash-pay clinic. Apex will not bill insurance for its services, and final fees will be published on this site.',
        'The approach: an individual evaluation before any treatment is discussed. Nobody is handed a prescription at the door.',
        'The planned opening date: November 20, 2026, subject to readiness.',
        'Clinic hours from November 20: Wednesday, Thursday and Friday, 11 a.m. to 5 p.m., and Saturday, 9 a.m. to 1 p.m. Closed Sunday through Tuesday, and closed Thanksgiving Day, November 26.',
        `Booking: online booking is open. You can also call ${clinicPhone.display}.`
      ],
      paragraphsAfterBullets: [
        'A planned date is a target that depends on readiness: the clinical team, systems, supplies and the space itself. We will say so plainly if it moves.'
      ]
    },
    {
      heading: 'Still being finalized',
      paragraphs: [
        'Several things are not yet public because they are not yet final. We would rather publish them once than revise them three times.'
      ],
      bullets: [
        'Fees. The visit fee, how lab work is handled, and how any medication cost is shown separately.',
        'The care team. Clinician names and credentials will be published once they are confirmed, not before.',
        'The space. The interior images on this site are design previews, not photographs of the finished suite.'
      ]
    },
    {
      heading: 'What the Launch List does, and does not do',
      updateNote: launchListClosedNote,
      paragraphs: [
        'The Launch List asks for a name, email address and phone number. Apex may use that number for a limited manual follow-up about the signup or confirmed scheduling availability; the form does not authorize texts or automated calls. It is not an appointment request, a waitlist with a number, or a place to describe symptoms. Medical information belongs in a secure intake process after an appointment is confirmed, not in a form on a website.',
        'When something on the list above moves from “being finalized” to “confirmed,” the list is how we tell you. If you want to see the kind of email you would receive, the earlier article on what a launch list should ask for explains the standard we hold ourselves to.'
      ]
    },
    {
      heading: 'How to tell this update from the next one',
      paragraphs: [
        'This article is dated October 20, 2026. When facts change, we will update this page and change the modified date at the top, rather than leaving an old version live. If you are reading a cached or shared copy, check the live page for the current status.',
        'Apex Wellness is coming soon to 8550 Broadway, Suite B, Merrillville, IN 46410. Questions are welcome; please keep personal health details out of public comments and messages.'
      ]
    }
  ],
  sources: [
    { label: 'Apex Wellness: How It Works', href: 'https://apexwellnessnwi.com/how-it-works/' },
    { label: 'Apex Wellness: Pricing', href: 'https://apexwellnessnwi.com/pricing/' },
    { label: 'Apex Wellness: Book online', href: 'https://apexwellnessnwi.com/founding-patients/' },
    { label: 'Apex Wellness: A launch list needs your email, not your medical history', href: 'https://apexwellnessnwi.com/blog/launch-list-what-to-share/' }
  ],
  disclaimerHeading: 'About this update',
  disclaimer: 'This is a status update about a clinic that has not yet opened. It is not medical advice and does not describe services that are currently available. Planned dates depend on readiness.',
  editorialNote: 'Prepared by the Apex Wellness Editorial Team on October 20, 2026 and updated November 11 after the owner changed the planned opening date to November 20, subject to readiness. Updated November 16 after clinic hours were set and online booking opened. The hero image is a design preview of a consultation room, not a photograph of the finished Suite B space. No individual clinician review is claimed for this nonmedical update.',
  ctaBody: 'See how care is planned to work as the details above are confirmed.'
});

// Route orientation checked October 27, 2026 against the towns' road maps and
// GPTC's route listing. These pages do not promise a route, travel time, parking,
// transit stop at Apex, appointment, or additional clinic location.
const destination = '8550 Broadway, Suite B, Merrillville, IN 46410';
const directionsFrom = (origin) =>
  `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', origin, destination })}`;

const launchList = Object.freeze({ label: 'Get opening updates', href: '/founding-patients/' });

export const nearbyVisitPages = Object.freeze({
  munster: Object.freeze({
    slug: '/visit-from-munster/', navLabel: 'From Munster', modified: '2026-10-27',
    title: 'From Munster to Apex Wellness in Merrillville | Visit Details',
    description: 'Coming from Munster? Apex Wellness is preparing one in-person clinic in Merrillville. Save the Suite B address, check your route and get opening updates.',
    eyebrow: 'For Munster neighbors · Coming soon',
    h1: 'From Munster, find us in Merrillville.',
    intro: 'Apex Wellness is preparing for in-person visits at 8550 Broadway, Suite B, in Merrillville. If you live or work in Munster, that is the one Apex location to save. Scheduling is not open yet, but you can follow the opening updates.',
    heroImage: 'behindPosters',
    cta: launchList,
    secondaryCta: { label: 'Directions from Munster', href: directionsFrom('Munster, IN') },
    ctaNote: 'Coming soon. No appointment is booked by joining the list. Photo: posters in the Apex Merrillville windows, October 2026.',
    sections: [
      { type: 'detail', eyebrow: 'A Munster starting point', heading: 'Use your own address for the last mile.', body: 'Calumet Avenue connects Munster to the US 30 corridor, which continues toward Merrillville. Your best route depends on where in Munster you start and current road conditions. The directions button opens a live route from Munster to the exact Suite B address; enter your own starting address for a route that fits your trip.' },
      { type: 'linkCards', eyebrow: 'Before a future visit', heading: 'Keep the useful details together.', items: [
        { title: 'Check the drive', body: 'Start with Munster, then replace the map origin with your actual address. No townwide drive time is promised.', href: directionsFrom('Munster, IN'), label: 'Open live directions' },
        { title: 'Considering transit?', body: 'Check current GPTC routes and the final part of the trip yourself. Apex has not verified a direct Munster-to-Suite B connection.', href: 'https://gptcbus.com/routes/', label: 'Check GPTC routes' },
        { title: 'One clinic address', body: 'See the Merrillville location, planned in-person format and what Apex still needs to confirm before visits begin.', href: '/merrillville/', label: 'See our location' }
      ] },
      { type: 'faq', heading: 'Questions from Munster', items: [
        { question: 'Does Apex have a Munster office?', answer: 'No. Apex is preparing one clinic at 8550 Broadway, Suite B, Merrillville, IN 46410. This page helps Munster visitors plan for that location.' },
        { question: 'Can I reserve a visit from this page?', answer: 'Not yet. Scheduling is not open. The Launch List shares confirmed opening and booking updates; it does not reserve an appointment or establish care.' }
      ] }
    ]
  }),
  crownPoint: Object.freeze({
    slug: '/visit-from-crown-point/', navLabel: 'From Crown Point', modified: '2026-10-27',
    title: 'From Crown Point to Apex Wellness | Merrillville Visit Details',
    description: 'Crown Point visitors can find Apex Wellness at its one coming-soon Merrillville clinic on Broadway. Check a live route, current transit and opening updates.',
    eyebrow: 'For Crown Point neighbors · Coming soon',
    h1: 'Crown Point to Apex: find the right Broadway address.',
    intro: 'Broadway runs through Crown Point and toward Merrillville. Apex is preparing one clinic farther north at 8550 Broadway, Suite B, Merrillville. Save the full address before a future visit; appointment scheduling is not open yet.',
    heroImage: 'behindWindow',
    cta: launchList,
    secondaryCta: { label: 'Directions from Crown Point', href: directionsFrom('Crown Point, IN') },
    ctaNote: 'Coming soon. Directions are for planning, not a booked visit. Photo: Shahab preparing the Apex storefront in Merrillville, October 2026.',
    sections: [
      { type: 'detail', eyebrow: 'The Broadway connection', heading: 'One road name, one Apex address.', body: 'Crown Point’s street map labels Broadway/State Road 53. Apex’s planned clinic is on Broadway in Merrillville, so the town name and Suite B matter when you enter directions. Check the live route for your starting point and any roadwork instead of relying on a fixed travel-time estimate.' },
      { type: 'linkCards', eyebrow: 'Drive or transit', heading: 'Choose the trip you can verify.', items: [
        { title: 'Driving from Crown Point', body: 'Open current directions to the exact Merrillville address, then replace the suggested origin with your own starting point.', href: directionsFrom('Crown Point, IN'), label: 'Open live directions' },
        { title: 'Checking the Broadway bus', body: 'GPTC lists Broadway Metro Express service through Crown Point and Merrillville. Confirm the current schedule, nearest stop and final walking route; Apex has not verified a stop at Suite B.', href: 'https://gptcbus.com/routes/', label: 'Check GPTC service' },
        { title: 'The actual clinic', body: 'See the one Merrillville location and what arrival details remain to be confirmed before scheduling opens.', href: '/merrillville/', label: 'See our location' }
      ] },
      { type: 'faq', heading: 'Questions from Crown Point', items: [
        { question: 'Is Apex located in Crown Point?', answer: 'No. Apex has one planned clinic at 8550 Broadway, Suite B, Merrillville, IN 46410. This page is for people coming from Crown Point.' },
        { question: 'Will the Broadway bus drop me at the clinic?', answer: 'We have not verified a stop or accessible final walk at Suite B. Check GPTC’s current route information before planning a transit trip. Apex will share confirmed arrival details before appointments begin.' }
      ] }
    ]
  }),
  schererville: Object.freeze({
    slug: '/visit-from-schererville/', navLabel: 'From Schererville', modified: '2026-10-27',
    title: 'From Schererville to Apex Wellness | Merrillville Location',
    description: 'Starting in Schererville? Compare live routes from the US 41/US 30 crossroads or downtown to Apex Wellness at its one Merrillville clinic.',
    eyebrow: 'For Schererville neighbors · Coming soon',
    h1: 'Coming from Schererville? Start where you are.',
    intro: 'A route from the US 41/US 30 crossroads may look different from one starting in downtown Schererville. Both lead to the same planned Apex clinic at 8550 Broadway, Suite B, Merrillville. Use a live map before traveling; visits are not being scheduled yet.',
    heroImage: 'behindPosters',
    cta: launchList,
    secondaryCta: { label: 'Directions from Schererville', href: directionsFrom('Schererville, IN') },
    ctaNote: 'Coming soon. No appointment is booked by joining the list. Photo: posters in the Apex Merrillville windows, October 2026.',
    sections: [
      { type: 'detail', eyebrow: 'Two starting points', heading: 'Pick the route that fits your part of town.', body: 'Schererville’s US 41/US 30 crossroads connects with US 30 toward Merrillville. Downtown near Town Hall is a different starting point, so a single townwide travel estimate would be misleading. Open the example that is closest to you, then enter your own address and check current conditions.' },
      { type: 'linkCards', eyebrow: 'Compare live directions', heading: 'Start with a place you recognize.', items: [
        { title: 'US 41 and US 30 crossroads', body: 'Use this familiar Schererville junction as a map origin and adjust it to your actual location.', href: directionsFrom('US 41 and US 30, Schererville, IN'), label: 'Open crossroads route' },
        { title: 'Downtown near Town Hall', body: 'Start near 10 E Joliet Street in Schererville, then adjust the map origin before you travel.', href: directionsFrom('10 E Joliet St, Schererville, IN'), label: 'Open downtown route' },
        { title: 'Where the trip ends', body: 'Apex is preparing one Merrillville office, not a Schererville branch. See the confirmed address and opening status.', href: '/merrillville/', label: 'See our location' }
      ] },
      { type: 'faq', heading: 'Questions from Schererville', items: [
        { question: 'Is there an Apex office at the US 41/US 30 crossroads?', answer: 'No. The crossroads is only a suggested starting point for directions. Apex’s one planned office is at 8550 Broadway, Suite B, Merrillville, IN 46410.' },
        { question: 'How long will it take to get there?', answer: 'That depends on your starting point and current conditions. Use the live directions above; Apex is not publishing a single drive time for all of Schererville. Scheduling is not open yet.' }
      ] }
    ]
  })
});

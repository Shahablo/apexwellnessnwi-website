// Owner-confirmed November 16, 2026. One place for the booking, hours and offer
// facts that several pages repeat. Pexy (src/assets/site-help.mjs) cannot import
// modules, so its copies are checked against this file in tests/site-help.test.mjs.
export const openingDay = Object.freeze({ date: '2026-11-20', label: 'Friday, November 20, 2026' });

// The clinic opens on opening day; online booking for visits from that day is already open.
export const bookingStatus = 'Online booking is open for visits from November 20.';

// Dated note for the articles written about the Launch List. The signup left the website on November 16, 2026.
export const launchListClosedNote = Object.freeze({
  text: `Update, November 16, 2026: the Launch List is closed to new signups. ${bookingStatus}`,
  linkLabel: 'Book online',
  href: '/founding-patients/'
});

export const clinicHours = Object.freeze({
  heading: 'Hours from November 20',
  rows: Object.freeze([
    Object.freeze({ days: Object.freeze(['Wednesday', 'Thursday', 'Friday']), label: 'Wednesday, Thursday and Friday', opens: '11:00', closes: '17:00', hours: '11 a.m. to 5 p.m.' }),
    Object.freeze({ days: Object.freeze(['Saturday']), label: 'Saturday', opens: '09:00', closes: '13:00', hours: '9 a.m. to 1 p.m.' })
  ]),
  closed: 'Closed Sunday through Tuesday.',
  holiday: Object.freeze({ date: '2026-11-26', note: 'Closed Thanksgiving Day, November 26.' }),
  sentence: 'Hours from November 20: Wednesday, Thursday and Friday, 11 a.m. to 5 p.m. Saturday, 9 a.m. to 1 p.m. Closed Sunday through Tuesday. Closed Thanksgiving Day, November 26.'
});

// The fine print is the reviewed offer wording. Do not list the labs or call the offer anything but $49.
export const grandOpeningOffer = Object.freeze({
  headline: 'Grand opening: $49 for labs and your first visit',
  limit: 'First 50 appointments scheduled.',
  finePrint: '$49 covers your first visit and the promotional labs. Labs as clinically appropriate. One per person. First 50 appointments scheduled. Additional testing or treatment is separate. Appointments subject to availability.'
});

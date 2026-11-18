// Pexy answers from verified public information in the browser. A separate,
// opt-in form can send a retyped general question to Apex for human follow-up.
// Keep answers and destinations aligned with current site content before each release.
// Booking, hours and offer wording mirror src/clinic-facts.mjs (this file is compiled into a
// browser script and cannot import it); tests/site-help.test.mjs checks that they match.
export function shouldOfferPexy({ elapsedMs, desktop, topExit = false, engaged = false, pageVisible = true, available = true }) {
  return desktop && pageVisible && available &&
    ((topExit && elapsedMs >= 15000) || (engaged && elapsedMs >= 40000));
}

export function pexyNudgeCopy(pathname = '/') {
  if (/^\/pricing\/?$/.test(pathname)) return 'Prices are being finalized. I can tell you what is confirmed now and where updates will appear.';
  if (/^\/founding-patients\/?$/.test(pathname)) return 'Questions about the $49 promotional labs offer? I can explain the terms and how to book.';
  if (/^\/plan-your-visit\/?$/.test(pathname)) return 'Wondering how to book a first visit? I can explain online booking and the contact request form. A request does not book a time.';
  return 'Need a quick answer? I can help with opening plans, care areas, booking, clinic hours, and pricing updates.';
}

export function answerWebsiteQuestion(input, launchLabel = 'November 20, 2026') {
  const question = String(input || '').slice(0, 500).toLowerCase().normalize('NFKC');
  const plannedDate = String(launchLabel).replace(/\s*\(.*\)$/, '');
  const result = (text, label, href, followupEligible = false) => ({ text, label, href, followupEligible });
  const asks = (pattern) => pattern.test(question);
  const launchOffer = 'Apex’s grand-opening offer is promotional labs for $49 for the first 50 appointments scheduled. The $49 covers your first visit and the promotional labs. Labs as clinically appropriate. One per person. Additional testing or treatment is separate. Appointments subject to availability.';
  const bookingOpen = 'Online booking is open for visits from November 20.';
  const clinicHours = 'Hours from November 20: Wednesday, Thursday and Friday, 11 a.m. to 5 p.m. Saturday, 9 a.m. to 1 p.m. Closed Sunday through Tuesday. Closed Thanksgiving Day, November 26.';

  // Safety and privacy take priority over promotional or navigation answers.
  if (asks(/\b(emergency|chest pain|trouble breathing|cannot breathe|can't breathe|suicid\w*|overdose|stroke)\b/)) {
    return result('Pexy is not monitored and cannot assess an emergency. If you may be experiencing a medical emergency, call 911 or go to the nearest emergency department.', 'Website medical notice', '/faq/');
  }
  if (asks(/\b(my (symptoms?|labs?|tests?|results?|dose|medications?|diagnosis|condition|history)|i (have|feel|take|am taking|am pregnant)|am i (eligible|a candidate|pregnant)|should i|can i take|what dose|dosage|diagnos\w*|side effects?|test results|prescribe me|is it safe for me)\b/) ||
      asks(/\b(?:my|i|me|our|we)\b.{0,80}\b(?:pain|injur\w*|sick|ill|dizz\w*|fever|nausea|headache|rash|disease|symptom\w*|lab\w*|result\w*|medicat\w*|diagnos\w*|treat\w*|pregnan\w*|prescript\w*)\b/) ||
      asks(/\b(?:dizziness|fever|nausea|headache|rash|shortness of breath|blood pressure|medical record|patient history)\b/)) {
    return result('That needs a qualified clinician who knows your situation. Pexy cannot assess symptoms, interpret results, recommend medication, or decide whether care fits you. Please do not put medical details in this chat. For an urgent concern, seek timely medical care.', 'About care and eligibility', '/faq/');
  }
  if (asks(/\b(delete|unsubscribe|remove my|stop emails|opt out|data request)\b/)) {
    return result('Pexy cannot change your preferences and has not submitted a request for you. You can use the unsubscribe link in an Apex promotional email. For another data request, follow the contact route in the privacy policy.', 'Privacy and contact requests', '/privacy/');
  }
  if (asks(/\b(?:talk|speak)\s+to\s+(?:a\s+)?(?:person|human|someone|staff|team)\b/)) {
    return result('You can call or text (219) 207-2456, or email hello@apexwellnessnwi.com with general questions. Please do not send medical records or sensitive health details through those public contact routes. Pexy does not automatically forward your question to staff.', 'Contact and location', '/merrillville/');
  }
  if (asks(/\b(privacy|data|store|save|ai|bot|human|person|chat|recorded|monitored)\b/)) {
    return result('I’m Pexy, an automated website guide with a fixed set of answers. I am not a person or clinician. Your question to Pexy stays in this page and is not sent to Apex or an AI service. If I cannot answer a general question, you can separately ask the team to reply using a short form. Only what you type into that form is sent.', 'Read the privacy policy', '/privacy/');
  }

  // Distinguish the public offer, online booking, contact request, and email list. Only online booking or a call books a visit.
  // Questions that reuse wording from earlier printed materials still route to the current offer.
  if (asks(/\$\s?49\b/) || asks(/\b(49 dollars?|first (?:50|fifty)|50 appointments?|promotional labs?|promo(?:tional|tion)? (?:offer|pricing|price|deal|special)|promos?|promotions?|labs? (?:offer|special|deal)|launch offer|grand.?opening|opening offer|poster offer|first (?:100|hundred)|(?:100|hundred) assessments?|free (?:initial |wellness )?assessments?|selected (?:baseline )?labs?)\b/)) {
    return result(`${launchOffer} To schedule, use the Book online button on the offer page or call (219) 207-2456. Sending a contact request does not reserve the offer or an appointment.`, 'Offer terms and Book online', '/founding-patients/');
  }
  if (asks(/\b(appointment|book|booking|schedule|scheduling|reserve|visit request|request a visit|first visit|consultation|tebra|walk.?in)\b/)) {
    return result(`${bookingOpen} Use the Book online button on the Plan Your Visit page, or call (219) 207-2456. That page also has a contact request form for manual follow-up. The form asks for name, email, phone, and separate contact consent; it does not book a time, start clinical intake, or reserve the $49 promotional labs offer. Please keep medical details out of the form.`, 'Plan your visit and book online', '/plan-your-visit/');
  }
  if (asks(/\b(launch list|sign ?up|join|newsletter|email updates|opening updates|founding patients|qr code|qr)\b/)) {
    return result(`${bookingOpen} To book, use the Book online button on the booking page or call (219) 207-2456. The printed Apex QR code leads to this page.`, 'Book online', '/founding-patients/');
  }

  if (asks(/\b(labs?|blood ?work|tests?|testing)\b/) && asks(/\b(included|free|covered|cost)\b/)) {
    return result(`${launchOffer} Outside the grand-opening offer, do not assume testing is included in a visit fee; final pricing will explain any separate costs. Pexy cannot determine which tests anyone needs.`, '$49 promotional labs details', '/founding-patients/');
  }
  if (asks(/\b(price|pricing|cost|fees?|payment|pay|cash|insurance|medicare|medicaid|afford|included|billing)\b/)) {
    return result('Apex plans to be cash-pay. The final prices, what each fee includes, payment details, and any separate testing, medication, or outside costs are not public yet. They will be posted on the Pricing page. No insurance coverage or reimbursement is promised.', 'Pricing and what to expect', '/pricing/');
  }
  if (asks(/\b(call|text|phone|email|contact|reach|talk to (?:someone|staff)|speak to (?:someone|staff))\b/)) {
    return result('You can call or text (219) 207-2456, or email hello@apexwellnessnwi.com with general questions. Please do not send medical records or sensitive health details through those public contact routes. Pexy does not automatically forward your question to staff.', 'Contact and location', '/merrillville/');
  }
  if (asks(/\b(hours?|thanksgiving|holidays?|weekends?|(?:mon|tues|wednes|thurs|fri|satur|sun)days?)\b/)) {
    return result(`${clinicHours} Apex opens ${plannedDate}. ${bookingOpen}`, 'Location and clinic hours', '/merrillville/');
  }
  if (asks(/\b(parking|directions?|where|location|address|merrillville|suite|near me|telehealth|virtual|remote|in.person)\b/)) {
    return result(`8550 Broadway, Suite B, Merrillville, IN 46410. Apex opens ${plannedDate}. Visits are in person; telehealth is not offered. ${clinicHours} Parking details have not been announced. ${bookingOpen}`, 'Location and visit details', '/merrillville/');
  }
  if (asks(/\b(open|opening|launch|november|date|when)\b/)) {
    return result(`Apex opens ${plannedDate} in Merrillville. ${bookingOpen} Use the Book online button on the booking page or call (219) 207-2456.`, 'Book online', '/founding-patients/');
  }
  if (asks(/\b(accessib\w*|screen reader|website problem|site problem)\b/)) {
    return result('If something on the website is hard to use, the accessibility page explains how to report it. Pexy cannot send a report for you, so please use the contact route on that page.', 'Website accessibility', '/accessibility/');
  }
  if (asks(/\b(cancel\w*|reschedul\w*|polic(?:y|ies)|terms)\b/)) {
    return result('To change or cancel a visit you booked, call (219) 207-2456. You can read the current website policies; final cancellation and payment terms will be shared before you pay.', 'Cancellation and refunds', '/cancellation-refunds/');
  }
  if (asks(/\b(who|physician|doctor|clinician|provider|team|founder|shahab)\b/)) {
    return result('Apex was founded by Shahab Siddique. The confirmed care team, roles and credentials will be shared on the About page. Pexy cannot identify a clinician for a visit.', 'Meet the founder', '/about/');
  }

  // Care-area answers describe the existing public pages, not individual eligibility or treatment.
  if (asks(/\b(hair|balding|alopecia|thinning)\b/)) {
    return result('Hair-loss care is one of the areas Apex offers adults. The page introduces the approach; specific treatment and fees are decided after a visit. Online booking is open for visits from November 20. Pexy cannot assess a personal hair-loss concern.', 'Explore hair-loss care', '/hair-loss-care/');
  }
  if (asks(/\b(menopause|perimenopause|women|woman|midlife)\b/)) {
    return result('Women’s midlife care is an Apex care area. The page explains the intended focus on individual evaluation and discussion of options. Any care decision depends on an evaluation. Online booking is open for visits from November 20.', 'Explore women’s midlife care', '/womens-midlife-care/');
  }
  if (asks(/\b(testosterone|trt|men|man|male hormones?)\b/)) {
    return result('Men’s hormone health is an Apex care area. The page describes an evaluation-first approach. No prescription, treatment, or eligibility is guaranteed. Online booking is open for visits from November 20.', 'Explore men’s hormone health', '/mens-hormone-health/');
  }
  if (asks(/\b(weight|glp|semaglutide|tirzepatide|metabolic|ozempic|wegovy|zepbound|medications?|prescriptions?)\b/)) {
    return result('Weight and metabolic care is an Apex care area. Specific medications, prescriptions, eligibility, and outcomes cannot be promised through this site. The care page explains the evaluation-first approach. Online booking is open for visits from November 20.', 'Explore weight and metabolic care', '/weight-management/');
  }
  if (asks(/\b(labs?|blood ?work|tests?|testing)\b/)) {
    return result(`Testing decisions depend on a future clinical evaluation. ${launchOffer} Pexy cannot decide which tests someone needs.`, 'Read the offer terms', '/founding-patients/');
  }
  if (asks(/\b(eligible|qualify|candidate|age|adult|children|child|teen|pediatric|refer\w*|primary care|urgent care)\b/)) {
    return result('Apex offers focused care for adults. A qualified clinician determines whether a service fits a person’s needs; Pexy cannot prequalify anyone. Apex will not replace primary, specialist, urgent, or emergency care.', 'How care works', '/how-it-works/');
  }
  if (asks(/\b(service|care|offer|hormone|treat|what do you do)\b/)) {
    return result('Apex offers care in Merrillville for weight and metabolic health, men’s hormone health, women’s midlife care, hair loss and peptide therapy. Online booking is open for visits from November 20.', 'Explore the care areas', '/how-it-works/');
  }

  return result('I do not have a verified answer to that one, and I would rather say so than guess. You can browse the FAQs or ask the Apex team to follow up about a general website question. Please leave medical or personal health details out of the form.', 'Browse all FAQs', '/faq/', true);
}

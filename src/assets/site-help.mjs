// Deliberately local, fixed answers: never infer eligibility or generate medical advice.
export function answerWebsiteQuestion(input, launchLabel = 'November 1, 2026') {
  const question = String(input || '').slice(0, 500).toLowerCase().normalize('NFKC');
  const result = (text, label, href) => ({ text, label, href });
  if (/\b(emergency|chest pain|trouble breathing|cannot breathe|can't breathe|suicid\w*|overdose|stroke)\b/.test(question)) {
    return result('This website guide cannot assess emergencies and is not monitored. If you may be experiencing a medical emergency, call 911 or go to the nearest emergency department.', 'Website medical notice', '/faq/');
  }
  if (/\b(my (symptoms?|labs?|test|dose|medication|diagnosis)|i (have|feel|take|am taking)|should i|can i take|dose|dosage|diagnos\w*|side effects?|pregnan\w*|test results|prescribe me)\b/.test(question)) {
    return result('I can help with website information, but I cannot assess symptoms, interpret tests, recommend a treatment, or decide whether care is appropriate for you. Please do not share medical details here. Contact a qualified healthcare professional who knows your circumstances.', 'Care and eligibility FAQ', '/faq/');
  }
  if (/\b(delete|unsubscribe|remove my|stop emails|opt out)\b/.test(question)) {
    return result('Use the unsubscribe option in an Apex promotional email to stop those emails. For a prelaunch data request, the privacy policy explains the website-support contact pathway. This guide cannot change your preferences or delete records and has not submitted a request for you.', 'Privacy and contact requests', '/privacy/');
  }
  if (/\b(privacy|data|store|save|ai|bot|human|person|chat)\b/.test(question)) {
    return result('I am an automated website guide with fixed informational answers—not a clinician or live staff member. Your question is processed only in this page, is not saved by this guide, and is not sent to Apex or an AI service. The separate launch form does save the information you choose to submit with consent.', 'Read the privacy policy', '/privacy/');
  }
  if (/\b(launch list|sign ?up|join|book|appointment|consultation|schedule|intake)\b/.test(question)) {
    return result('Join the free launch list with your name, email, and contact permission. Apex may email opening information and future consultation availability. It is not a booking, medical intake, guaranteed priority, or acceptance as a patient. No payment is collected.', 'Join the launch list', '/founding-patients/');
  }
  if (/\b(open|opening|launch|november|date|when)\b/.test(question)) {
    return result(`The planned launch is ${launchLabel}. Apex is not open for appointments yet, and the date may change. Join the launch list for opening updates and future consultation availability.`, 'Get opening updates', '/founding-patients/');
  }
  if (/\b(price|pricing|cost|fee|pay|insurance|cash|medicare|medicaid|afford)\b/.test(question)) {
    return result('Joining the launch list is free. The planned care model is cash-pay; final fees, what is included, and any separate medication or testing costs will be published before scheduling or payment opens. No insurance coverage or reimbursement is promised.', 'Pricing and what to expect', '/pricing/');
  }
  if (/\b(where|location|address|merrillville|hours|parking|phone|email|contact|telehealth|virtual)\b/.test(question)) {
    return result('Apex is preparing to open at 8560 Broadway, Merrillville, IN 46410. Appointments are not yet available. Contact channels, hours, parking, accessibility details, and visit arrangements will be published before scheduling opens. The website form currently accepts requests for future contact only.', 'Location and practice details', '/about/');
  }
  if (/\b(who|physician|doctor|team|bakhsh|muhammad|founder)\b/.test(question)) {
    return result('Apex is physician-led by Wajeeh Bakhsh, MD, and Atif Muhammad, MD. Meet them and Shahab Siddique on the About page. Detailed clinical responsibilities and individual appointment availability will be shared as opening preparations continue.', 'Meet the people behind Apex', '/about/');
  }
  if (/\b(menopause|perimenopause|women|woman|midlife)\b/.test(question)) {
    return result('Planned women’s midlife care includes individualized discussion of perimenopause, menopause, and metabolic concerns. This guide cannot determine whether any particular treatment is appropriate or available for you.', 'Explore women’s midlife care', '/womens-midlife-care/');
  }
  if (/\b(testosterone|trt|men|man)\b/.test(question)) {
    return result('Planned men’s hormone care starts with a thoughtful evaluation and appropriate testing. Treatment is considered only after a clinical review; a consultation does not guarantee a prescription.', 'Explore men’s hormone health', '/mens-hormone-health/');
  }
  if (/\b(weight|glp|semaglutide|tirzepatide|metabolic|ozempic|wegovy|zepbound)\b/.test(question)) {
    return result('Apex is planning physician-led weight and metabolic care with individual evaluation, habits, monitoring, and medication only when clinically appropriate. No medication, prescription, outcome, or treatment eligibility is guaranteed.', 'Explore weight and metabolic care', '/weight-management/');
  }
  if (/\b(service|care|offer|hormone|treat)\b/.test(question)) {
    return result('The three planned care areas are medical weight and metabolic care, men’s hormone health, and women’s midlife hormone and metabolic care. Apex is not a substitute for primary, specialist, urgent, or emergency care.', 'How care is planned to work', '/how-it-works/');
  }
  return result('I do not have a verified answer to that question. I can help with opening plans, care areas, pricing status, physician leadership, and the launch list. Please do not enter personal or medical information.', 'Browse all FAQs', '/faq/');
}

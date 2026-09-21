(() => {
'use strict';
// Deliberately local, fixed answers: never infer eligibility or generate medical advice.
function answerWebsiteQuestion(input, launchLabel = 'November 1, 2026') {
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
    return result('Join the Launch List with your name, email, and contact permission. Find launch updates at apexwellnessnwi.com.', 'Join the launch list', '/founding-patients/');
  }
  if (/\b(open|opening|launch|november|date|when)\b/.test(question)) {
    return result(`The planned launch is ${launchLabel}. Coming soon to Merrillville. Find launch updates at apexwellnessnwi.com.`, 'Get opening updates', '/founding-patients/');
  }
  if (/\b(price|pricing|cost|fee|pay|insurance|cash|medicare|medicaid|afford)\b/.test(question)) {
    return result('Joining the launch list is free. The care model is cash-pay; final fees, what is included, and any separate medication or testing costs will be published before scheduling or payment opens. No insurance coverage or reimbursement is promised.', 'Pricing and what to expect', '/pricing/');
  }
  if (/\b(where|location|address|merrillville|hours|parking|phone|email|contact|telehealth|virtual)\b/.test(question)) {
    return result('Coming soon to 8550 Broadway, Suite B, Merrillville, IN 46410. Find launch updates at apexwellnessnwi.com.', 'Location and practice details', '/about/');
  }
  if (/\b(who|physician|doctor|team|muhammad|founder)\b/.test(question)) {
    return result('Apex is physician-led by Atif Muhammad, MD. Meet Atif and Shahab Siddique on the About page. ', 'Meet the people behind Apex', '/about/');
  }
  if (/\b(hair|balding|alopecia)\b/.test(question)) {
    return result('Physician-led hair-loss care is part of Apex’s planned offering. Coming soon; specific treatment options and fees will be published before scheduling opens. This guide cannot assess hair loss or recommend treatment.', 'Explore planned hair-loss care', '/hair-loss-care/');
  }
  if (/\b(menopause|perimenopause|women|woman|midlife)\b/.test(question)) {
    return result('Women’s midlife care includes individualized discussion of perimenopause, menopause, and metabolic concerns. This guide cannot determine whether any particular treatment is appropriate or available for you.', 'Explore women’s midlife care', '/womens-midlife-care/');
  }
  if (/\b(testosterone|trt|men|man)\b/.test(question)) {
    return result('Men’s hormone care starts with a thoughtful evaluation and appropriate testing. Treatment is considered only after a clinical review; a consultation does not guarantee a prescription.', 'Explore men’s hormone health', '/mens-hormone-health/');
  }
  if (/\b(weight|glp|semaglutide|tirzepatide|metabolic|ozempic|wegovy|zepbound)\b/.test(question)) {
    return result('Apex’s approach is physician-led weight and metabolic care with individual evaluation, habits, monitoring, and medication only when clinically appropriate. No medication, prescription, outcome, or treatment eligibility is guaranteed.', 'Explore weight and metabolic care', '/weight-management/');
  }
  if (/\b(service|care|offer|hormone|treat)\b/.test(question)) {
    return result('The planned care areas are medical weight and metabolic care, men’s hormone health, women’s midlife care, and hair-loss care. Apex is not a substitute for primary, specialist, urgent, or emergency care.', 'Explore our approach to care', '/how-it-works/');
  }
  return result('I do not have a verified answer to that question. I can help with opening plans, care areas, pricing status, physician leadership, and the launch list. Please do not enter personal or medical information.', 'Browse all FAQs', '/faq/');
}


const widget = document.querySelector('.site-help');
const toggle = document.querySelector('#help-toggle');
const panel = document.querySelector('#site-help-panel');
const input = document.querySelector('#help-question');
const answer = document.querySelector('#help-answer');
const launchPrompt = document.querySelector('#launch-prompt');
const dismissalKey = 'apex-launch-invitation-dismissed-v1';

function dismissInvitation() {
  if (launchPrompt) launchPrompt.hidden = true;
  try { sessionStorage.setItem(dismissalKey, 'true'); } catch { /* Optional preference only. */ }
}

function setOpen(open, restoreFocus = false) {
  if (!panel || !toggle) return;
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  if (open) {
    if (launchPrompt) launchPrompt.hidden = true;
    input.focus();
  } else {
    input.value = '';
    answer.replaceChildren();
    const greeting = document.createElement('p');
    greeting.textContent = 'Ask about opening plans, care areas, pricing, or the launch list.';
    answer.append(greeting);
    if (restoreFocus) toggle.focus();
  }
}

function respond(question) {
  const response = answerWebsiteQuestion(question, widget.dataset.launchLabel);
  const paragraph = document.createElement('p');
  paragraph.textContent = response.text;
  const link = document.createElement('a');
  link.textContent = response.label;
  link.href = response.href;
  answer.replaceChildren(paragraph, link);
  input.value = '';
}

if (widget && toggle && panel && input && answer) {
  toggle.hidden = false;
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  document.querySelector('#help-close').addEventListener('click', () => setOpen(false, true));
  document.querySelector('#site-help-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value.trim()) respond(input.value);
  });
  document.querySelectorAll('[data-help-question]').forEach((button) => {
    button.addEventListener('click', () => respond(button.dataset.helpQuestion));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false, true);
  });
  // Keep fixed controls away from the actual signup form and its feedback.
  const form = document.querySelector('#consultation-request');
  if (form && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      const hadFocus = widget.contains(document.activeElement);
      toggle.hidden = entry.isIntersecting;
      if (entry.isIntersecting) {
        setOpen(false);
        if (hadFocus) form.focus({ preventScroll: true });
      }
    }, { threshold: 0.05 }).observe(form);
  }
}

if (launchPrompt) {
  let dismissed = false;
  try { dismissed = sessionStorage.getItem(dismissalKey) === 'true'; } catch { /* Storage may be blocked. */ }
  document.querySelector('#dismiss-launch').addEventListener('click', dismissInvitation);
  if (!dismissed) {
    const showAfterEngagement = () => {
      const progressed = window.scrollY > Math.min(500, window.innerHeight * 0.65);
      if (!progressed) return;
      window.removeEventListener('scroll', showAfterEngagement);
      if (panel?.hidden && !document.activeElement?.matches('input, textarea, select')) launchPrompt.hidden = false;
    };
    window.addEventListener('scroll', showAfterEngagement, { passive: true });
  }
  document.addEventListener('consultation:success', dismissInvitation);
}

})();

import { answerWebsiteQuestion, pexyNudgeCopy, shouldOfferPexy } from './site-help.mjs';

const widget = document.querySelector('.site-help');
const toggle = document.querySelector('#help-toggle');
const panel = document.querySelector('#site-help-panel');
const input = document.querySelector('#help-question');
const answer = document.querySelector('#help-answer');
const nudge = document.querySelector('#pexy-nudge');
const followupForm = document.querySelector('#pexy-followup-form');
const followupStatus = document.querySelector('#pexy-followup-status');
const nudgeSeenKey = 'apex-pexy-nudge-seen-v1';
const pageStartedAt = performance.now();
let followupStartedAt = 0;
let followupSubmissionId = 0;
let nudgeSeen = false;
try { nudgeSeen = sessionStorage.getItem(nudgeSeenKey) === 'true'; } catch { /* Optional preference only. */ }

function markNudgeSeen() {
  nudgeSeen = true;
  try { sessionStorage.setItem(nudgeSeenKey, 'true'); } catch { /* Optional preference only. */ }
}

function dismissPexyNudge() {
  if (nudge) nudge.hidden = true;
  markNudgeSeen();
}

function offerPexy({ topExit = false, engaged = false } = {}) {
  if (!nudge || !toggle || !panel || nudgeSeen) return;
  // Browser chrome and the search bar are outside the page. Leaving at the top is only a possible-exit signal.
  const desktop = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 48rem)').matches;
  const focusedField = document.activeElement?.matches('input, textarea, select, [contenteditable="true"]');
  const policyPage = /^\/(?:privacy|terms|communications-consent|cancellation-refunds|accessibility)\/?$/.test(window.location.pathname);
  const available = !toggle.hidden && panel.hidden && !focusedField && !policyPage;
  if (!shouldOfferPexy({ elapsedMs: performance.now() - pageStartedAt, desktop, topExit, engaged, pageVisible: document.visibilityState === 'visible', available })) return;
  document.querySelector('#pexy-nudge-copy').textContent = pexyNudgeCopy(window.location.pathname);
  nudge.hidden = false;
  markNudgeSeen(); // One invitation per browsing session, across pages.
}

function setOpen(open, restoreFocus = false) {
  if (!panel || !toggle) return;
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  if (open) {
    dismissPexyNudge();
    input.focus();
  } else {
    input.value = '';
    resetFollowup();
    answer.replaceChildren();
    const greeting = document.createElement('p');
    greeting.textContent = 'What can I help you find? Try a topic below or ask a general website question.';
    answer.append(greeting);
    if (restoreFocus) toggle.focus();
  }
}

function resetFollowup() {
  if (!followupForm || !followupStatus) return;
  followupSubmissionId += 1;
  followupForm.hidden = true;
  followupForm.reset();
  followupForm.removeAttribute('aria-busy');
  followupForm.querySelector('button[type="submit"]').disabled = false;
  followupStatus.textContent = '';
  followupStartedAt = 0;
}

function respond(question) {
  const response = answerWebsiteQuestion(question, widget.dataset.launchLabel);
  const paragraph = document.createElement('p');
  paragraph.textContent = response.text;
  const link = document.createElement('a');
  link.textContent = response.label;
  link.href = response.href;
  input.value = '';
  resetFollowup();
  if (response.followupEligible && followupForm) {
    const followupButton = document.createElement('button');
    followupButton.type = 'button';
    followupButton.className = 'pexy-followup-action';
    followupButton.textContent = 'Ask the Apex team';
    followupButton.addEventListener('click', () => {
      const panelTop = panel.getBoundingClientRect().top;
      const formTop = followupForm.getBoundingClientRect().top;
      panel.scrollTop += formTop - panelTop - 12;
      followupForm.elements.full_name.focus({ preventScroll: true });
    });
    answer.replaceChildren(paragraph, followupButton, link);
    followupForm.hidden = false;
    followupStartedAt = Date.now();
  } else {
    answer.replaceChildren(paragraph, link);
  }
}

async function submitFollowup(event) {
  event.preventDefault();
  if (!followupForm || !followupStatus || !followupStartedAt || !followupForm.reportValidity()) return;
  const submitButton = followupForm.querySelector('button[type="submit"]');
  const payload = {
    full_name: followupForm.elements.full_name.value.trim(),
    email: followupForm.elements.email.value.trim(),
    question: followupForm.elements.question.value.trim(),
    contact_consent: followupForm.elements.contact_consent.checked,
    consent_version: 'pexy-followup-2026-10-26',
    form_started_at: followupStartedAt,
    website: followupForm.elements.website.value
  };
  submitButton.disabled = true;
  const submissionId = ++followupSubmissionId;
  followupForm.setAttribute('aria-busy', 'true');
  followupStatus.textContent = 'Sending your general question…';
  try {
    const response = await fetch('/api/pexy-followup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      cache: 'no-store',
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (submissionId !== followupSubmissionId) return;
    if (!response.ok || data?.ok !== true) {
      followupStatus.textContent = data?.message || 'Your question could not be sent. Please try again later.';
      if (Array.isArray(data?.fields) && data.fields.includes('question')) followupForm.elements.question.focus();
      return;
    }
    followupForm.reset();
    followupForm.hidden = true;
    followupStartedAt = 0;
    followupStatus.textContent = data.message || 'Thanks. Apex received your general website question for follow-up.';
    document.dispatchEvent(new CustomEvent('pexy-followup:success'));
  } catch {
    if (submissionId === followupSubmissionId) followupStatus.textContent = 'Your question could not be sent. Please try again later.';
  } finally {
    if (submissionId === followupSubmissionId) {
      submitButton.disabled = false;
      followupForm.removeAttribute('aria-busy');
    }
  }
}

if (widget && toggle && panel && input && answer) {
  toggle.hidden = false;
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  document.querySelector('#pexy-nudge-open')?.addEventListener('click', () => setOpen(true));
  document.querySelector('#pexy-nudge-close')?.addEventListener('click', dismissPexyNudge);
  document.querySelector('#help-close').addEventListener('click', () => setOpen(false, true));
  document.querySelector('#site-help-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value.trim()) respond(input.value);
  });
  followupForm?.addEventListener('submit', submitFollowup);
  document.querySelectorAll('[data-help-question]').forEach((button) => {
    button.addEventListener('click', () => respond(button.dataset.helpQuestion));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false, true);
    else if (event.key === 'Escape' && nudge && !nudge.hidden) {
      const focusInside = nudge.contains(document.activeElement);
      dismissPexyNudge();
      if (focusInside) toggle.focus();
    }
  });
  document.addEventListener('mouseout', (event) => {
    if (event.relatedTarget === null && event.clientY <= 0) offerPexy({ topExit: true });
  });
  const offerAfterEngagement = () => {
    const engaged = window.scrollY > Math.min(360, window.innerHeight * 0.5);
    offerPexy({ engaged });
  };
  window.setTimeout(offerAfterEngagement, 40000);
  window.addEventListener('scroll', offerAfterEngagement, { passive: true });
  // Keep fixed controls away from the actual signup form and its feedback.
  const form = document.querySelector('#consultation-request');
  if (form && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      const hadFocus = widget.contains(document.activeElement);
      toggle.hidden = entry.isIntersecting;
      if (entry.isIntersecting) {
        if (nudge) nudge.hidden = true;
        setOpen(false);
        if (hadFocus) form.focus({ preventScroll: true });
      }
    }, { threshold: 0.05 }).observe(form);
  }
}

document.addEventListener('consultation:success', dismissPexyNudge);

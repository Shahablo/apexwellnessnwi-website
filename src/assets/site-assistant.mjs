import { answerWebsiteQuestion, pexyNudgeCopy, shouldOfferPexy } from './site-help.mjs';

const widget = document.querySelector('.site-help');
const toggle = document.querySelector('#help-toggle');
const panel = document.querySelector('#site-help-panel');
const input = document.querySelector('#help-question');
const answer = document.querySelector('#help-answer');
const nudge = document.querySelector('#pexy-nudge');
const nudgeSeenKey = 'apex-pexy-nudge-seen-v1';
const pageStartedAt = performance.now();
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
    answer.replaceChildren();
    const greeting = document.createElement('p');
    greeting.textContent = 'What can I help you find? Try a topic below or ask a general website question.';
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
  document.querySelector('#pexy-nudge-open')?.addEventListener('click', () => setOpen(true));
  document.querySelector('#pexy-nudge-close')?.addEventListener('click', dismissPexyNudge);
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

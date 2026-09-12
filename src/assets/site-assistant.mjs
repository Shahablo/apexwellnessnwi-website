import { answerWebsiteQuestion } from './site-help.mjs';

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

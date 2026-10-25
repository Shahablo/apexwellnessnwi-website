const planner = document.querySelector('[data-visit-planner]');
if (planner) {
  const panels = [...planner.querySelectorAll('[data-visit-step]')];
  const indicators = [...planner.querySelectorAll('[data-visit-indicator]')];
  const progress = planner.querySelector('[data-visit-progress]');
  let current = 0;
  const show = (index, focus = true) => {
    current = Math.max(0, Math.min(panels.length - 1, index));
    panels.forEach((panel, i) => { panel.hidden = i !== current; });
    indicators.forEach((indicator, i) => {
      if (i === current) indicator.setAttribute('aria-current', 'step');
      else indicator.removeAttribute('aria-current');
    });
    progress.textContent = `Step ${current + 1} of ${panels.length}`;
    if (focus) panels[current].querySelector('h2').focus();
  };
  planner.querySelectorAll('[data-visit-next]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => show(current + 1));
  });
  planner.querySelectorAll('[data-visit-back]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => show(current - 1));
  });
  show(0, false);
}

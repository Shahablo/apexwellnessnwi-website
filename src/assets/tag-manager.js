// Google Tag Manager container GTM-KXG4NF6G (owner decision November 24, 2026).
// Advertising tags (Google Ads, conversions) are managed in Tag Manager, not here.
// This file only:
//   1. turns off ad personalization and Google signals before any tag runs,
//   2. tells Tag Manager when a Book online button or a phone link is clicked
//      (dataLayer events apex_book_online_click and apex_call_click), and
//   3. loads the container.
// It never sends form values, contact details or the number dialed.
// The site's Content-Security-Policy only lets Google's ad and tag hosts run,
// so tags from other vendors added in Tag Manager will not load without a
// reviewed change to scripts/build.mjs.
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('set', 'allow_ad_personalization_signals', false);
gtag('set', 'allow_google_signals', false);

document.addEventListener('click', function (event) {
  var link = event.target && event.target.closest ? event.target.closest('a[data-book-online], a[href^="tel:"]') : null;
  if (!link) return;
  window.dataLayer.push({ event: link.hasAttribute('data-book-online') ? 'apex_book_online_click' : 'apex_call_click' });
});

(function () {
  var container = document.createElement('script');
  container.async = true;
  container.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-KXG4NF6G';
  document.head.appendChild(container);
})();

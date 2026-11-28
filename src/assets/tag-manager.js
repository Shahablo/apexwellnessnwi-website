// Google Tag Manager container GTM-KXG4NF6G (owner decision November 24, 2026).
// Advertising tags (Google Ads, conversions) are managed in Tag Manager, not here.
// This file only:
//   1. turns off ad personalization and Google signals before any tag runs,
//   2. tells Tag Manager when a Book online button or a phone link is clicked, or when a
//      visitor starts using the embedded scheduler on a booking page
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

// Booking pages embed Tebra's scheduler in a frame (#schedule). A frame from another site cannot report its
// clicks, but when a visitor clicks into it, focus moves into the frame and this window blurs. The first time
// that happens on a page counts once as apex_book_online_click, the same Google Ads conversion as a Book online
// button, so the conversion keeps working without a Tag Manager change. Nothing typed in the frame is visible here.
var bookingFrameCounted = false;
window.addEventListener('blur', function () {
  setTimeout(function () {
    var frame = document.activeElement;
    if (bookingFrameCounted || !frame || frame.tagName !== 'IFRAME' || !frame.hasAttribute('data-booking-frame')) return;
    bookingFrameCounted = true;
    window.dataLayer.push({ event: 'apex_book_online_click' });
  }, 0);
});

(function () {
  var container = document.createElement('script');
  container.async = true;
  container.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-KXG4NF6G';
  document.head.appendChild(container);
})();

// Google tag for Google Ads (account tag AW-18529444653).
// Measures ad clicks and visits only. Ad personalization and remarketing
// signals are turned off, and no form values or contact details are sent.
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('set', 'allow_ad_personalization_signals', false);
gtag('set', 'allow_google_signals', false);
gtag('config', 'AW-18529444653');

// Count a click on any Book online button as the "Book online click"
// conversion. Sends only the conversion label, nothing about the visitor.
document.addEventListener('click', function (event) {
  var link = event.target && event.target.closest ? event.target.closest('a[data-book-online]') : null;
  if (link) gtag('event', 'conversion', { send_to: 'AW-18529444653/3DBbCLLPu7odEK3Gw4NF' });
});

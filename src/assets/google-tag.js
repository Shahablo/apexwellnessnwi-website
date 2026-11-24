// Google tag for Google Ads (account tag AW-18529444653).
// Measures ad clicks and visits only. Ad personalization and remarketing
// signals are turned off, and no form values or contact details are sent.
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('set', 'allow_ad_personalization_signals', false);
gtag('set', 'allow_google_signals', false);
gtag('config', 'AW-18529444653');

// One conversion action per kind of button, whatever page it is on:
// - any Book online button   -> "Book online click" (created November 17, 2026)
// - any call (tel:) link     -> "Call button click" (Phone call lead, created November 24, 2026)
// One click listener on the whole document catches every current and future
// button, so new pages need no extra tagging. Sends only the conversion label,
// nothing about the visitor or the number dialed.
var BOOK_ONLINE_CONVERSION = 'AW-18529444653/3DBbCLLPu7odEK3Gw4NF';
var CALL_CLICK_CONVERSION = 'AW-18529444653/XPU2CISZ7r4dEK3Gw4NF';
document.addEventListener('click', function (event) {
  var link = event.target && event.target.closest ? event.target.closest('a[data-book-online], a[href^="tel:"]') : null;
  if (!link) return;
  var sendTo = link.hasAttribute('data-book-online') ? BOOK_ONLINE_CONVERSION : CALL_CLICK_CONVERSION;
  gtag('event', 'conversion', { send_to: sendTo });
});

const ADDRESS = "8550 Broadway, Suite B, Merrillville, IN 46410";
const SITE = "https://apexwellnessnwi.com";
const LOGO = SITE + "/assets/images/apex-email-lockup.png";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function paragraph(value) {
  return `<p style="margin:0 0 18px;color:#183d36;font:16px/1.6 Arial,Helvetica,sans-serif">${escapeHtml(value)}</p>`;
}

function button(url, label) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:8px 0 24px"><tr><td bgcolor="#183d36" style="border-radius:4px"><a href="${escapeHtml(url)}" style="display:inline-block;padding:13px 21px;color:#ffffff;text-decoration:none;font:bold 15px/1.4 Arial,Helvetica,sans-serif">${escapeHtml(label)}</a></td></tr></table>`;
}

function brandedHtml({ title, body, action, note, unsubscribe }) {
  const optOut = unsubscribe
    ? `<p style="margin:0 0 8px;color:#52665e;font:12px/1.5 Arial,Helvetica,sans-serif">You requested opening updates from Apex Wellness. <a href="${escapeHtml(unsubscribe)}" style="color:#183d36;text-decoration:underline">Unsubscribe</a> at any time.</p>`
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>`
    + '<body style="margin:0;padding:0;background:#f6f4ed">'
    + '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f6f4ed" style="border-collapse:collapse;background:#f6f4ed"><tr><td align="center" style="padding:24px 12px">'
    + '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border:1px solid #d2d4c7;border-collapse:collapse;background:#ffffff"><tr><td style="padding:28px 30px 22px 14px;background:#f6f4ed">'
    + `<a href="${SITE}" style="text-decoration:none"><img src="${LOGO}" width="410" alt="Apex Wellness" style="display:block;width:410px;max-width:100%;height:auto;margin-left:-30px;border:0;color:#183d36;font:bold 22px Arial,Helvetica,sans-serif"></a>`
    + '</td></tr><tr><td style="padding:30px 30px 14px">'
    + '<p style="margin:0 0 12px;color:#785331;font:bold 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:2px;text-transform:uppercase">Merrillville, Indiana</p>'
    + `<h1 style="margin:0 0 22px;color:#183d36;font:normal 34px/1.15 Georgia,Times,serif">${escapeHtml(title)}</h1>`
    + body.map(paragraph).join("")
    + (action ? button(action.url, action.label) : "")
    + (note ? `<p style="margin:0 0 22px;color:#52665e;font:13px/1.5 Arial,Helvetica,sans-serif">${escapeHtml(note)}</p>` : "")
    + '</td></tr><tr><td style="padding:20px 30px 26px;border-top:1px solid #d2d4c7;background:#f6f4ed">'
    + optOut
    + '<p style="margin:0;color:#52665e;font:12px/1.5 Arial,Helvetica,sans-serif">Apex Wellness<br>8550 Broadway, Suite B<br>Merrillville, IN 46410</p>'
    + '</td></tr></table></td></tr></table></body></html>';
}

export function renderLaunchEmail(stage, links = {}) {
  let subject;
  let title;
  let paragraphs;
  let body;
  let action;
  let note;

  if (stage === "verify") {
    subject = "Confirm your Apex Wellness opening updates";
    title = "One more step.";
    body = [
      "One quick click and you're on the Apex Wellness Launch List.",
      "Confirm your email below. We'll share opening news and let you know when appointment requests become available.",
    ];
    action = { url: links.verify, label: "Confirm my email" };
    note = "If you didn't request this, you can ignore this email. Joining the list does not book an appointment or reserve an offer. Please don't send medical information by reply.";
    paragraphs = [
      body[0],
      body[1],
      links.verify,
      "If you didn't request this, you can ignore this email. Joining the list does not book an appointment or reserve an offer.",
      "Please don't send medical information by reply.",
    ];
  } else if (stage === "welcome") {
    subject = "You're on the Apex Wellness Launch List";
    title = "You're on the list.";
    body = [
      "We're glad you're here. The Apex name is on the door in Merrillville, and we're excited to open it to our neighbors soon.",
      "Appointment requests are coming soon. We'll email you when scheduling opens and share pricing when it's published.",
    ];
    note = "Joining this list does not book a visit or reserve one of the first 100 assessments.";
    paragraphs = [
      body[0],
      body[1],
      note,
    ];
  } else if (stage === "day3") {
    subject = "Appointment requests are coming soon";
    title = "We're getting close.";
    body = [
      "Apex Wellness is preparing to welcome our Merrillville neighbors.",
      "Appointment requests are coming soon. We'll send you the confirmed next steps when scheduling opens; you don't need to keep checking back.",
    ];
    paragraphs = [body[0], body[1]];
  } else if (stage === "day10") {
    subject = "Where you'll find Apex Wellness";
    title = "Where you'll find us.";
    body = [
      "Apex Wellness is preparing to open at " + ADDRESS + ". We're looking forward to welcoming our Northwest Indiana neighbors.",
      "We'll send the confirmed appointment-request link when scheduling opens. Pricing will be shared when it's published.",
    ];
    action = { url: SITE + "/", label: "Visit Apex Wellness" };
    paragraphs = [body[0], body[1], "For current updates, visit " + SITE + "/."];
  } else {
    throw new Error("Unknown Launch List email stage");
  }

  if (stage !== "verify") paragraphs.push("Unsubscribe from opening updates: " + links.unsubscribe);
  paragraphs.push("Apex Wellness\n" + ADDRESS);

  return {
    subject,
    textContent: paragraphs.join("\n\n"),
    htmlContent: brandedHtml({ title, body, action, note, unsubscribe: stage === "verify" ? null : links.unsubscribe }),
  };
}

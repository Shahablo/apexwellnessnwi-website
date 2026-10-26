const ADDRESS = "8550 Broadway, Suite B, Merrillville, IN 46410";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function emailParagraph(value) {
  return "<p>" + escapeHtml(value)
    .replace(/https:\/\/[A-Za-z0-9./?=&;_%-]+/g, (url) => '<a href="' + url + '">' + url + "</a>")
    .replace(/\n/g, "<br>") + "</p>";
}

export function renderLaunchEmail(stage, links = {}) {
  let subject;
  let paragraphs;

  if (stage === "verify") {
    subject = "Confirm your Apex Wellness opening updates";
    paragraphs = [
      "Thanks for joining the Apex Wellness Launch List.",
      "Please confirm your email address to receive opening and scheduling updates:",
      links.verify,
      "If you didn't request this, you can ignore this email. Joining the list does not book an appointment or reserve an offer.",
      "Please don't send medical information by reply.",
    ];
  } else if (stage === "welcome") {
    subject = "You're on the Apex Wellness Launch List";
    paragraphs = [
      "You're on the list. Thanks for following along as we prepare to open Apex Wellness in Merrillville.",
      "We'll share opening, pricing and scheduling details when they're ready. For now, here's a look at the work happening before the doors open:",
      "https://apexwellnessnwi.com/blog/before-the-doors-open-apex-wellness/",
      "Joining this list does not book a visit or reserve one of the first 100 assessments.",
    ];
  } else if (stage === "day3") {
    subject = "Before the doors open";
    paragraphs = [
      "A clinic's opening checklist is longer than it looks. The window lettering, a few FedEx trips and the endless small decisions have kept us busy.",
      "We're getting the Merrillville space ready and will share confirmed opening and scheduling details here as soon as they're available.",
      "Take a look behind the scenes: https://apexwellnessnwi.com/blog/before-the-doors-open-apex-wellness/",
    ];
  } else if (stage === "day10") {
    subject = "Where you'll find Apex Wellness";
    paragraphs = [
      "Apex Wellness is preparing to open at " + ADDRESS + ". We're looking forward to welcoming our Northwest Indiana neighbors.",
      "We'll send the details that matter, including published pricing and how to request an appointment, when those steps are ready.",
      "For current updates, visit https://apexwellnessnwi.com/.",
    ];
  } else {
    throw new Error("Unknown Launch List email stage");
  }

  if (stage !== "verify") {
    paragraphs.push("Unsubscribe from opening updates: " + links.unsubscribe);
  }
  paragraphs.push("Apex Wellness\n" + ADDRESS);

  const textContent = paragraphs.join("\n\n");
  const htmlContent = '<!doctype html><html lang="en"><meta charset="utf-8">'
    + '<body style="font:16px/1.6 Arial,sans-serif;color:#1d3c34;max-width:600px;margin:auto;padding:20px">'
    + paragraphs.map(emailParagraph).join("")
    + "</body></html>";

  return { subject, textContent, htmlContent };
}

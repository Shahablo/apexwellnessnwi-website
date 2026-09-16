import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { blogPosts } from "../src/blog-posts.mjs";
import {
  clinicalReviewAssignments,
  clinicalReviewers,
} from "../src/editorial.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requestedOutput = process.argv[2];
const clinicTimeZone = "America/Chicago";
const localDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: clinicTimeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})
  .format(new Date())
  .replaceAll("/", "-");
const preparedAt = new Intl.DateTimeFormat("en-US", {
  timeZone: clinicTimeZone,
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
}).format(new Date());
const outputDirectory = requestedOutput
  ? path.resolve(projectRoot, requestedOutput)
  : path.resolve(
      projectRoot,
      "..",
      "branding",
      "social",
      "review",
      `${localDate}-blog-clinical-review`,
    );

const assignedPosts = blogPosts.filter((post) => clinicalReviewAssignments[post.slug]);

function articleHash(post) {
  return crypto.createHash("sha256").update(JSON.stringify(post)).digest("hex");
}

function reviewerNames(assignment) {
  return assignment.reviewerIds.map((reviewerId) => clinicalReviewers[reviewerId].name);
}

function isReviewComplete(post, assignment) {
  return assignment.status === "reviewed"
    && assignment.reviewedOn
    && assignment.contentHash === articleHash(post);
}

function markdownInline(value) {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return String(value ?? "");
  return value
    .map((fragment) => {
      if (typeof fragment === "string") return fragment;
      if (fragment && typeof fragment === "object" && fragment.text) {
        return fragment.href ? `[${fragment.text}](${fragment.href})` : fragment.text;
      }
      return "";
    })
    .join("");
}

function markdownParagraphs(paragraphs = []) {
  return paragraphs.map((paragraph) => `${markdownInline(paragraph)}\n`).join("\n");
}

function markdownBullets(bullets = []) {
  return bullets.map((bullet) => `- ${markdownInline(bullet)}`).join("\n");
}

function markdownSection(section, level = 2) {
  const parts = [`${"#".repeat(level)} ${section.heading}`];
  if (section.paragraphs?.length) parts.push(markdownParagraphs(section.paragraphs));
  if (section.bullets?.length) parts.push(markdownBullets(section.bullets));
  if (section.paragraphsAfterBullets?.length) {
    parts.push(markdownParagraphs(section.paragraphsAfterBullets));
  }
  if (section.subsections?.length) {
    parts.push(...section.subsections.map((subsection) => markdownSection(subsection, level + 1)));
  }
  return parts.filter(Boolean).join("\n\n");
}

function reviewFileName(post) {
  return `${post.slug.split("/").filter(Boolean).at(-1)}.md`;
}

function renderArticle(post) {
  const assignment = clinicalReviewAssignments[post.slug];
  const hash = articleHash(post);
  const reviewComplete = isReviewComplete(post, assignment);
  const sources = post.sources
    .map((source) => `- [${source.label}](${source.href})`)
    .join("\n");
  const status = post.status === "draft"
    ? `${reviewComplete ? "Reviewed" : "Review-pending"} draft, not public`
    : reviewComplete
      ? "Published article with a reviewed revision prepared for deployment"
      : "Published article with a revised version pending review";

  return `# ${post.h1}\n\n` +
    `**Clinical-review status:** ${reviewComplete ? `Approved for this exact version on ${assignment.reviewedOn}` : "Pending. This file is prepared for review and is not evidence that review occurred."}\n\n` +
    `**${reviewComplete ? "Reviewer" : "Assigned reviewer"}${assignment.reviewerIds.length === 1 ? "" : "s"}:** ${reviewerNames(assignment).join(", ")}\n\n` +
    `**Website path:** ${post.slug}\n\n` +
    `**Release status:** ${status}\n\n` +
    `**Exact article SHA-256:** \`${hash}\`\n\n` +
    `**SEO title:** ${post.title}\n\n` +
    `**Meta description:** ${post.description}\n\n` +
    `**Article summary:** ${post.excerpt}\n\n` +
    `## Introduction\n\n${post.intro.split(/\n\n+/).join("\n\n")}\n\n` +
    `${post.sections.map((section) => markdownSection(section)).join("\n\n")}\n\n` +
    `## ${post.disclaimerHeading}\n\n${post.disclaimer}\n\n` +
    `## Sources\n\n${sources}\n\n` +
    `---\n\n` +
    (reviewComplete
      ? `Review is recorded for SHA-256 \`${hash}\` as of ${assignment.reviewedOn}. Any substantive edit creates a new hash and reopens review.\n`
      : `To approve this exact version, record: “I, [reviewer name], reviewed **${post.h1}**, SHA-256 \`${hash}\`, and approve it for publication as medically accurate as of [date].” Requested corrections should be made before approval; any substantive edit creates a new hash and reopens review.\n`);
}

await mkdir(outputDirectory, { recursive: true });

const indexRows = assignedPosts.map((post) => {
  const assignment = clinicalReviewAssignments[post.slug];
  const status = isReviewComplete(post, assignment) ? `Approved ${assignment.reviewedOn}` : "Pending";
  return `| [${post.h1}](./${reviewFileName(post)}) | ${reviewerNames(assignment).join(", ")} | \`${articleHash(post)}\` | ${status} |`;
});

const allReviewsComplete = assignedPosts.every(
  (post) => isReviewComplete(post, clinicalReviewAssignments[post.slug]),
);

const index = `# Apex Wellness clinical article review packet\n\n` +
  `**Status:** ${allReviewsComplete ? "Owner-confirmed physician review complete for every exact hash below." : "Prepared for physician review. No article in this packet should display a named medical-review credit until the assigned physician approves the exact hash below."}\n\n` +
  `**Prepared:** ${preparedAt}\n\n` +
  `## Assigned review\n\n` +
  `| Article | Assigned physician reviewer(s) | Exact SHA-256 | Status |\n` +
  `| --- | --- | --- | --- |\n${indexRows.join("\n")}\n\n` +
  `## Review checklist\n\n` +
  `For each assigned article, please confirm or correct:\n\n` +
  `- Clinical accuracy and appropriate scope for general education\n` +
  `- Medication formulation and product distinctions where relevant\n` +
  `- Contraindication, pregnancy, side-effect, warning-sign, and emergency language where relevant\n` +
  `- Whether cited sources support the claims and remain current\n` +
  `- Whether descriptions of Apex's planned care model are accurate\n` +
  `- Whether the writing is clear without implying diagnosis, a prescription, guaranteed eligibility, or guaranteed outcomes\n\n` +
  `## Publishing control\n\n` +
  `The website source stores each reviewer, review date, and exact article hash. The build rejects a reviewed article if later source edits change that hash. Visible review credit and structured-data review credit are generated from the same verified record.\n`;

await writeFile(path.join(outputDirectory, "README.md"), index, "utf8");
for (const post of assignedPosts) {
  await writeFile(path.join(outputDirectory, reviewFileName(post)), renderArticle(post), "utf8");
}

console.log(`Clinical review packet written to ${outputDirectory}`);
for (const post of assignedPosts) {
  console.log(`${post.slug} ${articleHash(post)}`);
}

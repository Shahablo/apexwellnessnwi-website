export const clinicalReviewers = Object.freeze({
  "atif-muhammad": Object.freeze({
    id: "atif-muhammad",
    name: "Atif Muhammad, MD",
    profileHref: "/about/#atif-muhammad",
    role: "Physician",
  }),
  "wajeeh-bakhsh": Object.freeze({
    id: "wajeeh-bakhsh",
    name: "Wajeeh Bakhsh, MD",
    profileHref: "/about/#wajeeh-bakhsh",
    role: "Physician and orthopaedic surgeon",
    sameAs: "https://www.linkedin.com/in/wajeeh-bakhsh-6a8b1817/",
  }),
});

// A pending assignment is an internal workflow record, not a public claim that
// review has happened. Change status to "reviewed" only after the named
// physician approves the exact article object, then record reviewedOn and the
// SHA-256 of JSON.stringify(article). The build fails if that hash later drifts.
export const clinicalReviewAssignments = Object.freeze({
  "/blog/medical-weight-management-what-it-means/": Object.freeze({
    status: "pending",
    reviewerIds: Object.freeze(["atif-muhammad", "wajeeh-bakhsh"]),
  }),
  "/blog/glp-1-weight-loss-expectations-side-effects/": Object.freeze({
    status: "pending",
    reviewerIds: Object.freeze(["atif-muhammad"]),
  }),
  "/blog/weight-loss-plateau-what-to-track/": Object.freeze({
    status: "pending",
    reviewerIds: Object.freeze(["atif-muhammad", "wajeeh-bakhsh"]),
  }),
});

export const weightManagementCluster = Object.freeze({
  pillar: "/weight-management/",
  articles: Object.freeze([
    "/blog/medical-weight-management-what-it-means/",
    "/blog/glp-1-weight-loss-expectations-side-effects/",
    "/blog/weight-loss-plateau-what-to-track/",
  ]),
});

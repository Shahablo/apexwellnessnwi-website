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
    status: "reviewed",
    reviewerIds: Object.freeze(["atif-muhammad", "wajeeh-bakhsh"]),
    reviewedOn: "2026-09-15",
    contentHash: "dd05f9f3ed9d05a3f8e38857ec8375d14fdbeee563ef9b7c15a8492dd190adf3",
  }),
  "/blog/glp-1-weight-loss-expectations-side-effects/": Object.freeze({
    status: "reviewed",
    reviewerIds: Object.freeze(["atif-muhammad"]),
    reviewedOn: "2026-09-15",
    contentHash: "dff23c4e72e2d99fbe011e919818c2d12e8391869f11186d96d8d85c047f3ee8",
  }),
  "/blog/weight-loss-plateau-what-to-track/": Object.freeze({
    status: "reviewed",
    reviewerIds: Object.freeze(["atif-muhammad", "wajeeh-bakhsh"]),
    reviewedOn: "2026-09-15",
    contentHash: "db4c55c363fe077daae45c6831f7e8d56c4254adac58f2df05bde2b5ba9f97dd",
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

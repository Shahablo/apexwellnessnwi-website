(() => {
  "use strict";

  const configuration = Object.freeze({
    enabled: true,
    provider: "Apex first-party aggregate measurement",
    endpoint: "/api/site-event",
  });

  const allowedEvents = new Set(["page_view", "cta_click", "form_view", "form_start", "form_submit_success"]);
  const allowedTargets = new Set(["none", "launch_list", "plan_visit", "call", "email"]);
  const allowedForms = new Set(["none", "launch_list", "plan_visit", "pexy_followup"]);
  const sourceAliases = new Map([
    ["google", "google"], ["bing", "bing"], ["facebook", "facebook"], ["fb", "facebook"],
    ["instagram", "instagram"], ["ig", "instagram"], ["linkedin", "linkedin"],
    ["email", "email"], ["newsletter", "email"],
  ]);
  const mediumAliases = new Map([
    ["organic", "organic"], ["social", "social"], ["email", "email"],
    ["cpc", "cpc"], ["ppc", "cpc"], ["paid", "cpc"], ["referral", "referral"],
  ]);

  function pageKey(pathname) {
    if (pathname === "/") return "home";
    const normalized = pathname.toLowerCase().replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return (normalized || "home").slice(0, 100).replace(/-+$/g, "") || "home";
  }

  function trafficContext() {
    const parameters = new URLSearchParams(window.location.search);
    const rawSource = (parameters.get("utm_source") || "").trim().toLowerCase();
    const rawMedium = (parameters.get("utm_medium") || "").trim().toLowerCase();
    const rawCampaign = (parameters.get("utm_campaign") || "").trim().toLowerCase();
    let referrerDomain = "direct";
    try {
      if (document.referrer) referrerDomain = new URL(document.referrer).hostname.toLowerCase().replace(/^www\./, "");
    } catch { /* Invalid browser-supplied referrer stays direct. */ }
    if (!/^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$/.test(referrerDomain)) referrerDomain = "direct";
    const inferredSource = rawSource || (referrerDomain === "direct" ? "direct" : referrerDomain.includes("google.") ? "google" : referrerDomain.includes("bing.") ? "bing" : referrerDomain.includes("facebook.") ? "facebook" : referrerDomain.includes("instagram.") ? "instagram" : referrerDomain.includes("linkedin.") ? "linkedin" : "other");
    const inferredMedium = rawMedium || (referrerDomain === "direct" ? "none" : inferredSource === "google" || inferredSource === "bing" ? "organic" : inferredSource === "facebook" || inferredSource === "instagram" || inferredSource === "linkedin" ? "social" : "referral");
    const campaign = rawCampaign.replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64).replace(/-+$/g, "") || "none";
    return Object.freeze({
      utm_source: sourceAliases.get(inferredSource) || (inferredSource === "direct" ? "direct" : "other"),
      utm_medium: mediumAliases.get(inferredMedium) || (inferredMedium === "none" ? "none" : "other"),
      utm_campaign: campaign,
      referrer_domain: referrerDomain,
      device_class: window.innerWidth < 600 ? "phone" : window.innerWidth < 1024 ? "tablet" : "desktop",
    });
  }

  function targetGroup(anchor) {
    const href = anchor.getAttribute("href") || "";
    if (href.startsWith("tel:")) return "call";
    if (href.startsWith("mailto:")) return "email";

    let url;
    try {
      url = new URL(href, window.location.origin);
    } catch {
      return null;
    }
    if (url.origin !== window.location.origin) return null;
    if (url.pathname === "/founding-patients/") return "launch_list";
    if (url.pathname === "/plan-your-visit/") return "plan_visit";
    return null;
  }

  function transmit(payload) {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      return navigator.sendBeacon(configuration.endpoint, new Blob([body], { type: "application/json" }));
    }
    fetch(configuration.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => {});
    return true;
  }

  const measurement = Object.freeze({
    isEnabled() {
      return configuration.enabled;
    },
    record(event, { page_key: pageKeyValue, target_group: targetGroupValue = "none", form_group: formGroupValue = "none" } = {}) {
      if (!configuration.enabled
        || !allowedEvents.has(event)
        || !/^[a-z0-9][a-z0-9-]{0,99}$/.test(pageKeyValue)
        || !allowedTargets.has(targetGroupValue)
        || !allowedForms.has(formGroupValue)) {
        return Object.freeze({ accepted: false, reason: "invalid" });
      }
      const accepted = transmit({
        event,
        page_key: pageKeyValue,
        target_group: targetGroupValue,
        form_group: formGroupValue,
        ...trafficContext(),
      });
      return Object.freeze({ accepted, reason: accepted ? "queued" : "unavailable" });
    },
  });

  Object.defineProperty(window, "apexMeasurement", {
    value: measurement,
    configurable: false,
    enumerable: false,
    writable: false,
  });

  const currentPageKey = pageKey(window.location.pathname);
  measurement.record("page_view", { page_key: currentPageKey });

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest?.("a[href]");
    if (!anchor) return;
    const target = targetGroup(anchor);
    if (!target) return;
    measurement.record("cta_click", {
      page_key: currentPageKey,
      target_group: target,
    });
  }, { capture: true });

  const observedForms = [
    { selector: '#consultation-form[action="/api/founding-consultation"]', group: "launch_list" },
    { selector: '#consultation-form[action="/api/appointment-contact"]', group: "plan_visit" },
    { selector: "#pexy-followup-form", group: "pexy_followup" },
  ];
  observedForms.forEach(({ selector, group }) => {
    const form = document.querySelector(selector);
    if (!form) return;
    let viewed = false;
    const recordView = () => {
      if (viewed || form.hidden) return;
      viewed = true;
      measurement.record("form_view", { page_key: currentPageKey, form_group: group });
    };
    recordView();
    if (form.hidden && "MutationObserver" in window) {
      new MutationObserver(recordView).observe(form, { attributes: true, attributeFilter: ["hidden"] });
    }
    let started = false;
    form.addEventListener("input", () => {
      if (started) return;
      started = true;
      measurement.record("form_start", { page_key: currentPageKey, form_group: group });
    }, { capture: true });
  });

  document.addEventListener("consultation:success", () => {
    const form = document.querySelector("#consultation-form");
    const group = form?.getAttribute("action") === "/api/appointment-contact" ? "plan_visit" : "launch_list";
    measurement.record("form_submit_success", { page_key: currentPageKey, form_group: group });
  });
  document.addEventListener("pexy-followup:success", () => {
    measurement.record("form_submit_success", { page_key: currentPageKey, form_group: "pexy_followup" });
  });
})();

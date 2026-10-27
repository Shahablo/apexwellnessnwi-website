(() => {
  "use strict";

  const configuration = Object.freeze({
    enabled: true,
    provider: "Apex first-party aggregate measurement",
    endpoint: "/api/site-event",
  });

  const allowedEvents = new Set(["page_view", "cta_click"]);
  const allowedPageGroups = new Set(["home", "care", "blog", "visit", "general"]);
  const allowedTargets = new Set(["none", "launch_list", "plan_visit", "call", "email"]);

  function pageGroup(pathname) {
    if (pathname === "/") return "home";
    if (pathname === "/blog/" || pathname.startsWith("/blog/")) return "blog";
    if (["/weight-management/", "/mens-hormone-health/", "/womens-midlife-care/", "/hair-loss-care/"].includes(pathname)) return "care";
    if (["/founding-patients/", "/plan-your-visit/", "/merrillville/"].includes(pathname)) return "visit";
    return "general";
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
    record(event, { page_group: pageGroupValue, target_group: targetGroupValue = "none" } = {}) {
      if (!configuration.enabled
        || !allowedEvents.has(event)
        || !allowedPageGroups.has(pageGroupValue)
        || !allowedTargets.has(targetGroupValue)) {
        return Object.freeze({ accepted: false, reason: "invalid" });
      }
      const accepted = transmit({
        event,
        page_group: pageGroupValue,
        target_group: targetGroupValue,
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

  const currentPageGroup = pageGroup(window.location.pathname);
  measurement.record("page_view", { page_group: currentPageGroup });

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest?.("a[href]");
    if (!anchor) return;
    const target = targetGroup(anchor);
    if (!target) return;
    measurement.record("cta_click", {
      page_group: currentPageGroup,
      target_group: target,
    });
  }, { capture: true });
})();

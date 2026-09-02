(() => {
  "use strict";

  const DESKTOP_MENU_QUERY = "(min-width: 70rem)";

  function normalizePath(value) {
    try {
      const url = new URL(value, window.location.origin);
      let path = url.pathname.replace(/\/index\.html$/, "/");
      if (path.length > 1 && !path.endsWith("/")) path += "/";
      return path;
    } catch {
      return "";
    }
  }

  function setCurrentNavigationItem(nav) {
    const currentPath = normalizePath(window.location.href);

    nav.querySelectorAll("a[href]").forEach((link) => {
      const linkPath = normalizePath(link.href);
      const isCurrent = Boolean(linkPath && linkPath === currentPath);

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initializeNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    if (!nav.id) nav.id = "primary-navigation";
    toggle.setAttribute("aria-controls", nav.id);
    toggle.setAttribute("aria-expanded", "false");
    if (!toggle.hasAttribute("aria-label")) {
      toggle.setAttribute("aria-label", "Open main menu");
    }

    const setOpen = (open, returnFocus = false) => {
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close main menu" : "Open main menu");

      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("click", (event) => {
      if (
        toggle.getAttribute("aria-expanded") === "true" &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false, true);
      }
    });

    const desktopMenu = window.matchMedia(DESKTOP_MENU_QUERY);
    const handleBreakpoint = (event) => {
      if (event.matches) setOpen(false);
    };

    if (typeof desktopMenu.addEventListener === "function") {
      desktopMenu.addEventListener("change", handleBreakpoint);
    } else {
      desktopMenu.addListener(handleBreakpoint);
    }

    setCurrentNavigationItem(nav);
  }

  function redirectLegacyPriorityFragment() {
    const fragment = window.location.hash.toLowerCase();
    if (normalizePath(window.location.href) !== "/") return false;
    if (!["#priority", "#priority-list"].includes(fragment)) return false;
    window.location.replace("/founding-patients/");
    return true;
  }

  function ensureStartedAt(form) {
    let input = form.elements.namedItem("form_started_at");

    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = "form_started_at";
      form.appendChild(input);
    }

    input.value = String(Date.now());
  }

  function formPayload(form) {
    const payload = {};
    const data = new FormData(form);

    data.forEach((value, key) => {
      if (value instanceof File) return;

      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        payload[key] = Array.isArray(payload[key])
          ? [...payload[key], value]
          : [payload[key], value];
      } else {
        payload[key] = value;
      }
    });

    form.querySelectorAll('input[type="checkbox"][name]').forEach((checkbox) => {
      payload[checkbox.name] = checkbox.checked;
    });

    return payload;
  }

  function initializeConsultationForm() {
    const form = document.querySelector("#consultation-form");
    if (!form) return;

    let status = document.querySelector("#form-status");
    if (!status) {
      status = document.createElement("p");
      status.id = "form-status";
      status.className = "form-status";
      form.appendChild(status);
    }

    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    status.tabIndex = -1;
    ensureStartedAt(form);

    let submitting = false;

    const clearFieldErrors = () => {
      form.querySelectorAll('[aria-invalid="true"]').forEach((control) => {
        control.removeAttribute("aria-invalid");
        control.removeAttribute("aria-errormessage");
      });
    };

    const markFieldErrors = (fields) => {
      if (!Array.isArray(fields)) return;

      fields.forEach((name) => {
        const control = form.elements.namedItem(name);
        if (!(control instanceof HTMLElement)) return;
        control.setAttribute("aria-invalid", "true");
        control.setAttribute("aria-errormessage", status.id);
      });
    };

    const showStatus = (type, message) => {
      status.className = `form-status is-visible is-${type}`;
      status.setAttribute("role", type === "error" ? "alert" : "status");
      status.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
      status.textContent = message;
      status.focus({ preventScroll: false });
    };

    const setSubmitting = (isSubmitting) => {
      form.setAttribute("aria-busy", String(isSubmitting));

      form.querySelectorAll('button[type="submit"], input[type="submit"]').forEach((control) => {
        control.disabled = isSubmitting;

        if (control instanceof HTMLButtonElement) {
          if (isSubmitting) {
            control.dataset.originalLabel = control.textContent;
            control.textContent = control.dataset.loadingLabel || "Submitting…";
          } else if (control.dataset.originalLabel) {
            control.textContent = control.dataset.originalLabel;
            delete control.dataset.originalLabel;
          }
        }
      });
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submitting) return;

      clearFieldErrors();

      if (!form.checkValidity()) {
        form.reportValidity();
        showStatus("error", "Please review the highlighted fields and try again.");
        return;
      }

      const payload = formPayload(form);
      const startedAt = Number(payload.form_started_at);
      if (!Number.isSafeInteger(startedAt)) {
        ensureStartedAt(form);
        showStatus("error", "Please refresh the page and try again.");
        return;
      }
      payload.form_started_at = startedAt;
      submitting = true;
      setSubmitting(true);

      try {
        const response = await fetch(form.getAttribute("action") || "/api/founding-consultation", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        let result = null;
        try {
          result = await response.json();
        } catch {
          // A generic accessible status is shown below if the response is not JSON.
        }

        if (!response.ok) {
          markFieldErrors(result?.fields);
          if (response.status === 429) {
            showStatus("error", "Please wait a moment before trying again.");
          } else if (response.status >= 400 && response.status < 500) {
            showStatus("error", result?.message || "Please review your information and try again.");
          } else {
            showStatus("error", "We couldn’t save your request right now. Please try again shortly.");
          }
          return;
        }

        form.reset();
        clearFieldErrors();
        ensureStartedAt(form);
        const successMessage = payload.accessibility_request
          ? "Thank you. Apex received your website or accessibility-support request."
          : form.dataset.successMessage;
        showStatus(
          "success",
          successMessage || result?.message || "Thank you. Apex received your consultation request."
        );
        document.dispatchEvent(new CustomEvent("consultation:success"));
      } catch {
        showStatus("error", "We couldn’t save your request right now. Please try again shortly.");
      } finally {
        submitting = false;
        setSubmitting(false);
      }
    });

    form.addEventListener("input", (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      event.target.removeAttribute("aria-invalid");
      event.target.removeAttribute("aria-errormessage");
    });
  }

  function initializeMobileConversionCta() {
    const cta = document.querySelector(".mobile-conversion-cta");
    const formRegion = document.querySelector("#consultation-request");
    const footer = document.querySelector(".site-footer");
    if (!cta || !formRegion) return;

    let submitted = false;
    const visibleTargets = new Set();
    const updateVisibility = () => {
      cta.classList.toggle("is-hidden", submitted || visibleTargets.size > 0);
    };

    cta.classList.add("is-ready");
    document.body.classList.add("has-mobile-conversion-cta");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleTargets.add(entry.target);
          } else {
            visibleTargets.delete(entry.target);
          }
        });
        updateVisibility();
      }, { threshold: 0.08 });

      observer.observe(formRegion);
      if (footer) observer.observe(footer);
    }

    cta.addEventListener("click", () => {
      window.setTimeout(() => formRegion.focus({ preventScroll: true }), 0);
    });

    document.addEventListener("consultation:success", () => {
      submitted = true;
      document.body.classList.remove("has-mobile-conversion-cta");
      updateVisibility();
    }, { once: true });
  }

  function initialize() {
    if (redirectLegacyPriorityFragment()) return;
    initializeNavigation();
    initializeConsultationForm();
    initializeMobileConversionCta();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();

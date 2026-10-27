(() => {
  "use strict";

  // Measurement stays inert until Apex completes a privacy and configuration
  // review and replaces this adapter with an explicitly approved integration.
  const configuration = Object.freeze({
    enabled: false,
    provider: null,
    endpoint: null,
  });

  const measurement = Object.freeze({
    isEnabled() {
      return configuration.enabled;
    },
    record() {
      return Object.freeze({ accepted: false, reason: "disabled" });
    },
  });

  Object.defineProperty(window, "apexMeasurement", {
    value: measurement,
    configurable: false,
    enumerable: false,
    writable: false,
  });
})();

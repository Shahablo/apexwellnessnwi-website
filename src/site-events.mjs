const allowedEvents = new Set(["page_view", "cta_click", "form_view", "form_start", "form_submit_success"]);
const allowedTargets = new Set(["none", "launch_list", "plan_visit", "call", "email"]);
const allowedForms = new Set(["none", "launch_list", "plan_visit", "pexy_followup"]);
const allowedSources = new Set(["direct", "google", "bing", "facebook", "instagram", "linkedin", "email", "other"]);
const allowedMediums = new Set(["none", "organic", "social", "email", "cpc", "referral", "other"]);
const allowedDevices = new Set(["phone", "tablet", "desktop"]);
const expectedKeys = ["device_class", "event", "form_group", "page_key", "referrer_domain", "target_group", "utm_campaign", "utm_medium", "utm_source"];

function response(status, body = null) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      ...(body === null ? {} : { "Content-Type": "application/json; charset=utf-8" }),
      "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
      "Referrer-Policy": "no-referrer",
      "Strict-Transport-Security": "max-age=15552000; includeSubDomains",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}

function chicagoDate(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export async function handleSiteEvent(request, env, now = new Date()) {
  if (request.method !== "POST") return response(405, { ok: false });

  const url = new URL(request.url);
  if (request.headers.get("Origin") !== url.origin
    || ![null, "same-origin", "same-site"].includes(request.headers.get("Sec-Fetch-Site"))) {
    return response(403, { ok: false });
  }

  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return response(415, { ok: false });
  }

  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (!Number.isFinite(declaredLength) || declaredLength > 1024) return response(413, { ok: false });

  let raw;
  try {
    raw = await request.text();
  } catch {
    return response(400, { ok: false });
  }
  if (!raw || raw.length > 1024) return response(413, { ok: false });

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return response(400, { ok: false });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return response(400, { ok: false });
  if (Object.keys(payload).sort().join(",") !== expectedKeys.join(",")) return response(400, { ok: false });

  const {
    event, page_key: pageKey, target_group: targetGroup, form_group: formGroup,
    utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign,
    referrer_domain: referrerDomain, device_class: deviceClass,
  } = payload;
  const pagePattern = /^[a-z0-9][a-z0-9-]{0,99}$/;
  const campaignPattern = /^(?:none|[a-z0-9][a-z0-9_-]{0,63})$/;
  const referrerPattern = /^(?:direct|[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?)$/;
  const isFormEvent = event.startsWith("form_");
  if (!allowedEvents.has(event)
    || typeof pageKey !== "string" || !pagePattern.test(pageKey)
    || !allowedTargets.has(targetGroup)
    || !allowedForms.has(formGroup)
    || !allowedSources.has(utmSource)
    || !allowedMediums.has(utmMedium)
    || typeof utmCampaign !== "string" || !campaignPattern.test(utmCampaign)
    || typeof referrerDomain !== "string" || !referrerPattern.test(referrerDomain)
    || !allowedDevices.has(deviceClass)
    || (event === "page_view" && targetGroup !== "none")
    || (event === "cta_click" && (targetGroup === "none" || formGroup !== "none"))
    || (isFormEvent && (targetGroup !== "none" || formGroup === "none"))
    || (!isFormEvent && formGroup !== "none")) {
    return response(400, { ok: false });
  }

  if (!env.DB?.prepare) return response(503, { ok: false });

  const timestamp = now.toISOString();
  const country = request.cf?.country || "";
  const regionCode = request.cf?.regionCode || "";
  const regionGroup = country === "US"
    ? (regionCode === "IN" ? "indiana" : "us_other")
    : (country ? "non_us" : "unknown");
  await env.DB.prepare(`
    INSERT INTO site_event_daily_v2 (
      event_date, event_name, page_key, target_group, form_group,
      utm_source, utm_medium, utm_campaign, referrer_domain,
      device_class, region_group, event_count, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    ON CONFLICT(
      event_date, event_name, page_key, target_group, form_group,
      utm_source, utm_medium, utm_campaign, referrer_domain,
      device_class, region_group
    )
    DO UPDATE SET event_count = event_count + 1, updated_at = excluded.updated_at
  `).bind(
    chicagoDate(now), event, pageKey, targetGroup, formGroup,
    utmSource, utmMedium, utmCampaign, referrerDomain,
    deviceClass, regionGroup, timestamp
  ).run();

  return response(202);
}

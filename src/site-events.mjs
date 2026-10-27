const allowedEvents = new Set(["page_view", "cta_click"]);
const allowedPageGroups = new Set(["home", "care", "blog", "visit", "general"]);
const allowedTargets = new Set(["none", "launch_list", "plan_visit", "call", "email"]);

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
  if (!Number.isFinite(declaredLength) || declaredLength > 256) return response(413, { ok: false });

  let raw;
  try {
    raw = await request.text();
  } catch {
    return response(400, { ok: false });
  }
  if (!raw || raw.length > 256) return response(413, { ok: false });

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return response(400, { ok: false });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return response(400, { ok: false });
  if (Object.keys(payload).sort().join(",") !== "event,page_group,target_group") return response(400, { ok: false });

  const { event, page_group: pageGroup, target_group: targetGroup } = payload;
  if (!allowedEvents.has(event)
    || !allowedPageGroups.has(pageGroup)
    || !allowedTargets.has(targetGroup)
    || (event === "page_view" && targetGroup !== "none")
    || (event === "cta_click" && targetGroup === "none")) {
    return response(400, { ok: false });
  }

  if (!env.DB?.prepare) return response(503, { ok: false });

  const timestamp = now.toISOString();
  await env.DB.prepare(`
    INSERT INTO site_event_daily (
      event_date, event_name, page_group, target_group, event_count, updated_at
    ) VALUES (?, ?, ?, ?, 1, ?)
    ON CONFLICT(event_date, event_name, page_group, target_group)
    DO UPDATE SET event_count = event_count + 1, updated_at = excluded.updated_at
  `).bind(chicagoDate(now), event, pageGroup, targetGroup, timestamp).run();

  return response(202);
}

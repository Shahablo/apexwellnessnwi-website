const ALLOWED_ORIGINS = new Set([
  "https://apexwellnessnwi.com",
  "https://www.apexwellnessnwi.com",
]);

function headers(origin) {
  const values = {
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "Content-Type": "application/json; charset=utf-8",
    "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=15552000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    values["Access-Control-Allow-Origin"] = origin;
    values.Vary = "Origin";
  }

  return values;
}

function json(origin, status, message) {
  return new Response(JSON.stringify({ ok: false, message }), {
    status,
    headers: headers(origin),
  });
}

export async function onRequest({ request }) {
  const origin = request.headers.get("Origin") || "";

  if (new URL(request.url).protocol !== "https:") {
    return json(origin, 400, "A secure HTTPS connection is required.");
  }

  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return json("", 403, "This request is not allowed.");
  }

  return json(
    origin,
    410,
    "The priority-list endpoint has been retired. Use the Founding Patient consultation form.",
  );
}

import { onRequest as handlePriorityRequest } from "../functions/api/priority.js";

function notFound() {
  return new Response(JSON.stringify({
    ok: false,
    message: "The requested API endpoint was not found.",
  }), {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      "Content-Type": "application/json; charset=utf-8",
      "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
      "Referrer-Policy": "no-referrer",
      "Strict-Transport-Security": "max-age=15552000; includeSubDomains",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}

export async function handleWorkerRequest(request, env, ctx = {}) {
  const url = new URL(request.url);

  if (url.pathname === "/api/priority") {
    return handlePriorityRequest({
      request,
      env,
      waitUntil: typeof ctx.waitUntil === "function" ? ctx.waitUntil.bind(ctx) : undefined,
      passThroughOnException: typeof ctx.passThroughOnException === "function"
        ? ctx.passThroughOnException.bind(ctx)
        : undefined,
    });
  }

  // Static assets are deliberately not fetched here. Wrangler serves them directly
  // and invokes this Worker first only for the configured /api/* routes.
  return notFound();
}

export default {
  fetch(request, env, ctx) {
    return handleWorkerRequest(request, env, ctx);
  },
};

import { onRequest as handleFoundingConsultationRequest, onAppointmentRequest } from "../functions/api/founding-consultation.js";
import { onRequest as handlePexyFollowupRequest } from "../functions/api/pexy-followup.js";
import { onRequest as handleRetiredPriorityRequest } from "../functions/api/priority.js";
import {
  handleLaunchEmailAction,
  handleLaunchEmailWebhook,
  runLaunchEmailQueue,
} from "./launch-email.mjs";

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

  if (url.pathname === '/api/pexy-followup') {
    return handlePexyFollowupRequest({ request, env });
  }

  if (url.pathname === '/api/appointment-contact') {
    return onAppointmentRequest({ request, env });
  }

  if (url.pathname === "/api/launch-email/webhook") {
    return handleLaunchEmailWebhook(request, env);
  }
  if (url.pathname === "/api/launch-email/verify"
    || url.pathname === "/api/launch-email/unsubscribe") {
    return handleLaunchEmailAction(request, env);
  }

  if (url.pathname === "/api/founding-consultation") {
    return handleFoundingConsultationRequest({
      request,
      env,
      waitUntil: typeof ctx.waitUntil === "function" ? ctx.waitUntil.bind(ctx) : undefined,
      passThroughOnException: typeof ctx.passThroughOnException === "function"
        ? ctx.passThroughOnException.bind(ctx)
        : undefined,
    });
  }

  if (url.pathname === "/api/priority") {
    return handleRetiredPriorityRequest({
      request,
      env,
      waitUntil: typeof ctx.waitUntil === "function" ? ctx.waitUntil.bind(ctx) : undefined,
      passThroughOnException: typeof ctx.passThroughOnException === "function"
        ? ctx.passThroughOnException.bind(ctx)
        : undefined,
    });
  }

  // Google Search Console ownership check. Served here because static asset
  // handling redirects .html paths, and Google will not verify through a redirect.
  if (url.pathname === "/google07a86ae9e08bbe79.html" && (request.method === "GET" || request.method === "HEAD")) {
    return new Response("google-site-verification: google07a86ae9e08bbe79.html", {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff" },
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
  scheduled(_event, env, ctx) {
    ctx.waitUntil(runLaunchEmailQueue(env).catch(() => {
      // Do not log SQL or provider exceptions, which may contain contact data.
      console.error("Launch email dispatch failed");
    }));
  },
};

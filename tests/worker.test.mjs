import assert from "node:assert/strict";
import test from "node:test";
import worker, { handleWorkerRequest } from "../src/worker.mjs";

const ORIGIN = "https://apexwellnessnwi.com";

test("delegates the exact Founding Patient endpoint to its request handler", async () => {
  const response = await worker.fetch(new Request(`${ORIGIN}/api/founding-consultation`, {
    method: "GET",
    headers: { Origin: ORIGIN },
  }), {}, {});

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "POST, OPTIONS");
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), ORIGIN);
});

test("delegates only the exact Pexy follow-up endpoint", async () => {
  const response = await worker.fetch(new Request(`${ORIGIN}/api/pexy-followup`, {
    method: "GET",
    headers: { Origin: ORIGIN },
  }), {}, {});
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "POST, OPTIONS");
  for (const path of ["/api/pexy-followup/", "/api/pexy-followup-extra", "/API/pexy-followup"]) {
    const unknown = await worker.fetch(new Request(`${ORIGIN}${path}`), {}, {});
    assert.equal(unknown.status, 404, path);
  }
});

test("delegates the exact legacy Priority endpoint to its retired handler", async () => {
  for (const method of ["GET", "POST"]) {
    const response = await worker.fetch(new Request(`${ORIGIN}/api/priority`, {
      method,
      headers: { Origin: ORIGIN },
      body: method === "POST" ? "{}" : undefined,
    }), {}, {});

    assert.equal(response.status, 410);
    assert.match((await response.json()).message, /retired/i);
  }
});

test("returns a hardened JSON 404 for unknown API routes", async () => {
  const response = await handleWorkerRequest(
    new Request(`${ORIGIN}/api/unknown`),
    { ASSETS: { fetch: () => { throw new Error("must not fetch assets"); } } },
  );

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Content-Type"), "application/json; charset=utf-8");
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(response.headers.get("Strict-Transport-Security"), "max-age=15552000; includeSubDomains");
  assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
  assert.match(response.headers.get("Content-Security-Policy"), /default-src 'none'/);
  assert.deepEqual(await response.json(), {
    ok: false,
    message: "The requested API endpoint was not found.",
  });
});

test("does not serve assets if invoked for a non-API path", async () => {
  let assetFetches = 0;
  const response = await worker.fetch(new Request(`${ORIGIN}/index.html`), {
    ASSETS: { fetch: () => { assetFetches += 1; } },
  }, {});

  assert.equal(response.status, 404);
  assert.equal(assetFetches, 0);
});

test("treats trailing-slash, case, and lookalike paths as unknown endpoints", async () => {
  for (const path of [
    "/api/founding-consultation/",
    "/api/founding-consultation-extra",
    "/API/founding-consultation",
    "/api/priority/",
    "/api/priority-extra",
    "/API/priority",
  ]) {
    const response = await worker.fetch(new Request(`${ORIGIN}${path}`), {}, {});
    assert.equal(response.status, 404, path);
  }
});

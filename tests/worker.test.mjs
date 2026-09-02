import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const foundingSource = await readFile(
  new URL("../functions/api/founding-consultation.js", import.meta.url),
  "utf8",
);
const prioritySource = await readFile(new URL("../functions/api/priority.js", import.meta.url), "utf8");
const foundingUrl = `data:text/javascript;base64,${Buffer.from(foundingSource).toString("base64")}`;
const priorityUrl = `data:text/javascript;base64,${Buffer.from(prioritySource).toString("base64")}`;
const workerSource = (await readFile(new URL("../src/worker.mjs", import.meta.url), "utf8"))
  .replace("../functions/api/founding-consultation.js", foundingUrl)
  .replace("../functions/api/priority.js", priorityUrl);
const { default: worker, handleWorkerRequest } = await import(
  `data:text/javascript;base64,${Buffer.from(workerSource).toString("base64")}`
);

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

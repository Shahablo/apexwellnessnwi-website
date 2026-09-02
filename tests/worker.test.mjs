import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const prioritySource = await readFile(new URL("../functions/api/priority.js", import.meta.url), "utf8");
const priorityUrl = `data:text/javascript;base64,${Buffer.from(prioritySource).toString("base64")}`;
const workerSource = (await readFile(new URL("../src/worker.mjs", import.meta.url), "utf8"))
  .replace("../functions/api/priority.js", priorityUrl);
const { default: worker, handleWorkerRequest } = await import(
  `data:text/javascript;base64,${Buffer.from(workerSource).toString("base64")}`
);

const ORIGIN = "https://apexwellnessnwi.com";

test("delegates the exact Priority endpoint to its request handler", async () => {
  const response = await worker.fetch(new Request(`${ORIGIN}/api/priority`, {
    method: "GET",
    headers: { Origin: ORIGIN },
  }), {}, {});

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "POST, OPTIONS");
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), ORIGIN);
});

test("returns a hardened JSON 404 for unknown API routes", async () => {
  const response = await handleWorkerRequest(
    new Request(`${ORIGIN}/api/unknown`),
    { ASSETS: { fetch: () => { throw new Error("must not fetch assets"); } } },
  );

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Content-Type"), "application/json; charset=utf-8");
  assert.equal(response.headers.get("Cache-Control"), "no-store");
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

test("treats trailing-slash and lookalike paths as unknown endpoints", async () => {
  for (const path of ["/api/priority/", "/api/priority-extra", "/API/priority"]) {
    const response = await worker.fetch(new Request(`${ORIGIN}${path}`), {}, {});
    assert.equal(response.status, 404, path);
  }
});

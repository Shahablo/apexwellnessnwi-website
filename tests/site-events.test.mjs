import assert from "node:assert/strict";
import test from "node:test";

import { handleSiteEvent } from "../src/site-events.mjs";

function database() {
  const calls = [];
  return {
    calls,
    prepare(sql) {
      return {
        bind(...values) {
          calls.push({ sql, values });
          return { run: async () => ({ success: true }) };
        },
      };
    },
  };
}

function request(payload, headers = {}) {
  return new Request("https://apexwellnessnwi.com/api/site-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "https://apexwellnessnwi.com",
      "Sec-Fetch-Site": "same-origin",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}

test("stores only an aggregate daily counter", async () => {
  const DB = database();
  const result = await handleSiteEvent(request({
    event: "page_view",
    page_group: "care",
    target_group: "none",
  }), { DB }, new Date("2026-10-28T03:30:00.000Z"));

  assert.equal(result.status, 202);
  assert.equal(DB.calls.length, 1);
  assert.deepEqual(DB.calls[0].values, ["2026-10-27", "page_view", "care", "none", "2026-10-28T03:30:00.000Z"]);
  assert.doesNotMatch(DB.calls[0].sql, /ip|user.agent|referrer|url|email|phone|question/i);
});

test("rejects extra fields and care-specific labels", async () => {
  const DB = database();
  const extraField = await handleSiteEvent(request({
    event: "page_view",
    page_group: "care",
    target_group: "none",
    path: "/weight-management/",
  }), { DB });
  const careSpecific = await handleSiteEvent(request({
    event: "page_view",
    page_group: "weight_management",
    target_group: "none",
  }), { DB });

  assert.equal(extraField.status, 400);
  assert.equal(careSpecific.status, 400);
  assert.equal(DB.calls.length, 0);
});

test("requires a same-origin request", async () => {
  const DB = database();
  const result = await handleSiteEvent(request({
    event: "cta_click",
    page_group: "home",
    target_group: "launch_list",
  }, { Origin: "https://example.com" }), { DB });

  assert.equal(result.status, 403);
  assert.equal(DB.calls.length, 0);
});

test("rejects invalid event and target combinations", async () => {
  const DB = database();
  const result = await handleSiteEvent(request({
    event: "page_view",
    page_group: "home",
    target_group: "launch_list",
  }), { DB });

  assert.equal(result.status, 400);
  assert.equal(DB.calls.length, 0);
});

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

function request(payload, headers = {}, cf = undefined) {
  const result = new Request("https://apexwellnessnwi.com/api/site-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "https://apexwellnessnwi.com",
      "Sec-Fetch-Site": "same-origin",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
  if (cf) Object.defineProperty(result, "cf", { value: cf });
  return result;
}

const base = {
  event: "page_view", page_key: "weight-management", target_group: "none", form_group: "none",
  utm_source: "google", utm_medium: "organic", utm_campaign: "fall-launch",
  referrer_domain: "google.com", device_class: "phone",
};

test("stores only an aggregate daily counter", async () => {
  const DB = database();
  const result = await handleSiteEvent(request(base, {}, { country: "US", regionCode: "IN" }), { DB }, new Date("2026-10-28T03:30:00.000Z"));

  assert.equal(result.status, 202);
  assert.equal(DB.calls.length, 1);
  assert.deepEqual(DB.calls[0].values, ["2026-10-27", "page_view", "weight-management", "none", "none", "google", "organic", "fall-launch", "google.com", "phone", "indiana", "2026-10-28T03:30:00.000Z"]);
  assert.doesNotMatch(DB.calls[0].sql, /ip|user.agent|full.url|query|email|phone|question/i);
});

test("rejects extra fields and unsafe dimensions", async () => {
  const DB = database();
  const extraField = await handleSiteEvent(request({ ...base, path: "/weight-management/" }), { DB });
  const unsafeCampaign = await handleSiteEvent(request({ ...base, utm_campaign: "Jane Doe wants help" }), { DB });

  assert.equal(extraField.status, 400);
  assert.equal(unsafeCampaign.status, 400);
  assert.equal(DB.calls.length, 0);
});

test("requires a same-origin request", async () => {
  const DB = database();
  const result = await handleSiteEvent(request({ ...base, event: "cta_click", target_group: "launch_list" }, { Origin: "https://example.com" }), { DB });

  assert.equal(result.status, 403);
  assert.equal(DB.calls.length, 0);
});

test("rejects invalid event and target combinations", async () => {
  const DB = database();
  const result = await handleSiteEvent(request({ ...base, target_group: "launch_list" }), { DB });

  assert.equal(result.status, 400);
  assert.equal(DB.calls.length, 0);
});

test("accepts form funnel totals but no form values", async () => {
  const DB = database();
  const accepted = await handleSiteEvent(request({
    ...base, event: "form_submit_success", target_group: "none", form_group: "plan_visit",
  }), { DB });
  const rejected = await handleSiteEvent(request({
    ...base, event: "form_start", form_group: "plan_visit", email: "person@example.com",
  }), { DB });
  assert.equal(accepted.status, 202);
  assert.equal(rejected.status, 400);
  assert.equal(DB.calls.length, 1);
});

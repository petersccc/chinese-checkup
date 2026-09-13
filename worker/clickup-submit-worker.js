/**
 * clickup-submit-worker.js
 * -------------------------
 * Cloudflare Worker: receives the checkup's results-slide submission
 * (email + company name + optional ref code) and creates or updates a
 * task in ClickUp's "Lead Magnet" list (inside the "Projekte" folder),
 * per the exact logic below. This is the only place the ClickUp API
 * token is used -- it's read from env.CLICKUP_API_TOKEN, a Worker
 * secret, never hardcoded here and never present in the site's own code
 * or repository.
 *
 * Logic (as specified):
 *   - If the page URL had a `ref` parameter, search the list for a task
 *     whose "Ref Code" field matches it.
 *     - If found: update that task -- set E-Mail to the submitted email
 *       and check "Check-up completed". Source, Version, Outreach Date,
 *       and the task name are left untouched.
 *   - If there was no `ref` parameter, or no task matched it: create a
 *     new task instead -- named using the submitted company name, with
 *     E-Mail filled in, Version set to "China", Source set to "Cold",
 *     and "Check-up completed" checked. Ref Code is left empty (ClickUp
 *     leaves custom fields unset by default, so this needs no action).
 *
 * IDs below were looked up directly against the live "Lead Magnet" list
 * via the ClickUp API (not guessed) on 2026-09-13. If the list is ever
 * rebuilt or its fields renamed, these will need re-resolving.
 */

// "Lead Magnet" list, inside the "Projekte" folder, in the Team-Space workspace.
const LIST_ID = "901219622537";

// Custom field IDs on that list.
const FIELD_EMAIL = "c342330b-8efe-41e3-88e5-19d2126e6054"; // E-Mail (email)
const FIELD_SOURCE = "1e4c9e6f-f0eb-43b7-8ef1-e5084f62ffac"; // Source (dropdown)
const FIELD_VERSION = "0f5799ba-0ec1-4c02-a3de-c268508937b6"; // Version (dropdown)
const FIELD_REF_CODE = "955d616f-172b-4b7c-b853-2f317f5fb146"; // Ref Code (short_text)
const FIELD_CHECKUP_COMPLETED = "7b096a97-b6ff-4a5c-ae34-8b358789e5e4"; // Check-up completed (checkbox)
// FIELD_COMPANY ("Company", short_text) = d2d67d9c-9e90-411c-8854-cf51b770d2c0 --
// defined here for reference but NOT written to. The spec only says the new
// task should be *named* using the company name, not that this separate
// custom field should also be filled -- left alone accordingly. Trivial to
// add a setCustomField(taskId, FIELD_COMPANY, companyName) call below if
// that turns out to be wanted too.

// Dropdown option UUIDs.
const VERSION_OPTION_CHINA = "c055836d-0aa2-4f0c-9c3c-f0d60687a1e2";
const SOURCE_OPTION_COLD = "d533f592-a027-4914-8bd0-8cd4a0d89dd1";

const CLICKUP_API = "https://api.clickup.com/api/v2";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    if (request.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
    }

    const token = env.CLICKUP_API_TOKEN;
    if (!token) {
      // The secret hasn't been set yet -- see worker/README.md.
      return jsonResponse({ ok: false, error: "Server misconfigured: missing ClickUp token" }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ ok: false, error: "Invalid JSON body" }, 400);
    }

    const email = String(body.email || "").trim();
    const companyName = String(body.companyName || "").trim();
    const refCode = String(body.refCode || "").trim();

    if (!email || !companyName) {
      return jsonResponse({ ok: false, error: "email and companyName are required" }, 400);
    }

    try {
      const matchedTaskId = refCode ? await findTaskByRefCode(token, refCode) : null;

      if (matchedTaskId) {
        await setCustomField(token, matchedTaskId, FIELD_EMAIL, email);
        await setCustomField(token, matchedTaskId, FIELD_CHECKUP_COMPLETED, true);
        return jsonResponse({ ok: true, action: "updated", taskId: matchedTaskId });
      }

      const newTaskId = await createTask(token, companyName);
      await setCustomField(token, newTaskId, FIELD_EMAIL, email);
      await setCustomField(token, newTaskId, FIELD_VERSION, VERSION_OPTION_CHINA);
      await setCustomField(token, newTaskId, FIELD_SOURCE, SOURCE_OPTION_COLD);
      await setCustomField(token, newTaskId, FIELD_CHECKUP_COMPLETED, true);
      return jsonResponse({ ok: true, action: "created", taskId: newTaskId });
    } catch (err) {
      return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) }, 502);
    }
  },
};

/**
 * Searches the Lead Magnet list for a task whose "Ref Code" custom field
 * equals refCode. Includes closed/completed tasks in the search, since a
 * previously-outreached lead may already be marked done. Returns the
 * first match's task id, or null.
 */
async function findTaskByRefCode(token, refCode) {
  const filter = encodeURIComponent(
    JSON.stringify([{ field_id: FIELD_REF_CODE, operator: "=", value: refCode }])
  );
  const url = `${CLICKUP_API}/list/${LIST_ID}/task?include_closed=true&custom_fields=${filter}`;
  const res = await fetch(url, { headers: { Authorization: token } });
  if (!res.ok) throw new Error(`ClickUp search failed (${res.status})`);
  const data = await res.json();
  const tasks = data.tasks || [];
  return tasks.length > 0 ? tasks[0].id : null;
}

async function createTask(token, name) {
  const res = await fetch(`${CLICKUP_API}/list/${LIST_ID}/task`, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`ClickUp create task failed (${res.status})`);
  const data = await res.json();
  return data.id;
}

async function setCustomField(token, taskId, fieldId, value) {
  const res = await fetch(`${CLICKUP_API}/task/${taskId}/field/${fieldId}`, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error(`ClickUp set field ${fieldId} failed (${res.status})`);
}

function corsHeaders() {
  return {
    // Tighten this to the site's real domain once it has one, rather
    // than leaving it open to any origin.
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

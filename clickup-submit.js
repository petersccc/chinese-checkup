/**
 * clickup-submit.js
 * ------------------
 * Front-end side of the ClickUp integration. On submit, this posts the
 * submitted email, company name, and any `ref` URL parameter to a
 * Cloudflare Worker, which holds the actual ClickUp API token (as a
 * Worker secret, never present anywhere in this site's code) and does
 * the create-or-update logic against the "Lead Magnet" list.
 *
 * This file does not talk to ClickUp directly and never sees the API
 * token -- see worker/clickup-submit-worker.js for that.
 */

// TODO: replace with the real Worker URL once it's deployed (see
// worker/README.md for the deployment checklist). Until then, submission
// will fail silently (logged to the console) without blocking the UI --
// the visitor still sees the normal "thank you" state.
const CLICKUP_WORKER_URL = "https://summer-disk-8a2f.nachhilfe-kp.workers.dev";

/**
 * Reads the `ref` query parameter from the current page URL, e.g.
 * https://example.com/?ref=abc123 -> "abc123". Returns "" if absent.
 * This is the only place the ref code is read from the URL; everything
 * downstream just passes the string along.
 */
function getRefCodeFromUrl() {
  try {
    return new URLSearchParams(window.location.search).get("ref") || "";
  } catch (e) {
    return "";
  }
}

/**
 * Posts the submission to the Cloudflare Worker. Best-effort: failures
 * are logged to the console but never block or change the on-page submit
 * flow (the visitor still reaches the "thank you" state regardless of
 * whether ClickUp is reachable).
 */
async function submitToClickUp({ email, companyName }) {
  const refCode = getRefCodeFromUrl();

  try {
    const response = await fetch(CLICKUP_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, companyName, refCode }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[clickup-submit] Worker responded with an error:", response.status, text);
      return { ok: false };
    }

    const result = await response.json().catch(() => ({}));
    console.log("[clickup-submit] ClickUp submission result:", result);
    return { ok: true, result };
  } catch (err) {
    console.error("[clickup-submit] Failed to reach the ClickUp Worker:", err);
    return { ok: false, error: err };
  }
}

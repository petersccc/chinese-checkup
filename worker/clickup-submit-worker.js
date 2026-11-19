/**
 * clickup-submit-worker.js  (name kept so the front end and the docs stay the same)
 * ---------------------------------------------------------------------------------
 * Cloudflare Worker: receives the checkup's results-slide submission
 * (email + company name + optional ref code) and saves the contact in Brevo,
 * list "Checkup China" (#12, folder "Lead magnets"), with COMPANY,
 * LEAD_MAGNET and REF_CODE. Katarina gets a short notification email.
 * The Brevo API key is the Worker secret BREVO_API_KEY, never in this file.
 * Live Worker: summer-disk-8a2f.nachhilfe-kp.workers.dev.
 * (Until 19 Nov 2026 this created or updated a task in ClickUp.)
 */

const LIST_ID = 12;
const LEAD_MAGNET = "Checkup China";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });
    if (request.method !== "POST") return jsonResponse({ ok: false, error: "Method not allowed" }, 405);

    const key = env.BREVO_API_KEY;
    if (!key) return jsonResponse({ ok: false, error: "Server misconfigured: missing Brevo key" }, 500);

    let body;
    try { body = await request.json(); } catch (e) { return jsonResponse({ ok: false, error: "Invalid JSON body" }, 400); }

    const email = String(body.email || "").trim().slice(0, 200);
    const companyName = String(body.companyName || "").trim().slice(0, 200);
    const refCode = String(body.refCode || "").trim().slice(0, 100);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !companyName) {
      return jsonResponse({ ok: false, error: "email and companyName are required" }, 400);
    }

    try {
      await saveToBrevo(key, email, LIST_ID, { COMPANY: companyName, LEAD_MAGNET, ...(refCode ? { REF_CODE: refCode } : {}) });
    } catch (err) {
      return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) }, 502);
    }
    await notify(key, `${LEAD_MAGNET}: ${companyName} (${email})`, [
      `New ${LEAD_MAGNET} completed.`,
      "",
      "Company: " + companyName,
      "Email: " + email,
      "Ref code: " + (refCode || "-"),
      "Completed: " + berlinNow() + " (Berlin time)",
      "",
      `Saved in Brevo, list "${LEAD_MAGNET}" (folder Lead magnets).`,
    ].join("\n"), email);
    return jsonResponse({ ok: true, action: "saved" });
  },
};

function corsHeaders() {
  return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
}
function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...corsHeaders() } });
}

// ---- Brevo (same helper in every lead magnet backend) ----
const BREVO = "https://api.brevo.com/v3/";
const NOTIFY_TO = "kontakt@peters-crosscultural.de";
const SENDER = "kontakt@peters-crosscultural.de";
function berlinNow() { return new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin", dateStyle: "medium", timeStyle: "short" }); }
function brevo(key, path, body) {
  return fetch(BREVO + path, { method: "POST", headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
}
async function saveToBrevo(key, email, listId, attributes) {
  const add = (attrs) => brevo(key, "contacts", { email, attributes: attrs, listIds: [listId], updateEnabled: true });
  let res = await add(attributes);
  if (res.status === 400) res = await add({}); // an attribute is unknown in Brevo: still save the contact
  if (!res.ok) throw new Error(`Brevo contact failed (${res.status})`);
}
async function notify(key, subject, text, replyTo) {
  try {
    const res = await brevo(key, "smtp/email", {
      sender: { name: "Lead magnets", email: SENDER }, to: [{ email: NOTIFY_TO }],
      ...(replyTo ? { replyTo: { email: replyTo } } : {}), subject, textContent: text,
    });
    if (!res.ok) console.log("Brevo notification failed", res.status, await res.text());
  } catch (e) { console.log("Brevo notification error", String(e)); }
}

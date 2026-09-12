/**
 * email-template.js
 * ------------------
 * Builds the follow-up email described in "checkup-build-specification
 * 2.md", section "Follow up email". This is the template/mechanism only.
 * Two pieces of content are explicitly NOT settled per that spec and must
 * not be guessed:
 *   1. Which service package maps to each weakest section (PACKAGE_MAP below).
 *   2. The wording of the deeper pattern language and the email as a whole
 *      (DEEPER_PATTERN below, and the surrounding copy in buildFollowUpEmail).
 * Both are filled with clearly marked TODO placeholders. Do not deploy the
 * live send until both are supplied and reviewed.
 *
 * This file does not send anything itself — see the `sendFollowUpEmail`
 * stub at the bottom for the integration point.
 */

// TODO (spec, "Follow up email"): map each weakest-section key to the
// name of the Katarina Peters service package that addresses that gap.
// Per the tone rules, the mapping may name the package but must never
// describe the method or technique used inside it.
const PACKAGE_MAP = {
  communication: "[TODO: package name for Communication gap]",
  planning: "[TODO: package name for Planning gap]",
  representation: "[TODO: package name for Representation gap]",
  trust: "[TODO: package name for Trust and relationship gap]",
  decisions: "[TODO: package name for Decisions, speed, and channels gap]",
  longevity: "[TODO: package name for Longevity of adjustment gap]",
};

// TODO (spec, "Follow up email"): a more detailed naming of the pattern
// behind the weakest section than the results-slide weakness line gives.
// Must describe what is happening and what it costs, never a method for
// fixing it (tone rules).
const DEEPER_PATTERN = {
  communication: "[TODO: deeper pattern language for Communication]",
  planning: "[TODO: deeper pattern language for Planning]",
  representation: "[TODO: deeper pattern language for Representation]",
  trust: "[TODO: deeper pattern language for Trust and relationship]",
  decisions: "[TODO: deeper pattern language for Decisions, speed, and channels]",
  longevity: "[TODO: deeper pattern language for Longevity of adjustment]",
};

// TODO: real Calendly link, once confirmed.
const DISCOVERY_CALL_LINK = "[TODO: Calendly discovery-call link]";

/**
 * Builds the section-by-section answer overview: what was checked and
 * what was not, per section 9's first bullet ("Their full answer
 * overview, section by section, what they checked and did not check.").
 */
function buildAnswerOverview(scoreResult) {
  return scoreResult.sections
    .map((s) => {
      const lines = s.items.map(
        (item, i) => `   ${item.checked ? "[x]" : "[ ]"} ${item.text.en}`
      );
      return `${s.label.en} — ${s.earned}/${s.max}\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

/**
 * Composes the follow-up email (subject + plain-text body) from a
 * completed scoreResult (see app.js `scoreAnswers`). Returns an object,
 * it does not send anything.
 */
function buildFollowUpEmail(scoreResult, email) {
  const weakestKey = scoreResult.weakest.key;
  const weakestLabel = scoreResult.weakest.label.en;

  const subject = "Your Cross-Cultural Checkup overview";

  const body = `Hello,

Thank you for completing the Quick Cross Cultural Self Evaluation Checkup.

Your overall result: ${scoreResult.overall.toFixed(1)}%

YOUR ANSWER OVERVIEW
${buildAnswerOverview(scoreResult)}

A CLOSER LOOK AT ${weakestLabel.toUpperCase()}
${DEEPER_PATTERN[weakestKey]}

WHERE THIS COULD GO NEXT
${PACKAGE_MAP[weakestKey]}

If you'd like to talk it through, you can book a discovery call here:
${DISCOVERY_CALL_LINK}

Best,
Katarina Peters
Peters Cross-Cultural Communication`;

  return { to: email, subject, body };
}

/**
 * Integration stub. Per the spec's "Data protection and privacy" section,
 * once someone submits their email the processors involved are Cloudflare
 * (hosting), ClickUp (where the email and answer overview are stored), and
 * Calendly (if a call gets booked). Each needs its own data processing
 * agreement, an administrative step for Katarina, not something built here.
 *
 * Retention (per that same section, now confirmed): if someone leaves
 * their email and answers but never books a call and never responds to
 * the follow-up, the record is deleted after 12 months. If they do
 * respond, or become a client, their information moves into normal
 * business records instead, governed separately from this tool. This is
 * a retention policy for whatever stores the record (e.g. ClickUp) to
 * enforce, not something this static front-end can implement itself.
 *
 * This function is NOT wired to a real backend. Wire it up once:
 *   - a backend endpoint exists (e.g. a Cloudflare Worker) to actually
 *     send mail and write the record to ClickUp, and
 *   - PACKAGE_MAP and DEEPER_PATTERN above are filled in and reviewed.
 *
 * Until then it only logs the composed email to the console and resolves,
 * so the front-end submit flow can be demonstrated end to end.
 */
async function sendFollowUpEmail(scoreResult, email) {
  const emailPayload = buildFollowUpEmail(scoreResult, email);

  // TODO: replace with a real call, e.g.
  // await fetch("/api/submit-checkup", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email, scoreResult, emailPayload }),
  // });
  console.log("[email-template] Follow-up email composed (not sent — no backend wired yet):", emailPayload);

  return { ok: true, simulated: true };
}

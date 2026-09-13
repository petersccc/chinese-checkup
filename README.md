# Quick Cross Cultural Self Evaluation Checkup — Chinese-company version

Built from `checkup-build-specification 3.md`, which supersedes specs 1
and 2 and the earlier `chinese-checkup-build-context_1.md`. Most notably
vs. spec 1: the full Chinese translation is now real, reviewed, approved
copy (not a placeholder), including the six section labels added in spec
3; the opening page gained a name line under the photo and a shortened
credit line; the results slide gained a small second photo next to the
CTA, a merged CTA/spam-folder sentence, and darker/bolder statement boxes;
the progress dots gained a numeric position indicator (e.g. "3/6"); and
spec 3 replaced the earlier "no analytics" architecture with Cloudflare
Web Analytics. See "What's implemented" below for the full list.

Plain HTML/CSS/JS, no build step, no dependencies. Open `index.html`
directly in a browser, or serve the folder with any static file server (a
minimal one is included as `serve.ps1` — run `pwsh -File serve.ps1` and
visit `http://localhost:8743`; this is what `.claude/launch.json` uses to
preview the app during development).

## Files

- `index.html` — page shell, loads the scripts below in order, plus the
  Cloudflare Web Analytics beacon (see "What's implemented").
- `styles.css` — all styling. Palette matches the spec's palette rules; the
  opening and results slides match the confirmed reference mockup
  (`opening-and-results-updated.html`) exactly, including the new
  `--ink-deep` color used only for the two results statement boxes.
- `content.js` — every locked string (English and the now-real Chinese
  translation), the six question sections, and the results-slide
  strength/weakness lines.
- `photo-data.js` — both of Katarina Peters' photos, embedded as `data:`
  URI constants (`PHOTO_DATA_URI` for the opening page, `PHOTO_DATA_URI_CTA`
  for the small photo next to the results-slide CTA), encoded directly from
  `katarina-photo.jpeg` / `katarina-photo-2.jpeg`. Per the spec, both must
  stay embedded directly in the page, not linked to separate image files.
- `app.js` — state, navigation, scoring, rendering, and the results
  count-up animation.
- `email-template.js` — builds the follow-up email content and is the
  integration point for actually sending it. Not wired to a backend yet.
- `clickup-submit.js` — front-end side of the real, working ClickUp
  integration: reads the page's `?ref=` parameter and posts it plus the
  submitted email/company name to a Cloudflare Worker. Never sees the
  ClickUp API token.
- `worker/` — the Cloudflare Worker itself (`clickup-submit-worker.js`),
  which holds the ClickUp API token (as a Worker secret) and does the
  actual create-or-update against the Lead Magnet list. See
  `worker/README.md` for the one-time deployment checklist.
- `privacy-notice.html` — placeholder page. The privacy banner on question
  slides links here until the real privacy notice exists.

## What's implemented

- All 8 slides, mobile-first, adapted for desktop at 640px+. Verified on an
  actual emulated mobile viewport (375×812, Android Chrome UA + touch), not
  just a resized desktop window.
- Opening slide: compact title, large dominant circular photo, her name
  directly under it (italic/bold, matching the bottom credit line's
  treatment), the subtitle as the most prominent text (medium weight,
  olive, not bold), a start button, and the shortened credit line ("Peters
  Cross-Cultural Communication" only — it no longer repeats her name)
  pinned near the bottom. Nothing else on the page.
- Cards (not checkboxes), progress dots with a numeric position indicator
  next to them (e.g. "3/6", dark olive, reflecting position among the six
  question slides only — never a score), back navigation to any earlier
  slide, no partial results before the results slide.
- Question slides require at least one card selected somewhere in the
  section before the Next / "See my results" button is enabled (doesn't
  require every item answered, just not left entirely blank).
- Scoring exactly as specified: 0/2 points per item by polarity, equal
  16.67%-weighted sections, overall rounded to one decimal.
- Results slide: animated count-up; two separate, plainly labeled
  statements ("Where you're strongest" / "Where to pay attention") shown
  in medium-weight, deepened near-black brown (`--ink-deep`, `#2A1F16`) —
  distinct from and darker than ordinary body text, never pure black —
  with no connecting sentence between them; a CTA row with a small circular
  photo of Katarina next to the CTA text (the one place on the page in her
  own first-person voice), the spam-folder note merged into that same
  paragraph as a quieter, smaller aside rather than a separate line; a
  required company-name field and email field (validated in that order,
  then consent); required consent checkbox; and a smaller version of the
  credit line below the button (shown in both the pre- and post-submit
  states). Typed field values are kept in `state`, not just the DOM, so a
  validation error on one field doesn't erase what was typed in another.
- Real ClickUp integration: on submit, the email, company name, and any
  `?ref=` URL parameter are posted to a Cloudflare Worker
  (`clickup-submit.js` → `worker/clickup-submit-worker.js`), which:
  - if a ref code was present, searches the **Lead Magnet** list (inside
    the **Projekte** folder) for a task whose **Ref Code** field matches
    it, and if found, sets that task's **E-Mail** and checks **Check-up
    completed**, leaving its name, Source, Version, and Outreach Date
    untouched;
  - otherwise (no ref code, or no match) creates a new task named after
    the submitted company name, with **E-Mail** filled in, **Version**
    set to China, **Source** set to Cold, and **Check-up completed**
    checked, leaving **Ref Code** empty.

  The list/field/dropdown-option IDs baked into the Worker were looked up
  directly against the live list via the ClickUp API, not guessed. This
  call is best-effort: if the Worker is unreachable (e.g. before it's
  deployed) the visitor still reaches the "thank you" state, and the
  failure is only logged to the console.
- Full language toggle: every UI string, all six questions, the six
  section labels, and the results-slide content switch between English and
  the real, approved Chinese translation. Katarina's name, the business
  name, the numeric slide-position indicator, and the email placeholder
  ("you@company.com") are identical in both languages, per spec. A handful
  of narrow strings were never included in the provided translation and
  remain clearly marked placeholders rather than invented Chinese (see
  "Deliberately left as placeholders" below) — search `content.js` for
  `ZH PLACEHOLDER`.
- Cloudflare Web Analytics: a cookieless beacon script in `index.html`,
  per spec 3's updated "Data protection and privacy" section. It processes
  some aggregate technical data (approximate location, browser type) but
  sets no cookies, so the checklist's anonymity claim still holds for
  anyone who doesn't leave an email. The beacon token is a placeholder
  (`YOUR_BEACON_TOKEN`) — see "Deliberately left as placeholders."

## Deliberately left as placeholders

1. **A handful of UI strings with no supplied Chinese translation** —
   `content.js`, `zh.submitInvalidEmail`, `zh.submitNeedsConsent`,
   `zh.submittedHeadline`, `zh.submittedBody`, `zh.companyPlaceholder`,
   `zh.submitNeedsCompany`. No spec has covered these, so they're left as
   placeholders rather than guessed. (The six section labels that were
   placeholders through spec 2 are now filled in with spec 3's real
   translations — 沟通, 规划, 对接人, 信任与关系, 决策、速度与沟通渠道,
   调整能否持续奏效.)
2. **Cloudflare Web Analytics beacon token** — `index.html`,
   `YOUR_BEACON_TOKEN`. The real token comes from Katarina's own Cloudflare
   dashboard (Analytics & Logs > Web Analytics) once she registers this
   site's domain there — that's an administrative step on her side, not
   something guessable here. Until it's replaced, the script loads but
   reports to no real site.
3. **ClickUp Worker URL** — `clickup-submit.js`,
   `CLICKUP_WORKER_URL = "https://YOUR-WORKER-SUBDOMAIN.workers.dev"`.
   Update this once the Worker in `worker/` is deployed (see
   `worker/README.md`) and its real URL is known.
4. **ClickUp API token** — never in this repo at all, by design. It's a
   Cloudflare Worker secret (`CLICKUP_API_TOKEN`), set directly by
   Katarina in the Cloudflare dashboard or via `wrangler secret put` —
   see `worker/README.md`.
5. **Full privacy notice** — `privacy-notice.html` is a stub; the banner
   already links to it, in both languages.
6. **Package-to-gap mapping and deeper pattern wording for the follow-up
   email** — `email-template.js`, `PACKAGE_MAP` and `DEEPER_PATTERN`. The
   spec repeats explicitly that neither should be guessed.
7. **Actual email sending** — `email-template.js`, `sendFollowUpEmail()`.
   Right now it only composes the email and logs it to the console; no
   backend endpoint exists yet. (Unrelated to the ClickUp integration
   above, which is real and working once deployed.) Once someone submits,
   the other processors involved are Cloudflare (hosting) and Calendly
   (discovery call booking) — each needs its own data processing
   agreement, an administrative step for Katarina, not something this
   build does.

## One translated line flagged as provisional by the spec itself

The spec explicitly marks the Chinese spam-folder aside
("也别忘了看看垃圾邮件文件夹哦！") as "draft only, not yet reviewed the way
the rest of this translation was, treat as provisional." It's built in as
given (the spec's instruction was to use it, just flagged for a future
review pass), but it hasn't had the same review as the rest of the
Chinese copy — worth a second look before this goes live.

## Resolved since earlier drafts (reflected in code/comments, not build-time behavior)

- **Retention**: confirmed as 12 months if someone never responds or
  books a call, otherwise the record moves into normal business records.
  Enforced by whatever stores the record (e.g. ClickUp), not by this
  static front-end — noted in `email-template.js` for whoever wires up
  that backend.
- **Analytics/tracking**: spec 2 said none; spec 3 supersedes that and
  specifies Cloudflare Web Analytics instead (cookieless, aggregate
  technical data only). Built as the beacon script in `index.html`, noted
  above and in "Deliberately left as placeholders."

## Notes on a few judgment calls made during the build

- The privacy notice is shown as a persistent banner on every question
  slide (2–7), rather than a one-off interstitial, since it must appear
  "before the first question" and stay truthful throughout.
- The opening slide carries *only* the title, photo, name, subtitle, start
  button, and credit line ("nothing else on this page"). The language
  toggle therefore first appears in the topbar from the first question
  slide onward, not on the opening slide.
- The results slide gets a topbar (back control + language toggle) for
  consistency with the rest of the tool and the general "move back to any
  previous slide" rule, even though the visual-design language only
  mandates a back control on question slides specifically.
- The Next/"See my results" button is disabled (rather than blocked with
  an inline error message) until at least one card is selected in the
  section, since the spec doesn't specify feedback copy for this case and
  the tone rules caution against inventing wording beyond what's given.
- "结果" button label for the last question slide reuses 下一步 (Next),
  since the spec's Chinese navigation section only supplies Back/Next, not
  a separate translation for that button's "See my results" state.
- The results credit line ("Peters Cross-Cultural Communication") renders
  in both the pre-submit form state and the post-submit thank-you state,
  since the spec describes it as sitting below the button generally,
  not as part of either specific state.

- The ClickUp "Lead Magnet" list has its own **Company** custom field
  (short text), separate from the task's name. The instructions for the
  create path only said to *name* the new task using the company name,
  not to also fill that field — so `worker/clickup-submit-worker.js`
  leaves it unset. The field's ID is still defined there in a comment,
  so it's a one-line change if that turns out to be wanted too.
- Company name and email are validated in the order they appear on the
  page (company, then email, then consent), rather than the original
  consent-then-email order, since that's the order a visitor actually
  fills them in.

None of these affect scoring, wording, or the palette — only where a
couple of controls sit or how a state is communicated.

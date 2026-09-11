# Quick Cross Cultural Self Evaluation Checkup — Chinese-company version

Built from `checkup-build-specification 1.md`, which supersedes the earlier
`chinese-checkup-build-context_1.md` (most notably: the results slide is now
two independent statements instead of one blended paragraph — see below).
Plain HTML/CSS/JS, no build step, no dependencies. Open `index.html`
directly in a browser, or serve the folder with any static file server (a
minimal one is included as `serve.ps1` — run `pwsh -File serve.ps1` and
visit `http://localhost:8743`; this is what `.claude/launch.json` uses to
preview the app during development).

## Files

- `index.html` — page shell, loads the scripts below in order.
- `styles.css` — all styling. Palette matches the spec's palette rules; the
  opening slide matches the confirmed "Option A" reference mockup
  (`opening-slide-real-photo.html`) exactly.
- `content.js` — every locked string, the six question sections, and the
  results-slide strength/weakness lines, verbatim from the spec.
- `photo-data.js` — Katarina Peters' photo, embedded as a `data:` URI
  constant (`PHOTO_DATA_URI`), extracted from the reference mockup. Per the
  spec, this must stay embedded directly in the page, not linked to a
  separate image file.
- `app.js` — state, navigation, scoring, rendering, and the results
  count-up animation.
- `email-template.js` — builds the follow-up email content and is the
  integration point for actually sending it. Not wired to a backend yet.
- `privacy-notice.html` — placeholder page. The privacy banner on question
  slides links here until the real privacy notice exists.

## What's implemented

- All 8 slides, mobile-first, adapted for desktop at 640px+.
- Opening slide, confirmed "Option A" layout: compact title near the top,
  a large dominant circular photo directly below it (real photo, embedded
  inline as image data), the subtitle as the most prominent text (medium
  weight, olive, not bold), a start button below that, and the italic
  credit line pinned near the bottom. Nothing else on the page.
- Cards (not checkboxes), progress dots, back navigation to any earlier
  slide, no partial results before the results slide.
- Question slides now require at least one card selected somewhere in the
  section before the Next / "See my results" button is enabled (it doesn't
  require every item answered, just not left entirely blank).
- Scoring exactly as specified: 0/2 points per item by polarity, equal
  16.67%-weighted sections, overall rounded to one decimal.
- Results slide: animated count-up, then two separate, plainly labeled
  statements — "Where you're strongest" (the strongest section's fixed
  strength line) and "Where to pay attention" (the weakest section's fixed
  weakness line) — shown exactly as written in `content.js`, with no
  connecting sentence between them. Strongest and weakest are picked
  independently (each with its own first-in-sequence tie-break), so they
  can legitimately land on the same section; that still renders two
  coherent, separate lines about it. Below that: the CTA line, email
  field, required consent checkbox, and a local "submitted" confirmation
  state.
- Language toggle mechanism, switching every UI string and question
  between `en` and a clearly marked English placeholder for `zh` (search
  `content.js` for `ZH PLACEHOLDER`). No Chinese text has been generated,
  per the spec's explicit instruction. This includes the two results-slide
  headings and the strength/weakness lines' `zh` slots, even though the
  English wording for those is locked, final copy.
- No analytics or tracking of any kind — the spec now confirms this
  explicitly, so nothing here adds any.

## Deliberately left as placeholders (per the spec's open items)

1. **Chinese strings** — every `zh` value in `content.js`.
2. **Full privacy notice** — `privacy-notice.html` is a stub; the banner
   already links to it.
3. **Package-to-gap mapping and deeper pattern wording for the follow-up
   email** — `email-template.js`, `PACKAGE_MAP` and `DEEPER_PATTERN`. The
   spec repeats explicitly that neither should be guessed.
4. **Actual email sending** — `email-template.js`, `sendFollowUpEmail()`.
   Right now it only composes the email and logs it to the console; no
   backend endpoint exists yet. Once someone submits, the processors
   involved are Cloudflare (hosting), ClickUp (storing the email + answer
   overview), and Calendly (discovery call booking) — each needs its own
   data processing agreement, an administrative step for Katarina, not
   something this build does.

## Resolved since the earlier build context (now reflected in the code/comments, not build-time behavior)

- **Retention**: confirmed as 12 months if someone never responds or
  books a call, otherwise the record moves into normal business records.
  This is enforced by whatever stores the record (e.g. ClickUp), not by
  this static front-end — noted in `email-template.js` for whoever wires
  up that backend.
- **Analytics/tracking**: confirmed as none. Nothing to build; noted above.

## Notes on a few judgment calls made during the build

The spec leaves a handful of layout details implicit. Where that happened,
the choice made was the most literal reading of the spec:

- The privacy notice is shown as a persistent banner on every question
  slide (2–7), rather than a one-off interstitial, since it must appear
  "before the first question" and stay truthful throughout.
- The opening slide carries *only* the title, photo, subtitle, start
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

None of these affect scoring, wording, or the palette — only where a
couple of controls sit or how a state is communicated.

/**
 * app.js
 * ------
 * State, navigation, scoring, and rendering for the checkup.
 * Depends on content.js (STRINGS, AUTHOR_NAME, SECTIONS, STRENGTH_LINES,
 * WEAKNESS_LINES), photo-data.js (PHOTO_DATA_URI, PHOTO_DATA_URI_CTA),
 * email-template.js (sendFollowUpEmail), and clickup-submit.js
 * (submitToClickUp), all loaded before this file.
 *
 * Slide indices (internal, not shown to the user):
 *   0        Opening
 *   1..6     Question slides, SECTIONS[0..5]
 *   7        Results
 */

const state = {
  lang: "en",
  slide: 0,
  answers: SECTIONS.map((s) => s.items.map(() => false)),
  submitted: false,
  submitting: false,
  formError: "",
  // render() rebuilds the whole DOM from scratch on every change (see
  // `render()` at the bottom of this file), including after a failed
  // validation re-render -- so typed values must live here, not just in
  // the input elements, or a validation error would silently erase
  // whatever the visitor had already typed.
  companyName: "",
  email: "",
  consentChecked: false,
};

function t(key) {
  return STRINGS[state.lang][key];
}

// ---------------------------------------------------------------------------
// Scoring (spec section "Scoring")
// ---------------------------------------------------------------------------
function scoreAnswers(answers) {
  const sections = SECTIONS.map((s, si) => {
    let earned = 0;
    const items = s.items.map((item, ii) => {
      const checked = answers[si][ii];
      const points =
        item.polarity === "positive" ? (checked ? 2 : 0) : checked ? 0 : 2;
      earned += points;
      return { text: item.text, checked, polarity: item.polarity, points };
    });
    const pct = earned / s.max; // fraction 0..1
    const weighted = pct * 16.67; // section's weighted contribution
    return { key: s.key, label: s.label, max: s.max, earned, pct, weighted, items };
  });

  let overall = sections.reduce((sum, s) => sum + s.weighted, 0);
  overall = Math.round(overall * 10) / 10; // one decimal place

  // Strongest / weakest are picked independently of each other, each with
  // its own first-in-sequence tie-break (spec, results slide section).
  // They are allowed to land on the same section — the strength line and
  // weakness line are independent statements, not a matched pair, so that
  // case still renders two coherent, separate lines about that section.
  let strongest = sections[0];
  let weakest = sections[0];
  sections.forEach((s) => {
    if (s.pct > strongest.pct) strongest = s;
    if (s.pct < weakest.pct) weakest = s;
  });

  return { sections, overall, strongest, weakest };
}

// ---------------------------------------------------------------------------
// Shared topbar (question slides + results slide)
// ---------------------------------------------------------------------------
function buildTopbar({ backVisible, onBack, activeSectionIndex }) {
  const bar = document.createElement("div");
  bar.className = "topbar";

  const back = document.createElement("button");
  back.className = "back-btn";
  back.type = "button";
  back.setAttribute("aria-label", t("backButton"));
  back.textContent = "‹";
  if (!backVisible) back.hidden = true;
  else back.addEventListener("click", onBack);
  bar.appendChild(back);

  if (activeSectionIndex === null) {
    const spacer = document.createElement("div");
    spacer.style.flex = "1";
    bar.appendChild(spacer);
  } else {
    const progress = document.createElement("div");
    progress.className = "progress";

    const dots = document.createElement("div");
    dots.className = "dots";
    SECTIONS.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className =
        "dot" +
        (i === activeSectionIndex ? " active" : i < activeSectionIndex ? " done" : "");
      dots.appendChild(dot);
    });
    progress.appendChild(dots);

    // Spec: "a slide position number, such as 2/6, shown next to the
    // dots... The number reflects position in the six question slides
    // only, not the full eight slide sequence." Numeric only, so it's
    // identical in both languages -- no translation needed.
    const position = document.createElement("span");
    position.className = "progress-num";
    position.textContent = `${activeSectionIndex + 1}/${SECTIONS.length}`;
    progress.appendChild(position);

    bar.appendChild(progress);
  }

  const langBtn = document.createElement("button");
  langBtn.className = "lang-toggle";
  langBtn.type = "button";
  langBtn.textContent = t("langToggleLabel");
  langBtn.addEventListener("click", () => {
    state.lang = state.lang === "en" ? "zh" : "en";
    render();
  });
  bar.appendChild(langBtn);

  return bar;
}

// ---------------------------------------------------------------------------
// Opening slide (slide 1 in the doc, index 0 here)
// Confirmed "Option A" layout, per opening-and-results-updated.html:
// compact title, then a large dominant circular photo, then her name
// (italic/bold, matching the bottom credit line's treatment), then the
// prominent (but not bold) subtitle, then the start button, then nothing
// else until the credit line pinned near the bottom.
// ---------------------------------------------------------------------------
function renderOpening(panel) {
  const wrap = document.createElement("div");
  wrap.className = "opening";

  const title = document.createElement("p");
  title.className = "opening-title";
  title.textContent = t("title");
  wrap.appendChild(title);

  const photo = document.createElement("img");
  photo.className = "opening-photo";
  photo.src = PHOTO_DATA_URI; // embedded image data, see photo-data.js
  photo.alt = AUTHOR_NAME;
  wrap.appendChild(photo);

  // Name is never translated (spec, "Language"), so it's read from the
  // language-independent AUTHOR_NAME constant, not t().
  const name = document.createElement("p");
  name.className = "opening-name";
  name.textContent = AUTHOR_NAME;
  wrap.appendChild(name);

  const subtitle = document.createElement("p");
  subtitle.className = "opening-subtitle";
  subtitle.textContent = t("subtitle");
  wrap.appendChild(subtitle);

  const startBtn = document.createElement("button");
  startBtn.className = "start-btn";
  startBtn.type = "button";
  startBtn.textContent = t("startButton");
  startBtn.addEventListener("click", () => {
    state.slide = 1;
    render();
  });
  wrap.appendChild(startBtn);

  const spacer = document.createElement("div");
  spacer.className = "opening-spacer";
  wrap.appendChild(spacer);

  const credit = document.createElement("p");
  credit.className = "opening-credit";
  credit.textContent = t("authorCredit");
  wrap.appendChild(credit);

  panel.appendChild(wrap);
}

// ---------------------------------------------------------------------------
// Privacy banner, shown from the first question slide onward (spec,
// opening page section: shown once the user proceeds past the opening
// page, before the first question).
// ---------------------------------------------------------------------------
function buildPrivacyBanner() {
  const banner = document.createElement("div");
  banner.className = "privacy-banner";
  // The trailing space before the link (English only) lives in the
  // privacyNotice string itself in content.js, since Chinese punctuation
  // doesn't need one -- see that file's comment on privacyNotice/zh.
  banner.textContent = t("privacyNotice");
  const link = document.createElement("a");
  // Carries the tool's current language toggle state over to the privacy
  // notice page via a URL parameter, since it opens in a new tab and so
  // doesn't share this page's in-memory `state` -- privacy-notice.html
  // reads this same parameter to pick which language to show.
  link.href = "privacy-notice.html?lang=" + state.lang;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = t("privacyLinkText");
  banner.appendChild(link);
  return banner;
}

// ---------------------------------------------------------------------------
// Question slides (slides 2-7 in the doc, index 1-6 here)
// ---------------------------------------------------------------------------
function renderQuestion(panel, slideIdx) {
  const sectionIndex = slideIdx - 1;
  const section = SECTIONS[sectionIndex];

  const goBack = () => {
    state.slide -= 1;
    render();
  };
  const goNext = () => {
    state.slide += 1;
    render();
  };

  panel.appendChild(
    buildTopbar({ backVisible: true, onBack: goBack, activeSectionIndex: sectionIndex })
  );
  panel.appendChild(buildPrivacyBanner());

  const content = document.createElement("div");
  content.className = "content";

  const label = document.createElement("p");
  label.className = "section-label";
  label.textContent = section.label[state.lang];
  content.appendChild(label);

  const question = document.createElement("h2");
  question.className = "question";
  question.textContent = section.question[state.lang];
  content.appendChild(question);

  const cards = document.createElement("div");
  cards.className = "cards";

  section.items.forEach((item, itemIndex) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "stmt-card" + (state.answers[sectionIndex][itemIndex] ? " selected" : "");
    card.textContent = item.text[state.lang];
    card.addEventListener("click", () => {
      state.answers[sectionIndex][itemIndex] = !state.answers[sectionIndex][itemIndex];
      render();
    });
    cards.appendChild(card);
  });

  content.appendChild(cards);
  panel.appendChild(content);

  const bottombar = document.createElement("div");
  bottombar.className = "bottombar";

  const backBtn = document.createElement("button");
  backBtn.className = "nav-btn ghost";
  backBtn.type = "button";
  backBtn.textContent = t("backButton");
  backBtn.addEventListener("click", goBack);
  bottombar.appendChild(backBtn);

  // Spec: "Before the user can move to the next slide, at least one card
  // must be selected somewhere in the current section." Not every item,
  // just not left entirely blank.
  const hasSelection = state.answers[sectionIndex].some(Boolean);

  const nextBtn = document.createElement("button");
  nextBtn.className = "nav-btn primary";
  nextBtn.type = "button";
  nextBtn.textContent = slideIdx === SECTIONS.length ? t("lastQuestionButton") : t("nextButton");
  nextBtn.disabled = !hasSelection;
  nextBtn.addEventListener("click", goNext);
  bottombar.appendChild(nextBtn);

  panel.appendChild(bottombar);
}

// ---------------------------------------------------------------------------
// Results slide (slide 8 in the doc, index 7 here)
// ---------------------------------------------------------------------------
function renderResults(panel) {
  const scoreResult = scoreAnswers(state.answers);

  const goBack = () => {
    state.slide -= 1;
    render();
  };

  panel.appendChild(buildTopbar({ backVisible: true, onBack: goBack, activeSectionIndex: null }));

  const content = document.createElement("div");
  content.className = "results-content";

  const scoreWrap = document.createElement("div");
  scoreWrap.className = "score-wrap";
  const scoreNum = document.createElement("div");
  scoreNum.className = "score-num";
  scoreNum.id = "scoreNum";
  scoreNum.textContent = "0%";
  scoreWrap.appendChild(scoreNum);
  const scoreLabel = document.createElement("div");
  scoreLabel.className = "score-label";
  scoreLabel.textContent = t("scoreLabel");
  scoreWrap.appendChild(scoreLabel);
  content.appendChild(scoreWrap);

  // Spec: two separate, plainly labeled statements, not one blended
  // paragraph and no sentence connecting them. Shown exactly as written
  // in content.js, never paraphrased or regenerated.
  const strengthHeading = document.createElement("p");
  strengthHeading.className = "result-heading";
  strengthHeading.textContent = t("strengthHeading");
  content.appendChild(strengthHeading);

  const strengthText = document.createElement("p");
  strengthText.className = "result-text";
  strengthText.textContent = STRENGTH_LINES[scoreResult.strongest.key][state.lang];
  content.appendChild(strengthText);

  const weaknessHeading = document.createElement("p");
  weaknessHeading.className = "result-heading";
  weaknessHeading.textContent = t("weaknessHeading");
  content.appendChild(weaknessHeading);

  const weaknessText = document.createElement("p");
  weaknessText.className = "result-text";
  weaknessText.textContent = WEAKNESS_LINES[scoreResult.weakest.key][state.lang];
  content.appendChild(weaknessText);

  if (!state.submitted) {
    // Spec: a small circular photo of Katarina next to the CTA text,
    // since this is the one place on the page written in her own first
    // person voice. The spam-folder aside is merged into the same
    // paragraph as a quieter, smaller note, not a separate line.
    const ctaRow = document.createElement("div");
    ctaRow.className = "cta-row";

    const ctaPhoto = document.createElement("img");
    ctaPhoto.className = "cta-photo";
    ctaPhoto.src = PHOTO_DATA_URI_CTA; // embedded image data, see photo-data.js
    ctaPhoto.alt = AUTHOR_NAME;
    ctaRow.appendChild(ctaPhoto);

    const ctaText = document.createElement("p");
    ctaText.className = "cta-text";
    ctaText.appendChild(document.createTextNode(t("ctaLine") + " "));
    const spamAside = document.createElement("span");
    spamAside.className = "spam-inline";
    spamAside.textContent = t("ctaSpamAside");
    ctaText.appendChild(spamAside);
    ctaRow.appendChild(ctaText);

    content.appendChild(ctaRow);

    // Company name: required alongside email, same validation pattern.
    // Value lives in `state` (not just the input) so a validation-error
    // re-render doesn't wipe out what the visitor already typed.
    const companyInput = document.createElement("input");
    companyInput.className = "email-input";
    companyInput.type = "text";
    companyInput.placeholder = t("companyPlaceholder");
    companyInput.id = "companyInput";
    companyInput.value = state.companyName;
    companyInput.addEventListener("input", () => {
      state.companyName = companyInput.value;
    });
    content.appendChild(companyInput);

    const emailInput = document.createElement("input");
    emailInput.className = "email-input";
    emailInput.type = "email";
    emailInput.placeholder = t("emailPlaceholder");
    emailInput.id = "emailInput";
    emailInput.value = state.email;
    emailInput.addEventListener("input", () => {
      state.email = emailInput.value;
    });
    content.appendChild(emailInput);

    const errorEl = document.createElement("p");
    errorEl.className = "form-error";
    errorEl.textContent = state.formError;
    content.appendChild(errorEl);

    const consentLabel = document.createElement("label");
    consentLabel.className = "consent";
    const consentInput = document.createElement("input");
    consentInput.type = "checkbox";
    consentInput.id = "consentInput";
    consentInput.checked = state.consentChecked;
    consentInput.addEventListener("change", () => {
      state.consentChecked = consentInput.checked;
    });
    consentLabel.appendChild(consentInput);
    const consentText = document.createElement("span");
    consentText.textContent = t("consentText");
    consentLabel.appendChild(consentText);
    content.appendChild(consentLabel);

    const submitBtn = document.createElement("button");
    submitBtn.className = "nav-btn primary full";
    submitBtn.type = "button";
    submitBtn.textContent = state.submitting ? "..." : t("submitButton");
    submitBtn.disabled = state.submitting;
    submitBtn.addEventListener("click", async () => {
      const companyName = companyInput.value.trim();
      const email = emailInput.value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!companyName) {
        state.formError = t("submitNeedsCompany");
        render();
        return;
      }
      if (!emailValid) {
        state.formError = t("submitInvalidEmail");
        render();
        return;
      }
      if (!consentInput.checked) {
        state.formError = t("submitNeedsConsent");
        render();
        return;
      }

      state.formError = "";
      state.submitting = true;
      render();

      // See email-template.js: this is a front-end stub, no backend is
      // wired up yet (spec, "Follow up email" leaves the email content
      // and package mapping unsettled, and no send endpoint exists).
      // See clickup-submit.js / worker/clickup-submit-worker.js: this one
      // IS wired up (create-or-update against the Lead Magnet list),
      // best-effort -- it never blocks reaching the "thank you" state.
      await Promise.all([
        sendFollowUpEmail(scoreResult, email),
        submitToClickUp({ email, companyName }),
      ]);

      state.submitting = false;
      state.submitted = true;
      render();
    });
    content.appendChild(submitBtn);
  } else {
    const submittedBlock = document.createElement("div");
    submittedBlock.className = "submitted-block";
    const headline = document.createElement("p");
    headline.className = "submitted-headline";
    headline.textContent = t("submittedHeadline");
    submittedBlock.appendChild(headline);
    const body = document.createElement("p");
    body.className = "submitted-body";
    body.textContent = t("submittedBody");
    submittedBlock.appendChild(body);
    content.appendChild(submittedBlock);
  }

  // Spec: "Below the button, a smaller version of the credit line...
  // same italic black treatment otherwise." Shown in both the form and
  // submitted states, since it's a persistent credit rather than part of
  // either specific state.
  const credit = document.createElement("p");
  credit.className = "results-credit";
  credit.textContent = t("authorCredit");
  content.appendChild(credit);

  panel.appendChild(content);

  // Count-up animation, the one deliberate motion in the tool
  // (spec, "Visual design").
  requestAnimationFrame(() => animateScore(scoreNum, scoreResult.overall));
}

function animateScore(el, target) {
  const duration = 1100;
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(target * eased * 10) / 10;
    el.textContent = (progress < 1 ? current.toFixed(1) : target.toFixed(1)) + "%";
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------------------
// Root render
// ---------------------------------------------------------------------------
function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const panel = document.createElement("div");
  panel.className = "panel";
  app.appendChild(panel);

  if (state.slide === 0) {
    renderOpening(panel);
  } else if (state.slide >= 1 && state.slide <= SECTIONS.length) {
    renderQuestion(panel, state.slide);
  } else {
    renderResults(panel);
  }
}

render();

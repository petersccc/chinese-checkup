/**
 * content.js
 * ----------
 * All locked copy and scoring data for the Quick Cross Cultural Self
 * Evaluation Checkup (Chinese-company version), per
 * "checkup-build-specification 1.md" (supersedes the earlier
 * chinese-checkup-build-context_1.md, notably for the results slide, see
 * STRENGTH_LINES / WEAKNESS_LINES below). Nothing in this file should be
 * reworded or restructured without checking that document first.
 *
 * Chinese strings: per the "Language" section of the spec, Chinese text is
 * not generated or translated here. Every zh value below is a clearly
 * marked placeholder in English (never actual Chinese characters), so the
 * language toggle is fully wired and only needs real strings dropped in
 * later. Search this file for "ZH PLACEHOLDER" to find every spot that
 * needs translated copy.
 */

// ---------------------------------------------------------------------------
// UI strings (chrome around the questions: titles, buttons, notices)
// ---------------------------------------------------------------------------
const STRINGS = {
  en: {
    title: "Quick Cross Cultural Self Evaluation Checkup",
    subtitle: "Where Is Your Business Now?",
    authorCredit: "By Katarina Peters, Peters Cross-Cultural Communication",
    startButton: "Start",
    backButton: "Back",
    nextButton: "Next",
    lastQuestionButton: "See my results",
    privacyNotice: "Your answers stay anonymous, no name or email is needed to see your result.",
    privacyLinkText: "Read the full privacy notice",
    scoreLabel: "your overall result",
    strengthHeading: "Where you're strongest",
    weaknessHeading: "Where to pay attention",
    ctaLine: "If you'd like to improve your weaker spots and amplify your strengths, leave your email and I will send a tailor made strategy to achieve this.",
    emailPlaceholder: "you@company.com",
    consentText: "I agree that my answers may be linked to my email address so I can receive my personalized overview and recommended next step.",
    submitButton: "Send me my strategy",
    submitInvalidEmail: "Please enter a valid email address.",
    submitNeedsConsent: "Please tick the consent box before submitting.",
    submittedHeadline: "Thank you.",
    submittedBody: "Your personalized overview is on its way to your inbox.",
    langToggleLabel: "中文",
  },
  zh: {
    title: "[ZH PLACEHOLDER — title]",
    subtitle: "[ZH PLACEHOLDER — subtitle]",
    authorCredit: "[ZH PLACEHOLDER — author credit]",
    startButton: "[ZH PLACEHOLDER — start button]",
    backButton: "[ZH PLACEHOLDER — back button]",
    nextButton: "[ZH PLACEHOLDER — next button]",
    lastQuestionButton: "[ZH PLACEHOLDER — see results button]",
    privacyNotice: "[ZH PLACEHOLDER — privacy notice line]",
    privacyLinkText: "[ZH PLACEHOLDER — privacy link text]",
    scoreLabel: "[ZH PLACEHOLDER — score label]",
    strengthHeading: "[ZH PLACEHOLDER — strength heading]",
    weaknessHeading: "[ZH PLACEHOLDER — weakness heading]",
    ctaLine: "[ZH PLACEHOLDER — call to action line]",
    emailPlaceholder: "[ZH PLACEHOLDER — email field placeholder]",
    consentText: "[ZH PLACEHOLDER — consent checkbox text]",
    submitButton: "[ZH PLACEHOLDER — submit button]",
    submitInvalidEmail: "[ZH PLACEHOLDER — invalid email message]",
    submitNeedsConsent: "[ZH PLACEHOLDER — needs consent message]",
    submittedHeadline: "[ZH PLACEHOLDER — submitted headline]",
    submittedBody: "[ZH PLACEHOLDER — submitted body]",
    langToggleLabel: "EN",
  },
};

// ---------------------------------------------------------------------------
// The six sections, in the fixed sequence used for tie-breaks throughout.
// Each item carries a `polarity` of 'positive' or 'gap', used for scoring
// only. This flag and the section `max` are never shown to the user.
// ---------------------------------------------------------------------------
const SECTIONS = [
  {
    key: "communication",
    max: 8,
    label: { en: "Communication", zh: "[ZH PLACEHOLDER — section label: Communication]" },
    question: {
      en: "When a problem appears, do you communicate it in time?",
      zh: "[ZH PLACEHOLDER — question: Communication]",
    },
    items: [
      {
        polarity: "positive",
        text: {
          en: "We can name the last time we raised a problem directly with a German partner before it affected a deadline.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "We can confidently tell whether a German partner's reserved tone means disapproval or not.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "Both sides feel comfortable expressing disagreement.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "Disagreement only gets expressed once it can no longer be ignored.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
    ],
  },
  {
    key: "planning",
    max: 8,
    label: { en: "Planning", zh: "[ZH PLACEHOLDER — section label: Planning]" },
    question: {
      en: "Does the amount of upfront planning your German partner expects feel reasonable?",
      zh: "[ZH PLACEHOLDER — question: Planning]",
    },
    items: [
      {
        polarity: "gap",
        text: {
          en: "A full plan up front often feels excessive to us, not just careful.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "We've adjusted our pace to match German timelines without really understanding why.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "We've adjusted our pace to match German timelines because we understand the reasoning behind it.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "We've asked directly why the plan needs to be this detailed.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
    ],
  },
  {
    key: "representation",
    max: 8,
    label: { en: "Representation", zh: "[ZH PLACEHOLDER — section label: Representation]" },
    question: {
      en: "Who is your middle person between the German side and your team?",
      zh: "[ZH PLACEHOLDER — question: Representation]",
    },
    items: [
      {
        polarity: "gap",
        text: {
          en: "The person managing this relationship was mainly chosen for their language skills.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "The person managing this relationship was hired for their expertise.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "Even if we have someone who speaks the language, we still experience frequent misunderstandings.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "We think being fluent in a common language helps speed up decision making.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
    ],
  },
  {
    key: "trust",
    max: 6,
    label: { en: "Trust and relationship", zh: "[ZH PLACEHOLDER — section label: Trust and relationship]" },
    question: {
      en: "Could this relationship overcome a misunderstanding?",
      zh: "[ZH PLACEHOLDER — question: Trust and relationship]",
    },
    items: [
      {
        polarity: "positive",
        text: {
          en: "We've had a real disagreement or delay with this partner, and we handled it openly and directly.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "We keep in touch even if there isn't any specific request or a deadline.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "When something feels off, we're not sure how to bring it up.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
    ],
  },
  {
    key: "decisions",
    max: 6,
    label: { en: "Decisions, speed, and channels", zh: "[ZH PLACEHOLDER — section label: Decisions, speed, and channels]" },
    question: {
      en: "When a decision from Germany takes longer than expected, do you know why, and who is your contact person?",
      zh: "[ZH PLACEHOLDER — question: Decisions, speed, and channels]",
    },
    items: [
      {
        polarity: "gap",
        text: {
          en: "We can't pinpoint why a decision is taking so long.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "We can estimate why a certain delay happens, and the reason has been communicated.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "When a negotiation stalls, we know who our contact person is.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
    ],
  },
  {
    key: "longevity",
    max: 8,
    label: { en: "Longevity of adjustment", zh: "[ZH PLACEHOLDER — section label: Longevity of adjustment]" },
    question: {
      en: "Have the adjustments you've made in cooperation with German partners brought long term positive effects, or do the same misunderstandings keep coming back?",
      zh: "[ZH PLACEHOLDER — question: Longevity of adjustment]",
    },
    items: [
      {
        polarity: "gap",
        text: {
          en: "When we interact with our German partners, we feel like our message gets lost in interpretation.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "We feel like we define the same terms differently than our German partners do.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "Adjusting to our cultural differences has given us long term stability.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "Even when we've adjusted our communication, misunderstandings still reoccur.",
          zh: "[ZH PLACEHOLDER — item]",
        },
      },
    ],
  },
];


// ---------------------------------------------------------------------------
// Results slide content (per "checkup-build-specification 1.md", which
// supersedes the earlier 30-paragraph matrix). The strongest section's
// strength line and the weakest section's weakness line are shown as two
// separate, independently labeled statements — never blended into one
// paragraph and never joined by a generated connecting sentence. Each is
// shown exactly as written here.
//
// English text is locked, final copy from the spec. Chinese values are
// placeholders only (see the file header) so the language toggle covers
// the results slide too, once real translations are supplied.
// ---------------------------------------------------------------------------
const STRENGTH_LINES = {
  communication: {
    en: "Your communication with German partners already moves in both directions, problems tend to reach you before they've become bigger issues.",
    zh: "[ZH PLACEHOLDER — strength line: Communication]",
  },
  planning: {
    en: "You've made real sense of why German partners plan the way they do, rather than just tolerating it.",
    zh: "[ZH PLACEHOLDER — strength line: Planning]",
  },
  representation: {
    en: "The person representing you to your German partners has real standing, not just the language to get by.",
    zh: "[ZH PLACEHOLDER — strength line: Representation]",
  },
  trust: {
    en: "Your trust and relationship with German partners has a solid base, the kind that tends to hold even when something goes wrong.",
    zh: "[ZH PLACEHOLDER — strength line: Trust and relationship]",
  },
  decisions: {
    en: "You have a clear understanding of how German decisions move, and who to reach when one stalls.",
    zh: "[ZH PLACEHOLDER — strength line: Decisions, speed, and channels]",
  },
  longevity: {
    en: "The adjustments you've made with German partners weren't just a quick fix, you understood the difference behind them.",
    zh: "[ZH PLACEHOLDER — strength line: Longevity of adjustment]",
  },
};

const WEAKNESS_LINES = {
  communication: {
    en: "A reserved tone is easy to misread as disapproval when it usually isn't one. A problem that only gets raised once it can't be ignored has usually already cost more than it needed to.",
    zh: "[ZH PLACEHOLDER — weakness line: Communication]",
  },
  planning: {
    en: "A German partner asking for a full plan up front is rarely about distrust, it's close to how they'd work with any partner. Matching that pace without understanding why just means copying the behavior, not actually understanding it.",
    zh: "[ZH PLACEHOLDER — weakness line: Planning]",
  },
  representation: {
    en: "A partner judges a company through whoever they're speaking to. Fluency gets mistaken for authority, and the gap between the two usually only shows up after something's already gone wrong.",
    zh: "[ZH PLACEHOLDER — weakness line: Representation]",
  },
  trust: {
    en: "A relationship that's never been tested by friction hasn't proven anything yet, it's just been lucky so far.",
    zh: "[ZH PLACEHOLDER — weakness line: Trust and relationship]",
  },
  decisions: {
    en: "A slower decision from Germany is rarely reluctance, it usually means more people had to approve it before it could move. Not knowing who to ask when it matters costs more than the delay itself does.",
    zh: "[ZH PLACEHOLDER — weakness line: Decisions, speed, and channels]",
  },
  longevity: {
    en: "An adjustment that doesn't last was usually just a temporary solution, but it wasn't fully understood. That is why the same friction keeps coming back.",
    zh: "[ZH PLACEHOLDER — weakness line: Longevity of adjustment]",
  },
};

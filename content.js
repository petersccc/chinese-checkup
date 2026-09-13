/**
 * content.js
 * ----------
 * All locked copy and scoring data for the Quick Cross Cultural Self
 * Evaluation Checkup (Chinese-company version), per
 * "checkup-build-specification 3.md" (supersedes specs 1 and 2, and the
 * earlier chinese-checkup-build-context_1.md). Nothing in this file
 * should be reworded or restructured without checking that document first.
 *
 * Chinese strings: the full Chinese translation is real, reviewed,
 * approved copy — not a placeholder — and is used here verbatim,
 * including the six section labels added in spec 3 (previously
 * placeholders). Three things are NOT translated, per spec: Katarina
 * Peters' name, the business name, and the numeric slide-position
 * indicator (all handled as language-independent values below), plus the
 * email placeholder "you@company.com" (kept in Latin as a universal
 * example). A few narrow UI strings were never included in the provided
 * translation (client-side validation messages and the post-submit
 * confirmation text) — those remain clearly marked placeholders rather
 * than invented translations; search for "ZH PLACEHOLDER" to find them.
 */

// ---------------------------------------------------------------------------
// UI strings (chrome around the questions: titles, buttons, notices)
// ---------------------------------------------------------------------------
const STRINGS = {
  en: {
    title: "Quick Cross Cultural Self Evaluation Checkup",
    subtitle: "Where Is Your Business Now?",
    // Name under the opening photo, and the (shorter) credit line at the
    // bottom of the opening page and results page. Per spec, the name is
    // never translated -- it appears in the "language-independent" block
    // below, not duplicated per language.
    authorCredit: "Peters Cross-Cultural Communication",
    startButton: "Start",
    backButton: "Back",
    nextButton: "Next",
    // No separate Chinese wording was supplied for this state of the
    // button (spec's "Navigation, Chinese" only gives Back/Next) -- see
    // zh.lastQuestionButton below.
    lastQuestionButton: "See my results",
    privacyNotice: "Your answers stay anonymous, no name or email is needed to see your result. ",
    privacyLinkText: "Read the full privacy notice",
    scoreLabel: "your overall result",
    strengthHeading: "Where you're strongest",
    weaknessHeading: "Where to pay attention",
    // Split in two per spec: the main CTA sentence, and the spam-folder
    // aside merged into the same paragraph but styled as a quieter,
    // smaller note (see .spam-inline in styles.css).
    ctaLine: "If you'd like to improve your weaker spots and amplify your strengths, leave your email for a tailor made strategy.",
    ctaSpamAside: "And don't forget to check your spam folder, too!",
    emailPlaceholder: "you@company.com",
    // New field: company name, required alongside email before submit.
    // No Chinese wording was supplied for this (added after the spec's
    // translation pass) -- see zh.companyPlaceholder / zh.submitNeedsCompany.
    companyPlaceholder: "Your company name",
    consentText: "I agree that my answers may be linked to my email address so I can receive my personalized overview and recommended next step.",
    submitButton: "Send me my strategy",
    submitInvalidEmail: "Please enter a valid email address.",
    submitNeedsCompany: "Please enter your company name.",
    submitNeedsConsent: "Please tick the consent box before submitting.",
    submittedHeadline: "Thank you.",
    submittedBody: "Your personalized overview is on its way to your inbox.",
    langToggleLabel: "中文",
  },
  zh: {
    title: "跨文化快速自测",
    subtitle: "你的企业现在处于什么阶段？",
    authorCredit: "Peters Cross-Cultural Communication",
    startButton: "开始",
    backButton: "上一步",
    nextButton: "下一步",
    // Not covered by the provided translation (only Back/Next were
    // given) -- reusing 下一步 rather than inventing separate wording.
    lastQuestionButton: "下一步",
    // Split from the spec's single combined sentence
    // "你的回答完全匿名，无需提供姓名或邮箱即可查看结果。查看完整隐私声明"
    // the same way the English notice + link text are split.
    privacyNotice: "你的回答完全匿名，无需提供姓名或邮箱即可查看结果。",
    privacyLinkText: "查看完整隐私声明",
    scoreLabel: "你的总体得分",
    strengthHeading: "你的优势",
    weaknessHeading: "需要关注的方面",
    ctaLine: "如果你想改善薄弱环节，进一步发挥优势，请留下你的邮箱，我会为你发送一份量身定制的策略方案。",
    // Spec flags this specific line as "draft only, not yet reviewed the
    // way the rest of this translation was, treat as provisional."
    ctaSpamAside: "也别忘了看看垃圾邮件文件夹哦！",
    emailPlaceholder: "you@company.com",
    // ZH PLACEHOLDER: not included in any provided translation.
    companyPlaceholder: "[ZH PLACEHOLDER — company name field placeholder]",
    consentText: "我同意将我的回答与我的邮箱地址关联，以便我能收到专属的分析结果和后续建议。",
    submitButton: "发送我的专属策略",
    submitInvalidEmail: "[ZH PLACEHOLDER — invalid email message]",
    submitNeedsCompany: "[ZH PLACEHOLDER — needs company name message]",
    submitNeedsConsent: "[ZH PLACEHOLDER — needs consent message]",
    submittedHeadline: "[ZH PLACEHOLDER — submitted headline]",
    submittedBody: "[ZH PLACEHOLDER — submitted body]",
    langToggleLabel: "EN",
  },
};

// Language-independent strings, per spec: "Katarina Peters' name, the
// business name Peters Cross-Cultural Communication, and the slide
// position indicator... should appear identically in both language
// versions." The business name is identical to authorCredit above by
// coincidence of content, but is kept separate here (rather than reused)
// since the spec calls it out as its own exempt item, distinctly from
// authorCredit's role as translatable UI chrome.
const AUTHOR_NAME = "Katarina Peters";

// ---------------------------------------------------------------------------
// The six sections, in the fixed sequence used for tie-breaks throughout.
// Each item carries a `polarity` of 'positive' or 'gap', used for scoring
// only. This flag and the section `max` are never shown to the user.
// Chinese items map one-to-one, in the same order, to the English item in
// the same position -- including that item's polarity flag (spec: "Do not
// re derive polarity from the Chinese text").
// ---------------------------------------------------------------------------
const SECTIONS = [
  {
    key: "communication",
    max: 8,
    label: { en: "Communication", zh: "沟通" },
    question: {
      en: "When a problem appears, do you communicate it in time?",
      zh: "出现问题时，你们会及时沟通吗？",
    },
    items: [
      {
        polarity: "positive",
        text: {
          en: "We can name the last time we raised a problem directly with a German partner before it affected a deadline.",
          zh: "我们能举出上一次在问题影响截止日期之前，直接向德方合作伙伴提出问题的具体例子。",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "We can confidently tell whether a German partner's reserved tone means disapproval or not.",
          zh: "我们能准确判断德方合作伙伴含蓄的语气是否意味着不同意。",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "Both sides feel comfortable expressing disagreement.",
          zh: "双方都能坦然表达不同意见。",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "Disagreement only gets expressed once it can no longer be ignored.",
          zh: "只有当分歧已经无法回避时，才会被提出来。",
        },
      },
    ],
  },
  {
    key: "planning",
    max: 8,
    label: { en: "Planning", zh: "规划" },
    question: {
      en: "Does the amount of upfront planning your German partner expects feel reasonable?",
      zh: "德方合作伙伴要求的前期规划程度，你们觉得合理吗？",
    },
    items: [
      {
        polarity: "gap",
        text: {
          en: "A full plan up front often feels excessive to us, not just careful.",
          zh: "一份面面俱到的前期计划，在我们看来常常不只是谨慎，而是有些过度。",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "We've adjusted our pace to match German timelines without really understanding why.",
          zh: "我们调整了节奏去配合德方的时间安排，但并不真正理解背后的原因。",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "We've adjusted our pace to match German timelines because we understand the reasoning behind it.",
          zh: "我们调整了节奏去配合德方的时间安排，是因为理解了背后的原因。",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "We've asked directly why the plan needs to be this detailed.",
          zh: "我们直接问过，为什么计划需要做到这么细。",
        },
      },
    ],
  },
  {
    key: "representation",
    max: 8,
    label: { en: "Representation", zh: "对接人" },
    question: {
      en: "Who is your middle person between the German side and your team?",
      zh: "谁负责代表你们团队与德方沟通？",
    },
    items: [
      {
        polarity: "gap",
        text: {
          en: "The person managing this relationship was mainly chosen for their language skills.",
          zh: "负责这段关系的人，主要是因为会说对方的语言而被选中的。",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "The person managing this relationship was hired for their expertise.",
          zh: "负责这段关系的人，是因为专业能力而被聘用的。",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "Even if we have someone who speaks the language, we still experience frequent misunderstandings.",
          zh: "即使有人能说对方的语言，我们之间仍然经常出现误解。",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "We think being fluent in a common language helps speed up decision making.",
          zh: "我们认为，共同语言的流利程度有助于加快决策速度。",
        },
      },
    ],
  },
  {
    key: "trust",
    max: 6,
    label: { en: "Trust and relationship", zh: "信任与关系" },
    question: {
      en: "Could this relationship overcome a misunderstanding?",
      zh: "这段关系是否经得起一次误解的考验？",
    },
    items: [
      {
        polarity: "positive",
        text: {
          en: "We've had a real disagreement or delay with this partner, and we handled it openly and directly.",
          zh: "我们和这位合作伙伴确实经历过分歧或延误，并且坦诚、直接地处理了这些问题。",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "We keep in touch even if there isn't any specific request or a deadline.",
          zh: "即使没有具体的请求或截止日期，我们也会保持联系。",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "When something feels off, we're not sure how to bring it up.",
          zh: "当感觉有些不对劲时，我们不确定该怎么提出来。",
        },
      },
    ],
  },
  {
    key: "decisions",
    max: 6,
    label: { en: "Decisions, speed, and channels", zh: "决策、速度与沟通渠道" },
    question: {
      en: "When a decision from Germany takes longer than expected, do you know why, and who is your contact person?",
      zh: "当德方的决策比预期更慢时，你们知道原因吗？知道该找谁吗？",
    },
    items: [
      {
        polarity: "gap",
        text: {
          en: "We can't pinpoint why a decision is taking so long.",
          zh: "我们说不清楚，为什么一项决策会拖这么久。",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "We can estimate why a certain delay happens, and the reason has been communicated.",
          zh: "我们大致清楚某次延误的原因，而且对方已经向我们解释过。",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "When a negotiation stalls, we know who our contact person is.",
          zh: "当谈判陷入停滞时，我们知道该联系谁。",
        },
      },
    ],
  },
  {
    key: "longevity",
    max: 8,
    label: { en: "Longevity of adjustment", zh: "调整能否持续奏效" },
    question: {
      en: "Have the adjustments you've made in cooperation with German partners brought long term positive effects, or do the same misunderstandings keep coming back?",
      zh: "你们在与德方合作中做出的调整，带来了长期的积极效果，还是同样的误解一再重复出现？",
    },
    items: [
      {
        polarity: "gap",
        text: {
          en: "When we interact with our German partners, we feel like our message gets lost in interpretation.",
          zh: "和德方合作伙伴沟通时，我们常常觉得自己的意思在解读中被曲解了。",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "We feel like we define the same terms differently than our German partners do.",
          zh: "我们发现，同一个词，我们和德方的理解并不一样。",
        },
      },
      {
        polarity: "positive",
        text: {
          en: "Adjusting to our cultural differences has given us long term stability.",
          zh: "适应彼此的文化差异，让我们的合作长期保持稳定。",
        },
      },
      {
        polarity: "gap",
        text: {
          en: "Even when we've adjusted our communication, misunderstandings still reoccur.",
          zh: "即使我们已经调整了沟通方式，误解还是会反复出现。",
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Results slide content. The strongest section's strength line and the
// weakest section's weakness line are shown as two separate, independently
// labeled statements -- never blended into one paragraph and never joined
// by a generated connecting sentence. Each is shown exactly as written
// here, in whichever language is active.
// ---------------------------------------------------------------------------
const STRENGTH_LINES = {
  communication: {
    en: "Your communication with German partners already moves in both directions, problems tend to reach you before they've become bigger issues.",
    zh: "你和德方合作伙伴之间的沟通已经能够顺畅地双向进行，问题往往在演变成更大的麻烦之前就已经被提出来了。",
  },
  planning: {
    en: "You've made real sense of why German partners plan the way they do, rather than just tolerating it.",
    zh: "你已经真正理解了德方为什么会这样规划，而不只是勉强接受。",
  },
  representation: {
    en: "The person representing you to your German partners has real standing, not just the language to get by.",
    zh: "在德方面前代表你的人，真正有专业分量，而不只是会说对方的语言。",
  },
  trust: {
    en: "Your trust and relationship with German partners has a solid base, the kind that tends to hold even when something goes wrong.",
    zh: "你和德方合作伙伴之间的信任与关系有着扎实的基础，即使出了问题，这份关系也经得住考验。",
  },
  decisions: {
    en: "You have a clear understanding of how German decisions move, and who to reach when one stalls.",
    zh: "你清楚德方的决策是如何推进的，也知道一旦停滞该联系谁。",
  },
  longevity: {
    en: "The adjustments you've made with German partners weren't just a quick fix, you understood the difference behind them.",
    zh: "你在与德方合作中做出的调整，不只是权宜之计，而是真正理解了背后的差异。",
  },
};

const WEAKNESS_LINES = {
  communication: {
    en: "A reserved tone is easy to misread as disapproval when it usually isn't one. A problem that only gets raised once it can't be ignored has usually already cost more than it needed to.",
    zh: "含蓄的语气很容易被误读为不认同，但实际上通常并非如此。如果一个问题只有等到无法回避时才被提出来，往往已经付出了不必要的代价。",
  },
  planning: {
    en: "A German partner asking for a full plan up front is rarely about distrust, it's close to how they'd work with any partner. Matching that pace without understanding why just means copying the behavior, not actually understanding it.",
    zh: "德方合作伙伴要求一份完整的前期计划，很少是出于不信任，这更多是他们对待合作伙伴的一贯方式。如果只是配合这种节奏却不理解背后的原因，那只是模仿了行为，并没有真正理解。",
  },
  representation: {
    en: "A partner judges a company through whoever they're speaking to. Fluency gets mistaken for authority, and the gap between the two usually only shows up after something's already gone wrong.",
    zh: "合作伙伴往往会通过与你对接的人来判断一家公司。语言流利常被误认为等同于专业权威，而两者之间的差距，往往要等到出了问题之后才会显现出来。",
  },
  trust: {
    en: "A relationship that's never been tested by friction hasn't proven anything yet, it's just been lucky so far.",
    zh: "一段从未经历过摩擦考验的关系，其实什么都还没被证明，它只是到目前为止运气不错而已。",
  },
  decisions: {
    en: "A slower decision from Germany is rarely reluctance, it usually means more people had to approve it before it could move. Not knowing who to ask when it matters costs more than the delay itself does.",
    zh: "德方决策变慢，很少是因为不情愿，通常是因为需要更多人批准才能推进。而在关键时刻不知道该问谁，代价往往比延误本身更大。",
  },
  longevity: {
    en: "An adjustment that doesn't last was usually just a temporary solution, but it wasn't fully understood. That is why the same friction keeps coming back.",
    zh: "一个无法持续的调整，通常只是临时的解决办法，说明背后的差异还没有被真正理解透彻。这也是同样的摩擦一再出现的原因。",
  },
};

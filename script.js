/*
  ============================================================
  BIRTHDAY LOVE WEBSITE - PERSONALIZATION
  ============================================================
  Change these values first:
    1. HER_NAME
    2. YOUR_NAME
    3. LOVE_LETTER
    4. REASONS
    5. COUPLE_QUIZ
  ============================================================
*/

const CONFIG = {
  HER_NAME: "My Love",
  YOUR_NAME: "Your Name",

  LOVE_LETTER: `Happy Birthday, my love. ❤️

Today is a reminder of how grateful I am to have you in my life.

Your kindness, your laughter, and the way you make ordinary moments feel special mean more to me than I can say.

I hope this year brings you joy, new adventures, and everything your heart is hoping for.

No matter where life takes us, I'm thankful for every moment we share.

Happy Birthday. I love you, always.

With all my love,\nYour Name ❤️`,

  REASONS: [
    {
      icon: "😊",
      title: "Your kindness",
      text: "The way you care makes every day feel a little brighter."
    },
    {
      icon: "🤍",
      title: "Your laugh",
      text: "I love how easily you can turn an ordinary moment into a happy one."
    },
    {
      icon: "😂",
      title: "Our conversations",
      text: "Even the simplest chats are special when I share them with you."
    },
    {
      icon: "🏡",
      title: "You feel like home",
      text: "Being with you makes anywhere feel like the right place to be."
    },
    {
      icon: "🥰",
      title: "The little things",
      text: "The thoughtful things you do stay with me long after the moment passes."
    },
    {
      icon: "❤️",
      title: "Simply... you",
      text: "I love you for exactly who you are."
    }
  ],

  COUPLE_QUIZ: [
    {
      question: "Who is more likely to plan a surprise? 🎁",
      options: ["You", "Me", "Both of us", "Neither of us"],
      correct: 2
    },
    {
      question: "What makes our time together special? ❤️",
      options: ["The laughter", "The little moments", "All of it", "The snacks"],
      correct: 2
    },
    {
      question: "What's the best kind of date? ✨",
      options: ["A cozy night in", "A little adventure", "Good food together", "Any time with you"],
      correct: 3
    },
    {
      question: "What do I love most about you? 😊",
      options: ["Your kindness", "Your laugh", "Your heart", "All of you"],
      correct: 3
    }
  ]
};

const screens = [...document.querySelectorAll(".screen")];
const bgMusic = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");
let musicIsPlaying = false;

function tryPlayMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 0.28;
  bgMusic.play().catch(() => {});
}

function updateMusicButton() {
  musicButton.textContent = musicIsPlaying ? "Ⅱ Pause music" : "♫ Play music";
  musicButton.setAttribute("aria-label", musicIsPlaying ? "Pause background music" : "Play background music");
}

musicButton.addEventListener("click", () => {
  if (musicIsPlaying) {
    bgMusic.pause();
  } else {
    tryPlayMusic();
  }
});
bgMusic.addEventListener("playing", () => {
  musicIsPlaying = true;
  updateMusicButton();
});
bgMusic.addEventListener("pause", () => {
  musicIsPlaying = false;
  updateMusicButton();
});
tryPlayMusic();

function showScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Try music after a user interaction.
  if (bgMusic && bgMusic.paused) {
    tryPlayMusic();
  }
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.next));
});

const draftStorageKey = "greenwish-draft-v2";
const byId = (id) => document.getElementById(id);
let activeDraft = null;
const defaultDecoyPhrases = [
  "I saved you the last bite",
  "Just five more minutes together",
  "You make everything feel like home",
  "I'll always choose you",
  "Let's make another happy memory",
  "You are my favorite person",
  "I love doing life with you",
  "Wishing you all the happiness you deserve"
];

function getDecoyPhraseList(phrases) {
  const savedPhrases = Array.isArray(phrases)
    ? phrases
    : typeof phrases === "string"
      ? phrases.split(/[,;\n]/)
      : [];

  return defaultDecoyPhrases.map((fallback, index) => {
    const phrase = savedPhrases[index];
    return typeof phrase === "string" && phrase.trim() ? phrase.trim() : fallback;
  });
}

function createQuizQuestion(question = "Who knows you best?", options = ["You", "Me", "Both of us"], answerIndex = 0) {
  return {
    question,
    options,
    answerIndex
  };
}

function getDraftDefaults() {
  return {
    senderName: "Your Name",
    recipientName: "My Love",
    heroTitle: "Happy Birthday, My Love!",
    firstPageMessage: "The world feels brighter with you in it. Today is all about celebrating the love, the laughter, and the beautiful life we are building together.",
    nextButtonText: "Open surprise",
    personalMessage: "Happy Birthday! You make every day brighter and every moment feel more meaningful. I am so lucky to celebrate you today.",
    loveLetter: "You are my favorite person, my safe place, and the reason I smile without trying. Thank you for being the love of my life.",
    quizQuestions: [
      createQuizQuestion("Who knows you best?", ["You", "Me", "Both of us"], 2),
      createQuizQuestion("Who makes you smile the most?", ["Me", "You", "Our memories"], 0),
      createQuizQuestion("What makes us special?", ["Love", "Laughter", "Everything"], 2)
    ],
    yesPuzzle: "The secret answer is YES",
    decoyPhrases: [...defaultDecoyPhrases]
  };
}

function readDraft() {
  try {
    const saved = localStorage.getItem(draftStorageKey);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn("Unable to read draft", error);
    return null;
  }
}

function writeDraft(draft) {
  try {
    localStorage.setItem(draftStorageKey, JSON.stringify(draft));
  } catch (error) {
    console.warn("Unable to save draft", error);
  }
}

function setDraftStatus(message) {
  ["draftStatus", "finalDraftStatus"].forEach(id => {
    const statusEl = document.getElementById(id);
    if (statusEl) statusEl.textContent = message;
  });
}

function getDraftFromForm() {
  const blocks = document.querySelectorAll(".quiz-question-block");
  const quizQuestions = Array.from(blocks).map((block, index) => {
    const questionInput = block.querySelector(".quiz-question-input");
    const question = questionInput && questionInput.value ? questionInput.value.trim() : `Question ${index + 1}`;
    const optionInputs = block.querySelectorAll(".quiz-option-input");
    const options = Array.from(optionInputs).map(input => input.value.trim()).filter(Boolean);
    const answerSelect = block.querySelector(".correct-answer-select");
    const answerIndex = Number((answerSelect && answerSelect.value) || 0);

    return {
      question,
      options: options.length ? options : ["Option 1", "Option 2", "Option 3"],
      answerIndex: Number.isInteger(answerIndex) ? answerIndex : 0
    };
  });

  return {
    senderName: (byId("senderName") && byId("senderName").value.trim()) || getDraftDefaults().senderName,
    recipientName: (byId("recipientName") && byId("recipientName").value.trim()) || getDraftDefaults().recipientName,
    heroTitle: (byId("heroTitle") && byId("heroTitle").value.trim()) || getDraftDefaults().heroTitle,
    firstPageMessage: (byId("firstPageMessage") && byId("firstPageMessage").value.trim()) || getDraftDefaults().firstPageMessage,
    nextButtonText: (byId("nextButtonText") && byId("nextButtonText").value.trim()) || getDraftDefaults().nextButtonText,
    personalMessage: (byId("personalMessage") && byId("personalMessage").value.trim()) || getDraftDefaults().personalMessage,
    loveLetter: (byId("loveLetter") && byId("loveLetter").value.trim()) || getDraftDefaults().loveLetter,
    quizQuestions: quizQuestions.length ? quizQuestions : getDraftDefaults().quizQuestions,
    yesPuzzle: (byId("yesPuzzle") && byId("yesPuzzle").value.trim()) || getDraftDefaults().yesPuzzle,
    decoyPhrases: getDecoyPhraseList(
      Array.from(document.querySelectorAll(".decoy-phrase-input"), input => input.value)
    )
  };
}

function renderDecoyPhraseInputs(phrases) {
  const container = byId("decoyPhraseInputs");
  if (!container) return;

  container.innerHTML = "";
  getDecoyPhraseList(phrases).forEach((phrase, index) => {
    const label = document.createElement("label");
    label.className = "field compact-field";
    label.innerHTML = `
      <span>Decoy phrase ${index + 1}</span>
      <input class="decoy-phrase-input" type="text" placeholder="${defaultDecoyPhrases[index]}" value="${phrase.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;")}" />
    `;
    container.appendChild(label);
  });
}

function renderQuizInputBlocks(questions) {
  const container = document.getElementById("quizQuestionsContainer");
  if (!container) return;

  container.innerHTML = "";
  const items = questions.length ? questions : getDraftDefaults().quizQuestions;

  items.forEach((item, index) => {
    const block = document.createElement("div");
    block.className = "quiz-question-block";
    block.innerHTML = `
      <div class="quiz-block-header">
        <span>Question ${index + 1}</span>
        <button type="button" class="mini-btn danger" data-remove-question="${index}">Remove</button>
      </div>
      <label class="field compact-field">
        <span>Question text</span>
        <input class="quiz-question-input" type="text" placeholder="e.g., Who is more likely to plan a surprise?" value="${(item.question || "Who is more likely to plan a surprise?").replace(/"/g, '&quot;')}" />
      </label>
      <div class="option-row small-row">
        <label class="field compact-field">
          <span>Option 1</span>
          <input class="quiz-option-input" type="text" placeholder="e.g., You" value="${(item.options?.[0] || "You").replace(/"/g, '&quot;')}" />
        </label>
        <label class="field compact-field">
          <span>Option 2</span>
          <input class="quiz-option-input" type="text" placeholder="e.g., Me" value="${(item.options?.[1] || "Me").replace(/"/g, '&quot;')}" />
        </label>
        <label class="field compact-field">
          <span>Option 3</span>
          <input class="quiz-option-input" type="text" placeholder="e.g., Both of us" value="${(item.options?.[2] || "Both of us").replace(/"/g, '&quot;')}" />
        </label>
      </div>
      <label class="field compact-field">
        <span>Correct answer</span>
        <select class="correct-answer-select">
          <option value="0" ${Number(item.answerIndex) === 0 ? "selected" : ""}>Option 1</option>
          <option value="1" ${Number(item.answerIndex) === 1 ? "selected" : ""}>Option 2</option>
          <option value="2" ${Number(item.answerIndex) === 2 ? "selected" : ""}>Option 3</option>
        </select>
      </label>
    `;
    container.appendChild(block);
  });

  container.querySelectorAll("[data-remove-question]").forEach(removeBtn => {
    removeBtn.addEventListener("click", (event) => {
      const { removeQuestion } = event.currentTarget.dataset;
      const current = Array.from(container.querySelectorAll(".quiz-question-block"));
      const index = Number(removeQuestion);
      if (current.length <= 1) return;
      current[index].remove();
      renderQuizInputBlocks(Array.from(container.querySelectorAll(".quiz-question-block")).map(block => {
        const inputs = block.querySelectorAll(".quiz-option-input");
        return {
          question: block.querySelector(".quiz-question-input").value,
          options: Array.from(inputs).map(input => input.value),
          answerIndex: Number(block.querySelector(".correct-answer-select").value || 0)
        };
      }));
    });
  });
}

function populateDraftForm(draft) {
  const values = { ...getDraftDefaults(), ...draft };
  if (byId("senderName")) byId("senderName").value = values.senderName;
  if (byId("recipientName")) byId("recipientName").value = values.recipientName;
  if (byId("heroTitle")) byId("heroTitle").value = values.heroTitle;
  if (byId("firstPageMessage")) byId("firstPageMessage").value = values.firstPageMessage;
  if (byId("nextButtonText")) byId("nextButtonText").value = values.nextButtonText;
  if (byId("personalMessage")) byId("personalMessage").value = values.personalMessage;
  if (byId("loveLetter")) byId("loveLetter").value = values.loveLetter;
  if (byId("yesPuzzle")) byId("yesPuzzle").value = values.yesPuzzle;
  renderDecoyPhraseInputs(values.decoyPhrases);
  renderQuizInputBlocks(values.quizQuestions || getDraftDefaults().quizQuestions);
}

function renderQuizCards(draft) {
  const previewQuizList = document.getElementById("previewQuizList");
  const questions = draft.quizQuestions && draft.quizQuestions.length ? draft.quizQuestions : getDraftDefaults().quizQuestions;

  const renderList = (container) => {
    if (!container) return;
    container.innerHTML = "";
    questions.forEach((q, idx) => {
      const item = document.createElement("div");
      item.className = "preview-question-item";
      const heading = document.createElement("h4");
      heading.textContent = `Q${idx + 1}. ${q.question || `Question ${idx + 1}`}`;
      const optionsList = document.createElement("ul");
      (q.options || ["Option 1", "Option 2", "Option 3"]).forEach(option => {
        const optionItem = document.createElement("li");
        optionItem.textContent = option;
        optionsList.appendChild(optionItem);
      });
      item.append(heading, optionsList);
      container.appendChild(item);
    });
  };

  renderList(previewQuizList);
}

function renderPreview(draft) {
  const previewTitle = document.getElementById("previewHeroTitle");
  const previewPageMessage = document.getElementById("previewFirstPageMessage");
  const previewPrimaryAction = document.getElementById("previewPrimaryAction");
  const previewPersonal = document.getElementById("previewPersonalMessage");
  const previewYesPuzzle = document.getElementById("previewYesPuzzle");
  const previewDecoyPhrases = document.getElementById("previewDecoyPhrases");

  if (previewTitle) previewTitle.textContent = draft.heroTitle || `Happy Birthday, ${draft.recipientName}!`;
  if (previewPageMessage) previewPageMessage.textContent = draft.firstPageMessage || "The world feels brighter with you in it.";
  if (previewPrimaryAction) previewPrimaryAction.textContent = draft.nextButtonText || "Open surprise";
  if (previewPersonal) previewPersonal.textContent = `${draft.personalMessage || "Happy Birthday!"}\n\nFrom ${draft.senderName}`;
  if (previewYesPuzzle) previewYesPuzzle.textContent = draft.yesPuzzle;
  const decoyPhraseSummary = getDecoyPhraseList(draft.decoyPhrases).join(", ");
  if (previewDecoyPhrases) previewDecoyPhrases.textContent = decoyPhraseSummary;

  renderQuizCards(draft);
}

function applyDraftToExperience(draft) {
  document.title = `Happy Birthday, ${draft.recipientName} ❤️`;
  if (byId("welcomeTitle")) byId("welcomeTitle").textContent = draft.heroTitle;
  if (byId("welcomeMessage")) byId("welcomeMessage").textContent = draft.firstPageMessage;
  if (byId("welcomeNextButton")) byId("welcomeNextButton").textContent = draft.nextButtonText;
  if (byId("birthdayRecipient")) byId("birthdayRecipient").textContent = draft.recipientName;
  if (byId("birthdayType")) byId("birthdayType").textContent = draft.personalMessage;
  if (byId("finalSender")) byId("finalSender").textContent = `${draft.senderName} ❤️`;

  CONFIG.COUPLE_QUIZ = draft.quizQuestions.map(question => ({
    question: question.question,
    options: question.options,
    correct: question.answerIndex
  }));
}

function saveCurrentDraft() {
  const draft = getDraftFromForm();
  activeDraft = draft;
  writeDraft(draft);
  setDraftStatus("Draft saved locally.");
  renderPreview(draft);
  return draft;
}

function previewCurrentDraft() {
  activeDraft = getDraftFromForm();
  renderPreview(activeDraft);
  applyDraftToExperience(activeDraft);
  resetExperience();
  showScreen("welcome");
}

const addQuestionBtn = document.getElementById("addQuestionBtn");
if (addQuestionBtn) {
  addQuestionBtn.addEventListener("click", () => {
    const container = document.getElementById("quizQuestionsContainer");
    if (!container) return;

    const current = Array.from(container.querySelectorAll(".quiz-question-block"));
    const nextIndex = current.length;
    const item = document.createElement("div");
    item.className = "quiz-question-block";
    item.innerHTML = `
      <div class="quiz-block-header">
        <span>Question ${nextIndex + 1}</span>
        <button type="button" class="mini-btn danger" data-remove-question="${nextIndex}">Remove</button>
      </div>
      <label class="field compact-field">
        <span>Question text</span>
        <input class="quiz-question-input" type="text" placeholder="e.g., Who is more likely to plan a surprise?" value="Who is more likely to plan a surprise?" />
      </label>
      <div class="option-row small-row">
        <label class="field compact-field">
          <span>Option 1</span>
          <input class="quiz-option-input" type="text" placeholder="e.g., You" value="You" />
        </label>
        <label class="field compact-field">
          <span>Option 2</span>
          <input class="quiz-option-input" type="text" placeholder="e.g., Me" value="Me" />
        </label>
        <label class="field compact-field">
          <span>Option 3</span>
          <input class="quiz-option-input" type="text" placeholder="e.g., Both of us" value="Both of us" />
        </label>
      </div>
      <label class="field compact-field">
        <span>Correct answer</span>
        <select class="correct-answer-select">
          <option value="0">Option 1</option>
          <option value="1">Option 2</option>
          <option value="2">Option 3</option>
        </select>
      </label>
    `;
    container.appendChild(item);

    item.querySelector("[data-remove-question]").addEventListener("click", () => {
      const blocks = Array.from(container.querySelectorAll(".quiz-question-block"));
      if (blocks.length <= 1) return;
      item.remove();
      renderQuizInputBlocks(Array.from(container.querySelectorAll(".quiz-question-block")).map(block => ({
        question: block.querySelector(".quiz-question-input").value,
        options: Array.from(block.querySelectorAll(".quiz-option-input")).map(input => input.value),
        answerIndex: Number(block.querySelector(".correct-answer-select").value || 0)
      })));
    });
  });
}

const previewDraftBtn = document.getElementById("previewDraftBtn");
const draftForm = document.getElementById("draftForm");
if (draftForm) {
  const updateLivePreview = () => renderPreview(getDraftFromForm());
  draftForm.addEventListener("input", updateLivePreview);
  draftForm.addEventListener("change", updateLivePreview);
}

if (previewDraftBtn) {
  previewDraftBtn.addEventListener("click", () => {
    previewCurrentDraft();
    setDraftStatus("Full experience preview started. Draft not saved yet.");
  });
}

const saveDraftBtn = document.getElementById("saveDraftBtn");
if (saveDraftBtn) {
  saveDraftBtn.addEventListener("click", saveCurrentDraft);
}

const finalEditBtn = document.getElementById("finalEditBtn");
if (finalEditBtn) finalEditBtn.addEventListener("click", () => showScreen("builder"));

const finalSaveDraftBtn = document.getElementById("finalSaveDraftBtn");
if (finalSaveDraftBtn) finalSaveDraftBtn.addEventListener("click", saveCurrentDraft);

const savedDraft = readDraft();
activeDraft = { ...getDraftDefaults(), ...(savedDraft || {}) };
if (savedDraft) {
  populateDraftForm(savedDraft);
  renderPreview(activeDraft);
} else {
  populateDraftForm(activeDraft);
  renderPreview(activeDraft);
}
applyDraftToExperience(activeDraft);

/* Personalize visible text */
document.title = `Happy Birthday, ${activeDraft.recipientName} ❤️`;

/* Floating hearts */
const heartContainer = document.getElementById("hearts");
function createHeart() {
  const h = document.createElement("span");
  h.className = "floating-heart";
  h.textContent = ["♥", "❤", "♡", "💕"][Math.floor(Math.random() * 4)];
  h.style.left = `${Math.random() * 100}%`;
  h.style.fontSize = `${12 + Math.random() * 22}px`;
  h.style.animationDuration = `${6 + Math.random() * 7}s`;
  heartContainer.appendChild(h);
  setTimeout(() => h.remove(), 14000);
}
setInterval(createHeart, 650);

/* NO button game */
const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");
const noHint = document.getElementById("noHint");
const noButtonArea = document.getElementById("noButtonArea");
const yesPuzzleGrid = document.getElementById("yesPuzzleGrid");
const yesPuzzleProgress = document.getElementById("yesPuzzleProgress");

let noClicks = 0;
const noMessages = [
  "Hmm... I don't think that's the correct answer. 🤨",
  "Are you REALLY sure? 😏",
  "Nice try! 😂",
  "The NO button is getting nervous... 🏃",
  "Okay, now you're just teasing me. ❤️",
  "Fine. NO is officially going into hiding! Find YES! 🧩"
];

function moveNoButton() {
  const area = noButtonArea.getBoundingClientRect();
  const btn = noButton.getBoundingClientRect();
  const maxX = Math.max(5, area.width - btn.width - 8);
  const maxY = Math.max(5, area.height - btn.height - 8);

  noButton.style.left = `${5 + Math.random() * maxX}px`;
  noButton.style.top = `${5 + Math.random() * maxY}px`;
}

function buildYesFinder() {
  yesPuzzleGrid.innerHTML = "";
  yesButton.classList.add("hidden");
  yesPuzzleProgress.textContent = "0 / 9 opened";
  const yesIndex = Math.floor(Math.random() * 9);
  const decoys = getDecoyPhraseList(activeDraft.decoyPhrases);
  let openedTiles = 0;
  let yesTile = null;

  for (let i = 0; i < 9; i++) {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "yes-puzzle-piece";
    tile.textContent = "❓";
    tile.setAttribute("aria-label", `Mystery tile ${i + 1}`);
    tile.addEventListener("click", () => {
      if (tile.disabled) return;
      tile.disabled = true;
      openedTiles++;
      yesPuzzleProgress.textContent = `${openedTiles} / 9 opened`;

      if (i === yesIndex) {
        yesTile = tile;
        tile.textContent = openedTiles === 9 ? "YES ❤️" : "🔒 Found it";
        tile.setAttribute("aria-label", openedTiles === 9
          ? "Found the honest answer: yes"
          : "YES found, but locked until the ninth tile");
        tile.classList.add(openedTiles === 9 ? "correct" : "revealed");
        noHint.textContent = openedTiles === 9
          ? `${activeDraft.yesPuzzle} ⚖️❤️`
          : "You found YES! The court unlocks it after all 9 tiles. 🔒";
      } else {
        const decoy = decoys.splice(Math.floor(Math.random() * decoys.length), 1)[0];
        tile.textContent = decoy;
        tile.setAttribute("aria-label", `Excuse: ${decoy}`);
        tile.classList.add("revealed");
        noHint.textContent = [
          "Objection! That excuse makes no sense 😂",
          "Suspicious. Someone has been notified 🕵️",
          "The love court rejects this answer ⚖️"
        ][Math.floor(Math.random() * 3)];
      }

      if (openedTiles === 9) {
        yesTile.textContent = "YES ❤️";
        yesTile.setAttribute("aria-label", "Found the honest answer: yes");
        yesTile.classList.remove("revealed");
        yesTile.classList.add("correct");
        yesButton.classList.remove("hidden");
        yesPuzzleProgress.textContent = "CASE SOLVED: love confirmed";
        noHint.textContent = `${activeDraft.yesPuzzle} ⚖️❤️`;
      }
    });
    yesPuzzleGrid.appendChild(tile);
  }
}

function resetExperience() {
  noClicks = 0;
  noButton.textContent = "Try saying no... if you dare 😏";
  noButton.style.left = "";
  noButton.style.top = "";
  noHint.textContent = "";
  buildYesFinder();
  reasonIndex = 0;
  coupleIndex = 0;
  letterStarted = false;
  letterText.textContent = "";
  byId("countdown").textContent = "3";
  byId("countdown").classList.remove("hidden");
  byId("finalContent").classList.add("hidden");
}

buildYesFinder();

noButton.addEventListener("click", (e) => {
  e.preventDefault();
  noClicks++;
  noHint.textContent = noMessages[Math.min(noClicks - 1, noMessages.length - 1)];

  if (noClicks >= 5) {
    noButton.textContent = "NO is hiding! 🏃";
    setTimeout(moveNoButton, 50);
    setTimeout(moveNoButton, 250);
    setTimeout(moveNoButton, 500);
  } else {
    moveNoButton();
  }
});

noButton.addEventListener("mouseenter", () => {
  if (noClicks >= 2) moveNoButton();
});

yesButton.addEventListener("click", () => {
  initReasons();
  showScreen("reasons");
});

/* Reasons carousel */
const reasonCard = document.getElementById("reasonCard");
const reasonTitle = document.getElementById("reasonTitle");
const reasonText = document.getElementById("reasonText");
const reasonDots = document.getElementById("reasonDots");
const reasonNext = document.getElementById("reasonNext");

let reasonIndex = 0;

function initReasons() {
  reasonIndex = 0;
  reasonDots.innerHTML = "";
  CONFIG.REASONS.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = `progress-dot ${i === 0 ? "active" : ""}`;
    reasonDots.appendChild(dot);
  });
  renderReason();
}

function renderReason() {
  const r = CONFIG.REASONS[reasonIndex];
  reasonCard.animate(
    [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 280, easing: "ease-out" }
  );
  document.querySelector(".reason-icon").textContent = r.icon;
  document.querySelector(".reason-number").textContent = String(reasonIndex + 1).padStart(2, "0");
  reasonTitle.textContent = r.title;
  reasonText.textContent = r.text;
  [...reasonDots.children].forEach((d, i) => d.classList.toggle("active", i === reasonIndex));
  reasonNext.textContent = reasonIndex === CONFIG.REASONS.length - 1
    ? "Okay... one more game 😏"
    : "There's more... ❤️";
}

reasonNext.addEventListener("click", () => {
  if (reasonIndex < CONFIG.REASONS.length - 1) {
    reasonIndex++;
    renderReason();
  } else {
    initCoupleQuiz();
    showScreen("coupleQuiz");
  }
});

/* Couple quiz */
const coupleQuestion = document.getElementById("coupleQuestion");
const coupleQNo = document.getElementById("coupleQNo");
const coupleOptions = document.getElementById("coupleOptions");
const coupleFeedback = document.getElementById("coupleFeedback");
const coupleNext = document.getElementById("coupleNext");

let coupleIndex = 0;

function initCoupleQuiz() {
  coupleIndex = 0;
  renderCoupleQuestion();
}

function renderCoupleQuestion() {
  const q = CONFIG.COUPLE_QUIZ[coupleIndex];
  coupleQNo.textContent = `QUESTION ${coupleIndex + 1} / ${CONFIG.COUPLE_QUIZ.length}`;
  coupleQuestion.textContent = q.question;
  coupleOptions.innerHTML = "";
  coupleFeedback.textContent = "";
  coupleNext.classList.add("hidden");

  q.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.addEventListener("click", () => {
      [...coupleOptions.children].forEach(b => b.disabled = true);
      if (i === q.correct) {
        coupleFeedback.textContent = "Correct! ❤️ You know us too well.";
      } else {
        coupleFeedback.textContent = "Hmm... I'll let you have that one. 😂❤️";
      }
      coupleNext.textContent = coupleIndex === CONFIG.COUPLE_QUIZ.length - 1
        ? "See our story 📸"
        : "Next question →";
      coupleNext.classList.remove("hidden");
    });
    coupleOptions.appendChild(btn);
  });
}

coupleNext.addEventListener("click", () => {
  if (coupleIndex < CONFIG.COUPLE_QUIZ.length - 1) {
    coupleIndex++;
    renderCoupleQuestion();
  } else {
    showScreen("story");
  }
});

/* Letter typing */
const letterText = document.getElementById("letterText");
let letterStarted = false;

function typeLetter() {
  if (letterStarted) return;
  letterStarted = true;
  letterText.textContent = "";
  const text = activeDraft.loveLetter || CONFIG.LOVE_LETTER;
  let i = 0;

  function tick() {
    letterText.textContent = text.slice(0, i++);
    if (i <= text.length) {
      setTimeout(tick, 15);
    }
  }
  tick();
}

const letterObserver = new MutationObserver(() => {
  const letterScreen = document.getElementById("letter");
  if (letterScreen.classList.contains("active")) typeLetter();
});
letterObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["class"] });

/* Final countdown + confetti */
document.getElementById("finalSurpriseBtn").addEventListener("click", () => {
  showScreen("final");
  runCountdown();
});

function runCountdown() {
  const countdown = document.getElementById("countdown");
  const finalContent = document.getElementById("finalContent");
  finalContent.classList.add("hidden");

  let n = 3;
  countdown.textContent = n;

  const timer = setInterval(() => {
    n--;
    if (n > 0) {
      countdown.textContent = n;
      countdown.animate(
        [{ transform: "scale(.5)", opacity: .2 }, { transform: "scale(1)", opacity: 1 }],
        { duration: 500 }
      );
    } else {
      clearInterval(timer);
      countdown.classList.add("hidden");
      finalContent.classList.remove("hidden");
      launchConfetti();
    }
  }, 900);
}

/* Confetti */
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confetti = [];
let confettiRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  confetti = Array.from({ length: 170 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * .3,
    size: 5 + Math.random() * 8,
    speed: 2 + Math.random() * 4,
    angle: Math.random() * Math.PI * 2,
    rotation: Math.random() * .2,
    drift: -1 + Math.random() * 2,
    life: 180 + Math.random() * 160
  }));

  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let alive = 0;

  confetti.forEach(c => {
    if (c.life <= 0) return;
    alive++;
    c.y += c.speed;
    c.x += c.drift;
    c.angle += c.rotation;
    c.life--;

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.angle);
    ctx.globalAlpha = Math.min(1, c.life / 40);
    ctx.fillStyle = `hsl(${(c.x + c.y) % 360}, 85%, 65%)`;
    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * .6);
    ctx.restore();
  });

  if (alive > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* Replay */
document.getElementById("replayBtn").addEventListener("click", () => {
  location.reload();
});

/* Make story photos easy to personalize:
   Replace the placeholder divs with:
   <img src="assets/photo1.jpg" alt="Our memory">
*/

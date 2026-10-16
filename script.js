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
  HER_NAME: "Taylor",
  YOUR_NAME: "Alex",

  LOVE_LETTER: `Happy Birthday, Taylor! 🎂

Thanks for all the laughs, encouragement, and great memories.

You bring so much fun and kindness to the people around you.

I hope the year ahead brings you new adventures and plenty of reasons to celebrate.

Keep being your one-of-a-kind self, and never stop looking forward to what's next.

Have a wonderful birthday and an amazing year!

With best wishes,\nAlex`,

  REASONS: [
    {
      icon: "😊",
      title: "Your kindness",
      text: "Your kindness makes a difference to the people around you."
    },
    {
      icon: "😊",
      title: "Your laugh",
      text: "Your laughter can turn an ordinary moment into a fun one."
    },
    {
      icon: "😂",
      title: "Our conversations",
      text: "Even the simplest chats with you are never boring."
    },
    {
      icon: "🏡",
      title: "You feel like home",
      text: "You make any place more fun to be."
    },
      {
        icon: "🤝",
      title: "The little things",
      text: "The thoughtful things you do make a lasting difference."
    },
    {
        icon: "🌟",
      title: "Simply... you",
      text: "You are great exactly as you are."
    }
  ],

  COUPLE_QUIZ: [
    {
      question: "Who is more likely to plan a surprise? 🎁",
      options: ["You", "Me", "Both of us", "Neither of us"],
      correct: 2
    },
    {
      question: "What makes our time together special?",
      options: ["The laughter", "The little moments", "All of it", "The snacks"],
      correct: 2
    },
    {
      question: "What should we do to celebrate? ✨",
      options: ["Have a picnic", "Play a game", "Enjoy a favorite meal", "All of the above"],
      correct: 3
    },
    {
      question: "Which quality stands out most? 😊",
      options: ["Your kindness", "Your humor", "Your courage", "All of them"],
      correct: 3
    }
  ]
};

const screens = [...document.querySelectorAll(".screen")];
const bgMusic = document.getElementById("bgMusic");
const audioPreview = document.getElementById("audioPreview");
const audioFileInput = document.getElementById("audioFileInput");
const audioFileName = document.getElementById("audioFileName");
const defaultBackgroundAudio = {
  id: "default-background-song",
  src: "assets/Payye_Veeshum.mp3",
  name: "Payye_Veeshum.mp3",
  type: "audio/mpeg"
};
let selectedBackgroundAudio = { ...defaultBackgroundAudio };
let backgroundAudioObjectUrl = null;
let backgroundAudioSavePromise = null;

function tryPlayMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 0.28;
  bgMusic.play().catch(() => {});
}

const welcomeNextButton = document.getElementById("welcomeNextButton");
if (welcomeNextButton) welcomeNextButton.addEventListener("click", tryPlayMusic);

function showScreen(id) {
  document.body.classList.toggle("quiz-screen-active", ["quizIntro", "loveQuiz", "reasons", "coupleQuiz"].includes(id));
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });

}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.next));
});

const draftStorageKey = "greenwish-draft-v3";
const photoDatabaseName = "greenwish-photo-library";
const byId = (id) => document.getElementById(id);
let activeDraft = null;
let storyPhotoUrls = [];
const defaultDecoyPhrases = [
  "I saved you the last bite",
  "Just five more minutes",
  "Are we there yet?",
  "Guess what happened today?",
  "Let's do that again sometime",
  "You had to be there",
  "I'll bring the snacks",
  "One more story"
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

function openPhotoDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(photoDatabaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("photos");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function savePhotoBlob(photoId, file) {
  return openPhotoDatabase().then(database => new Promise((resolve, reject) => {
    const transaction = database.transaction("photos", "readwrite");
    transaction.objectStore("photos").put(file, photoId);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  }));
}

function loadPhotoBlob(photoId) {
  return openPhotoDatabase().then(database => new Promise((resolve, reject) => {
    const request = database.transaction("photos", "readonly").objectStore("photos").get(photoId);
    request.onsuccess = () => {
      database.close();
      resolve(request.result || null);
    };
    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  }));
}

function deletePhotoBlob(photoId) {
  return openPhotoDatabase().then(database => new Promise((resolve, reject) => {
    const transaction = database.transaction("photos", "readwrite");
    transaction.objectStore("photos").delete(photoId);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  }));
}

function createPhotoId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function releaseBackgroundAudioUrl() {
  if (backgroundAudioObjectUrl) URL.revokeObjectURL(backgroundAudioObjectUrl);
  backgroundAudioObjectUrl = null;
}

function setBackgroundAudioSource(source) {
  if (audioPreview) audioPreview.src = source;
  if (bgMusic) {
    bgMusic.src = source;
    bgMusic.load();
  }
}

async function renderAudioInput(audio) {
  selectedBackgroundAudio = { ...defaultBackgroundAudio, ...(audio || {}) };
  if (audioFileName) audioFileName.textContent = selectedBackgroundAudio.name;

  if (selectedBackgroundAudio.src.startsWith("indexeddb:")) {
    if (welcomeNextButton) welcomeNextButton.disabled = true;
    try {
      const file = await loadPhotoBlob(selectedBackgroundAudio.id);
      if (!file) throw new Error("Saved audio file is missing");
      releaseBackgroundAudioUrl();
      backgroundAudioObjectUrl = URL.createObjectURL(file);
      setBackgroundAudioSource(backgroundAudioObjectUrl);
    } catch (error) {
      selectedBackgroundAudio = { ...defaultBackgroundAudio };
      if (audioFileName) audioFileName.textContent = defaultBackgroundAudio.name;
      setBackgroundAudioSource(defaultBackgroundAudio.src);
      setDraftStatus("The saved song could not be loaded. The default song is selected.");
    } finally {
      if (welcomeNextButton) welcomeNextButton.disabled = false;
    }
    return;
  }

  releaseBackgroundAudioUrl();
  setBackgroundAudioSource(selectedBackgroundAudio.src);
}

const chooseAudioBtn = document.getElementById("chooseAudioBtn");
if (chooseAudioBtn) chooseAudioBtn.addEventListener("click", () => audioFileInput.click());

if (audioFileInput) {
  audioFileInput.addEventListener("change", async event => {
    const file = event.currentTarget.files[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      setDraftStatus("Choose an audio file for the background song.");
      return;
    }

    const previousAudio = selectedBackgroundAudio;
    const audioId = createPhotoId();
    selectedBackgroundAudio = {
      id: audioId,
      src: `indexeddb:${audioId}`,
      name: file.name,
      type: file.type || "audio/mpeg"
    };
    releaseBackgroundAudioUrl();
    backgroundAudioObjectUrl = URL.createObjectURL(file);
    setBackgroundAudioSource(backgroundAudioObjectUrl);
    if (audioFileName) audioFileName.textContent = file.name;

    const chooseAudioButton = byId("chooseAudioBtn");
    const defaultAudioButton = byId("useDefaultAudioBtn");
    if (chooseAudioButton) chooseAudioButton.disabled = true;
    if (defaultAudioButton) defaultAudioButton.disabled = true;
    backgroundAudioSavePromise = savePhotoBlob(audioId, file).then(() => {
      if (previousAudio.src.startsWith("indexeddb:")) deletePhotoBlob(previousAudio.id).catch(() => {});
      setDraftStatus("Song added. Save the draft to keep it selected.");
    }).catch(() => {
      selectedBackgroundAudio = { ...defaultBackgroundAudio };
      renderAudioInput(defaultBackgroundAudio);
      setDraftStatus("This song could not be stored in this browser. Try a smaller audio file.");
    });
    await backgroundAudioSavePromise;
    backgroundAudioSavePromise = null;
    if (chooseAudioButton) chooseAudioButton.disabled = false;
    if (defaultAudioButton) defaultAudioButton.disabled = false;
  });
}

const useDefaultAudioBtn = document.getElementById("useDefaultAudioBtn");
if (useDefaultAudioBtn) {
  useDefaultAudioBtn.addEventListener("click", () => {
    if (selectedBackgroundAudio.src.startsWith("indexeddb:")) {
      deletePhotoBlob(selectedBackgroundAudio.id).catch(() => {});
    }
    renderAudioInput(defaultBackgroundAudio);
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
    senderName: "Alex",
    recipientName: "Taylor",
    heroTitle: "Happy Birthday, Taylor!",
    firstPageMessage: "Today is all about celebrating you, sharing a few laughs, and making another happy memory.",
    nextButtonText: "Open surprise",
    personalMessage: "Happy Birthday! Wishing you a day full of laughter, good memories, and your favorite things.",
    loveLetter: "Thanks for all the laughs, encouragement, and memories. I hope the year ahead brings you plenty of good things.",
    quizQuestions: [
      createQuizQuestion("What always makes you smile?", ["A good story", "A tasty snack", "A fun day together"], 2),
      createQuizQuestion("Which activity sounds most fun?", ["A day outside", "A movie", "Trying something new"], 2),
      createQuizQuestion("What makes a great birthday?", ["Good company", "Lots of fun", "A favorite treat"], 0)
    ],
    photos: [{ id: "paris-default", src: "assets/Paris.png", caption: "Our dream destination" }],
    audio: { ...defaultBackgroundAudio },
    yesNoQuestion: "Ready for a birthday surprise?",
    yesPuzzle: "I knew you'd be up for it!",
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
    photos: Array.from(document.querySelectorAll(".photo-input-item"), item => ({
      id: item.dataset.photoId,
      src: item.dataset.photoSrc,
      caption: item.querySelector(".photo-caption-input").value.trim()
    })).filter(photo => photo.src),
    audio: { ...selectedBackgroundAudio },
    yesNoQuestion: (byId("yesNoQuestion") && byId("yesNoQuestion").value.trim()) || getDraftDefaults().yesNoQuestion,
    yesPuzzle: (byId("yesPuzzle") && byId("yesPuzzle").value.trim()) || getDraftDefaults().yesPuzzle,
    decoyPhrases: getDecoyPhraseList(
      Array.from(document.querySelectorAll(".decoy-phrase-input"), input => input.value)
    )
  };
}

function setPhotoInputPreview(item, src, isTemporary = false) {
  const image = item.querySelector(".photo-input-image");
  const emptyLabel = item.querySelector(".photo-input-empty");
  if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
  item.previewUrl = isTemporary ? src : null;
  image.src = src;
  image.hidden = false;
  emptyLabel.hidden = true;
}

function createPhotoInput(photo = {}) {
  const item = document.createElement("div");
  item.className = "photo-input-item";
  item.dataset.photoId = photo.id || createPhotoId();
  item.dataset.photoSrc = photo.src || "";
  item.innerHTML = `
    <div class="photo-input-preview">
      <img class="photo-input-image" alt="Selected photo" hidden />
      <span class="photo-input-empty">Choose a photo</span>
    </div>
    <div class="photo-input-fields">
      <label class="field compact-field">
        <span>Message for this photo</span>
        <input class="photo-caption-input" type="text" placeholder="e.g., Our dream destination" />
      </label>
      <div class="photo-input-actions">
        <input class="photo-file-input" type="file" accept="image/*" hidden />
        <button type="button" class="secondary-btn photo-browse-button">Browse local photos</button>
        <button type="button" class="mini-btn danger photo-remove-button">Remove</button>
      </div>
      <p class="photo-file-name"></p>
    </div>
  `;

  item.querySelector(".photo-caption-input").value = photo.caption || "";
  item.querySelector(".photo-browse-button").addEventListener("click", () => {
    item.querySelector(".photo-file-input").click();
  });
  item.querySelector(".photo-file-input").addEventListener("change", async event => {
    const file = event.currentTarget.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setDraftStatus("Choose an image file for this photo memory.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoInputPreview(item, previewUrl, true);
    item.querySelector(".photo-file-name").textContent = file.name;
    const saveTask = savePhotoBlob(item.dataset.photoId, file).then(() => {
      item.dataset.photoSrc = `indexeddb:${item.dataset.photoId}`;
      setDraftStatus("Photo added. Save the draft to keep this photo in your story.");
    }).catch(() => {
      item.dataset.photoSrc = "";
      setDraftStatus("This photo could not be stored in this browser. Try a smaller image.");
    });
    item.photoSavePromise = saveTask;
    await saveTask;
    item.photoSavePromise = null;
  });
  item.querySelector(".photo-remove-button").addEventListener("click", () => {
    const source = item.dataset.photoSrc;
    if (source.startsWith("indexeddb:")) {
      deletePhotoBlob(item.dataset.photoId).catch(() => {});
    }
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    item.remove();
  });

  if (photo.src && photo.src.startsWith("indexeddb:")) {
    loadPhotoBlob(item.dataset.photoId).then(file => {
      if (file && item.isConnected) setPhotoInputPreview(item, URL.createObjectURL(file), true);
    }).catch(() => {});
    item.querySelector(".photo-file-name").textContent = "Saved photo";
  } else if (photo.src) {
    setPhotoInputPreview(item, photo.src);
    item.querySelector(".photo-file-name").textContent = "Paris example";
  }

  return item;
}

function renderPhotoInputs(photos) {
  const container = byId("photoInputsContainer");
  if (!container) return;
  container.innerHTML = "";
  (photos || []).forEach(photo => container.appendChild(createPhotoInput(photo)));
}

function renderStoryPhotos(photos = []) {
  const timeline = byId("storyTimeline");
  if (!timeline) return;
  storyPhotoUrls.forEach(url => URL.revokeObjectURL(url));
  storyPhotoUrls = [];
  timeline.innerHTML = "";

  if (!photos.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "story-empty";
    emptyMessage.textContent = "No photo memories added yet.";
    timeline.appendChild(emptyMessage);
    return;
  }

  const memoryIcons = ["❤️", "🥰", "✈️", "💍"];
  photos.forEach((photo, index) => {
    const item = document.createElement("article");
    item.className = "timeline-item";
    const dot = document.createElement("div");
    dot.className = "timeline-dot";
    dot.textContent = memoryIcons[index % memoryIcons.length];
    const imageFrame = document.createElement("div");
    imageFrame.className = "memory-photo";
    const image = document.createElement("img");
    image.alt = photo.caption || `Photo memory ${index + 1}`;
    imageFrame.appendChild(image);
    item.append(dot, imageFrame);

    if (photo.caption) {
      const caption = document.createElement("p");
      caption.textContent = photo.caption;
      item.appendChild(caption);
    }
    timeline.appendChild(item);

    if (photo.src.startsWith("indexeddb:")) {
      loadPhotoBlob(photo.id).then(file => {
        if (!file || !image.isConnected) return;
        const url = URL.createObjectURL(file);
        storyPhotoUrls.push(url);
        image.src = url;
      }).catch(() => {});
    } else {
      image.src = photo.src;
    }
  });
}

async function waitForPhotoUploads() {
  const photoUploads = Array.from(document.querySelectorAll(".photo-input-item"), item => item.photoSavePromise);
  await Promise.all([...photoUploads, backgroundAudioSavePromise].filter(Boolean));
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
  if (byId("yesNoQuestion")) byId("yesNoQuestion").value = values.yesNoQuestion || getDraftDefaults().yesNoQuestion;
  if (byId("yesPuzzle")) byId("yesPuzzle").value = values.yesPuzzle;
  renderAudioInput(values.audio || defaultBackgroundAudio);
  renderPhotoInputs(values.photos || getDraftDefaults().photos);
  renderDecoyPhraseInputs(values.decoyPhrases);
  renderQuizInputBlocks(values.quizQuestions || getDraftDefaults().quizQuestions);
}

function applyDraftToExperience(draft) {
  document.title = `Happy Birthday, ${draft.recipientName} ❤️`;
  if (byId("welcomeTitle")) byId("welcomeTitle").textContent = draft.heroTitle;
  if (byId("welcomeMessage")) byId("welcomeMessage").textContent = draft.firstPageMessage;
  if (byId("welcomeNextButton")) byId("welcomeNextButton").textContent = draft.nextButtonText;
  if (byId("birthdayRecipient")) byId("birthdayRecipient").textContent = draft.recipientName;
  if (byId("birthdayType")) byId("birthdayType").textContent = draft.personalMessage;
  if (byId("yesNoQuestionHeading")) byId("yesNoQuestionHeading").textContent = draft.yesNoQuestion || getDraftDefaults().yesNoQuestion;
  if (byId("finalSender")) byId("finalSender").textContent = `${draft.senderName} ❤️`;
  renderStoryPhotos(draft.photos || []);

  CONFIG.COUPLE_QUIZ = draft.quizQuestions.map(question => ({
    question: question.question,
    options: question.options,
    correct: question.answerIndex
  }));
}

async function saveCurrentDraft() {
  await waitForPhotoUploads();
  const draft = getDraftFromForm();
  activeDraft = draft;
  writeDraft(draft);
  setDraftStatus("Draft saved locally.");
  return draft;
}

async function previewCurrentDraft() {
  await waitForPhotoUploads();
  activeDraft = getDraftFromForm();
  applyDraftToExperience(activeDraft);
  resetExperience();
  showScreen("welcome");
}

const addPhotoBtn = document.getElementById("addPhotoBtn");
if (addPhotoBtn) {
  addPhotoBtn.addEventListener("click", () => {
    const container = byId("photoInputsContainer");
    if (container) container.appendChild(createPhotoInput());
  });
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

if (previewDraftBtn) {
  previewDraftBtn.addEventListener("click", async () => {
    await previewCurrentDraft();
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
populateDraftForm(activeDraft);
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
  "Okay, now you're just teasing me.",
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
  yesPuzzleProgress.textContent = "0 / 9 balloons popped";
  const decoys = getDecoyPhraseList(activeDraft.decoyPhrases);
  let poppedBalloons = 0;

  for (let index = 0; index < 9; index++) {
    const balloon = document.createElement("button");
    balloon.type = "button";
    balloon.className = "decoy-balloon";
    balloon.innerHTML = '<span class="balloon-art" aria-hidden="true">🎈</span><span class="balloon-reveal"></span>';
    balloon.setAttribute("aria-label", `Pop balloon ${index + 1}`);
    balloon.addEventListener("click", () => {
      if (balloon.disabled) return;

      balloon.disabled = true;
      poppedBalloons++;
      const isFinalBalloon = poppedBalloons === 9;
      const revealedText = isFinalBalloon ? "YES" : decoys.shift();
      const reveal = balloon.querySelector(".balloon-reveal");
      reveal.textContent = revealedText;
      balloon.classList.add("popped");
      balloon.setAttribute("aria-label", isFinalBalloon
        ? "Ninth balloon popped: YES revealed"
        : `Balloon popped: ${revealedText}`);
      yesPuzzleProgress.textContent = isFinalBalloon
        ? "9 / 9 popped: YES revealed!"
        : `${poppedBalloons} / 9 balloons popped`;

      if (isFinalBalloon) {
        noHint.textContent = `${activeDraft.yesPuzzle} ⚖️`;
        yesButton.classList.remove("hidden");
      }
    });
    yesPuzzleGrid.appendChild(balloon);
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
    ? "Okay... one more game"
    : "There's more...";
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
        coupleFeedback.textContent = "Correct! You know us too well.";
      } else {
        coupleFeedback.textContent = "Hmm... I'll let you have that one. 😂";
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

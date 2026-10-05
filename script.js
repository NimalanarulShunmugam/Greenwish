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
  HER_NAME: "Keerthi",
  YOUR_NAME: "Chammu",

  LOVE_LETTER: `Happy Birthday, my content queen. ❤️

After all the ups and downs we've been through in these three years, I hope we've reached a point the best for us is enaku ne unaku naa dha...vera better life ila

"Naa illama nee illa, nee illama naa illa."

Enala nee illama iruka mudiyadhu. Unna enna thavira yaaralayum ipdi paathuka mudiyadhu.

Namaku kedacha periya gift Nimalan. ❤️

You gave me a reason to live, a reason to dream, and a reason to look forward to tomorrow. My life is not just mine anymore. It's for the three of us — you, me and Nimalan.

Nimalan naaliku valandhu avanoda own life-a paathutu ponaalum, enaku nee irupa. Appavum naan unakkaga iruppen.

Loosu maari ennalaam pesuren 😂. Aana unmai enna na, nee dhaan enakku indha life-oda purpose-a kudutha.

Enaku niraya suicidal thoughts varum, death ninachu bayam ila...vandha ok nu dha irundhirken..aana ini I want to live for you and nimalan. No more end of life thoughts

Key-thee & Nimalan. ❤️

Nee enna romba nalla paathukra. En life-la yaarum enna ipdi paathadhu illa. Enakku nu edhavadhu venumna nee paathu paathu seira. Enakku edhavadhu aana nee worry panra.

Nimalan-ai indha ulagathukku kondu vandhadhukkum, enakku indha beautiful family-a kuduthadhukkum, romba nandri. ❤️

Nee kovathula pesura sila vaarthaigal enna hurt pannum. Aana nee kovathula pesura nu enakku theriyum. Un mela irukkura love nala naan adha poruthupen, marandhupen.

Aana oru request — kovathula vaarthaigal konjam careful-aa pesu, enakkaga. ❤️

Un life-la nee romba heights-ku poganum.

Nalla work pannu.
Niraya heights po.
Global leader aagu.

Oru naal Behindwoods-la interview kudukkumbodhu,
"En husband eppovume naan global leader aaganum nu sollite irupparu"
nu sollanum. 😂❤️

Life-la nee niraya prove pannanum — career-la, life-la, everything.

Nimalan-ai naan paathukaren. Nee un dreams-a chase pannu.

Nee indha ulagathula best mom.
Nee enakku best wife.
Nee Nimalan-ku best mummy.

And most importantly...

Nee dhaan enakku best friend.
Nee dhaan en home.
Nee dhaan en life.

Na unna romba love pandren.
Na unakkaga iruppen.
Eppovume.

Happy Birthday, Keerthi. ❤️

All the best for everything you're going to achieve.

Love youuuuu,
Chammu ❤️`,

  REASONS: [
    {
      icon: "😊",
      title: "Nee seira biriyani",
      text: "enaku theryum , oh idha ena ne love pandradhuku reason uh? vera reason ilaya nu keka thonum- next page po di venna"
    },
    {
      icon: "🤍",
      title: "The way you care",
      text: "Ne enaku thedi thedi pandra vishayam"
    },
    {
      icon: "😂",
      title: "Your Contents",
      text: "The hell lots of reasons to make me shaking laughs"
    },
    {
      icon: "🏡",
      title: "You feel like home",
      text: "You gave me my own family, ne naa Nimalan"
    },
    {
      icon: "🥰",
      title: "The little things",
      text: "example- yu share  your food for me"
    },
    {
      icon: "❤️",
      title: "Simply... you",
      text: "Neeyae vaazhkai enbaen, ini vaalum naatkal ellam"
    }
  ],

  COUPLE_QUIZ: [
    {
      question: "Who among us loves the other person the most? 😂",
      options: ["Chammu 😎", "Keerthi 😇", "Both of us 😂", "Nobody!"],
      correct: 1
    },
    {
      question: "Who puts more bomb secretly? 😏",
      options: ["Chammu", "Keerthi", "Nimalan", "Let's not expose anyone 😂"],
      correct: 1
    },
    {
      question: "Who is the better cook? 🍳",
      options: ["Chammu", "Keerthi", "Both", "It's classified information"],
      correct: 1
    },
    {
      question: "Who takes care of nimalan well?",
      options:["Chammu", "Keerthi", "Definitely both", "Let's not expose anyone 😂"],
      correct: 1
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

/* Personalize visible text */
document.title = `Happy Birthday, ${CONFIG.HER_NAME} ❤️`;

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
  const decoys = [
    "sorry, vera click pannunga",
    "Ask Nimalanarul",
    "idhu ena pazham? aahn vaazhapazham",
    "sildra ila maa..palaya soru ok va",
    "en kita edhu darling unta heavy uh pudichudhu?",
    "Naa ila yes'u,vera try panu",
    "hello saar, are you kapil?",
    "appanae muruga, ayo pillayara"
  ];
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
          ? "Caught the only honest answer! The court accepts YES. ⚖️❤️"
          : "You found YES! The court unlocks it after all 9 tiles. 🔒";
      } else {
        const decoy = decoys.splice(Math.floor(Math.random() * decoys.length), 1)[0];
        tile.textContent = decoy;
        tile.setAttribute("aria-label", `Excuse: ${decoy}`);
        tile.classList.add("revealed");
        noHint.textContent = [
          "Objection! That excuse makes no sense 😂",
          "Suspicious. Nimalan has been notified 🕵️",
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
        noHint.textContent = "All 9 excuses checked. The court accepts YES! ⚖️❤️";
      }
    });
    yesPuzzleGrid.appendChild(tile);
  }
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
  const text = CONFIG.LOVE_LETTER;
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

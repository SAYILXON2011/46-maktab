
"use strict";

// ==========================================
// WOW EXPERIENCE — COMPLETE JAVASCRIPT
// ==========================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const stars = $("#stars");
const toast = $("#toast");
const modal = $("#gameModal");
const gameContent = $("#gameContent");
const modalTitle = $("#modalTitle");

const getData = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

let points = Number(localStorage.getItem("wow_points")) || 0;
let discoveries = Number(localStorage.getItem("wow_discoveries")) || 0;
let gamesPlayed = Number(localStorage.getItem("wow_games")) || 0;
let achievements = getData("wow_achievements", []);
let ownedItems = getData("wow_shop_owned", []);

let avatar = getData("wow_my_avatar", {
  face: "🧑‍🚀",
  name: "Yangi qahramon",
  color: "#8b5cff",
  colorName: "Binafsha"
});

let avatarImage = localStorage.getItem("wow_avatar_image") || "";

const achievementDefinitions = [
  { id: "first_discovery", title: "Birinchi kashfiyot" },
  { id: "five_discoveries", title: "Izlanuvchi" },
  { id: "first_game", title: "Birinchi o‘yin" },
  { id: "five_games", title: "O‘yin ustasi" },
  { id: "daily_one", title: "Sovg‘a ovchisi" },
  { id: "points_100", title: "Boylik sari" }
];

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function saveStats() {
  localStorage.setItem("wow_points", points);
  localStorage.setItem("wow_discoveries", discoveries);
  localStorage.setItem("wow_games", gamesPlayed);
  saveData("wow_achievements", achievements);
}

function addPoints(amount, message = "") {
  points = Math.max(0, points + amount);
  saveStats();
  updateAll();
  if (message) showToast(message);
}

function unlockAchievement(id) {
  if (achievements.includes(id)) return;

  achievements.push(id);
  saveData("wow_achievements", achievements);

  const item = achievementDefinitions.find(a => a.id === id);
  showToast("🏆 Yangi yutuq: " + (item?.title || id));
}

function checkAchievements() {
  if (discoveries >= 1) unlockAchievement("first_discovery");
  if (discoveries >= 5) unlockAchievement("five_discoveries");
  if (gamesPlayed >= 1) unlockAchievement("first_game");
  if (gamesPlayed >= 5) unlockAchievement("five_games");
  if (points >= 100) unlockAchievement("points_100");
}

function updateCabinet() {
  const name = avatar.name || "Mehmon";

  if ($("#cabinetName")) $("#cabinetName").textContent = name;
  if ($("#cabinetPoints")) $("#cabinetPoints").textContent = points;
  if ($("#cabinetAchievements")) $("#cabinetAchievements").textContent = achievements.length;
  if ($("#cabinetGames")) $("#cabinetGames").textContent = gamesPlayed;

  const level = Math.floor(points / 100) + 1;
  if ($("#cabinetLevel")) $("#cabinetLevel").textContent = "⭐ LEVEL " + level;

  const cabinetAvatar = $("#cabinetAvatar");
  if (cabinetAvatar) {
    if (avatarImage) {
      cabinetAvatar.innerHTML = "";
      const img = document.createElement("img");
      img.src = avatarImage;
      img.alt = "Avatar";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.borderRadius = "50%";
      cabinetAvatar.appendChild(img);
    } else {
      cabinetAvatar.textContent = avatar.face;
    }
  }
}

function updateAchievements() {
  $$(".achievement-card").forEach(card => {
    const id = card.dataset.achievement;
    const unlocked = achievements.includes(id);
    card.classList.toggle("unlocked", unlocked);

    const status = card.querySelector(".achievement-status");
    if (status) {
      status.textContent = unlocked ? "🏆 Ochilgan!" : "🔒 Hali ochilmagan";
    }
  });
}

function updateShop() {
  if ($("#shopBalance")) {
    $("#shopBalance").textContent = points + " ⭐";
  }

  $$(".shop-buy").forEach(button => {
    const id = button.dataset.item;
    const owned = ownedItems.includes(id);
    const card = button.closest(".shop-item");

    button.textContent = owned ? "✓ Sotib olingan" : "Sotib olish";
    button.disabled = owned;

    if (card) card.classList.toggle("owned", owned);

    const status = $("#shopStatus-" + id);
    if (status) status.textContent = owned ? "Sening kolleksiyangda ✓" : "";
  });
}

function updateAll() {
  checkAchievements();
  updateCabinet();
  updateAchievements();
  updateShop();
}

function recordGame() {
  gamesPlayed++;
  saveStats();
  checkAchievements();
  updateAll();
}

// ==========================================
// STAR BACKGROUND
// ==========================================

if (stars) {
  for (let i = 0; i < 90; i++) {
    const star = document.createElement("span");
    star.style.position = "absolute";
    star.style.width = Math.random() * 3 + 1 + "px";
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.background = "white";
    star.style.borderRadius = "50%";
    star.style.opacity = Math.random() * 0.7 + 0.2;
    star.style.boxShadow = "0 0 8px #9b5cff";
    stars.appendChild(star);
  }
}

// ==========================================
// NAVIGATION
// ==========================================

$("#menuBtn")?.addEventListener("click", () => {
  $("#nav")?.classList.toggle("active");
});

$$(".nav a").forEach(link => {
  link.addEventListener("click", () => $("#nav")?.classList.remove("active"));
});

$("#topBtn")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  const button = $("#topBtn");
  if (button) button.classList.toggle("show", window.scrollY > 400);
});

// ==========================================
// DISCOVERY
// ==========================================

const discoveriesList = [
  "Har bir katta sayohat kichik qadamdan boshlanadi! 🚀",
  "Bugun yangi narsani o‘rganish uchun ajoyib kun!",
  "Tasavvuring — sening eng kuchli vositang!",
  "Har bir xato yangi bilim uchun imkoniyat!",
  "Orzularing sari dadil harakat qil!",
  "Kichik g‘alabalar katta natijalarga olib boradi!"
];

function makeDiscovery() {
  const message = discoveriesList[Math.floor(Math.random() * discoveriesList.length)];
  if ($("#discoveryText")) $("#discoveryText").textContent = message;

  discoveries++;
  localStorage.setItem("wow_discoveries", discoveries);
  addPoints(5, "✨ Kashfiyot! +5 WOW ball");
  updateAll();
}

$("#discoverBtn")?.addEventListener("click", makeDiscovery);

$("#surpriseBtn")?.addEventListener("click", () => {
  makeDiscovery();
  $("#discover")?.scrollIntoView({ behavior: "smooth" });
});

// ==========================================
// DAILY REWARD
// ==========================================

function getToday() {
  const date = new Date();
  return date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0");
}

function updateDailyStatus() {
  const claimed = localStorage.getItem("wow_daily_date") === getToday();
  const button = $("#claimDaily");
  const status = $("#dailyStatus");

  if (button) {
    button.disabled = claimed;
    button.textContent = claimed ? "✓ BUGUN OLINGAN" : "MUKOFOTNI OLISH 🎁";
  }

  if (status) {
    status.textContent = claimed
      ? "🎉 Bugungi sovg‘angni olding. Ertaga yana kel!"
      : "Bugungi sovg‘ang hali olinmagan.";
  }
}

$("#claimDaily")?.addEventListener("click", () => {
  if (localStorage.getItem("wow_daily_date") === getToday()) {
    showToast("Bugungi mukofotingni olding!");
    return;
  }

  localStorage.setItem("wow_daily_date", getToday());
  addPoints(25, "🎁 Kunlik mukofot! +25 WOW ball");
  unlockAchievement("daily_one");
  updateDailyStatus();
});

// ==========================================
// MODAL
// ==========================================

function openModal(title, content) {
  if (!modal || !gameContent || !modalTitle) return;
  modalTitle.textContent = title;
  gameContent.innerHTML = content;
  modal.classList.add("active");
}

function closeModal() {
  modal?.classList.remove("active");
}

$("#modalClose")?.addEventListener("click", closeModal);

modal?.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

// ==========================================
// OLD GAME 1 — NUMBER
// ==========================================

function startNumberGame() {
  const secret = Math.floor(Math.random() * 20) + 1;
  let attempts = 0;

  openModal("🔢 Sirli raqam", `
    <p>1 dan 20 gacha bo‘lgan raqamni top!</p>
    <input id="numberGuess" type="number" min="1" max="20" placeholder="Raqam yoz...">
    <button class="btn primary" id="numberCheck">Tekshirish</button>
    <div id="numberResult" class="game-result">Omad!</div>
  `);

  $("#numberCheck").onclick = () => {
    const value = Number($("#numberGuess").value);
    if (!Number.isInteger(value) || value < 1 || value > 20) {
      $("#numberResult").textContent = "1 dan 20 gacha raqam yoz!";
      return;
    }

    attempts++;

    if (value === secret) {
      $("#numberResult").textContent = "🎉 To‘g‘ri! " + attempts + " urinishda topding. +20 ball!";
      addPoints(20);
      recordGame();
      $("#numberCheck").disabled = true;
    } else {
      $("#numberResult").textContent = value < secret ? "⬆️ Kattaroq raqam!" : "⬇️ Kichikroq raqam!";
    }
  };
}

// ==========================================
// OLD GAME 2 — REACTION
// ==========================================

let reactionTimer = null;
let reactionStart = 0;

function startReactionGame() {
  openModal("⚡ Tezkor reaksiya", `
    <p>Yashil tugma paydo bo‘lganda uni bos!</p>
    <button class="btn primary" id="reactionStart">Boshlash</button>
    <div id="reactionArea" class="game-result">Tayyor bo‘l!</div>
  `);

  $("#reactionStart").onclick = () => {
    clearTimeout(reactionTimer);
    $("#reactionStart").disabled = true;
    $("#reactionArea").textContent = "⏳ Kut...";
    reactionTimer = setTimeout(() => {
      reactionStart = performance.now();
      $("#reactionArea").innerHTML = '<button class="btn primary" id="reactionHit">BOS!</button>';
      $("#reactionHit").onclick = () => {
        const time = Math.round(performance.now() - reactionStart);
        $("#reactionArea").textContent = "⚡ " + time + " ms! +10 ball";
        addPoints(10);
        recordGame();
        $("#reactionStart").disabled = false;
      };
    }, 1200 + Math.random() * 2500);
  };
}

// ==========================================
// OLD GAME 3 — PUZZLE
// ==========================================

function startPuzzleGame() {
  openModal("🧩 Sirli jumboq", `
    <p>Qaysi narsa qancha ko‘p olinsa, shuncha kattalashadi?</p>
    <input id="puzzleAnswer" placeholder="Javobni yoz...">
    <button class="btn primary" id="puzzleCheck">Tekshirish</button>
    <div id="puzzleResult" class="game-result">Javobingni kutyapman!</div>
  `);

  $("#puzzleCheck").onclick = () => {
    const answer = $("#puzzleAnswer").value.trim().toLowerCase();
    if (["chuqur", "chuqurcha"].includes(answer)) {
      $("#puzzleResult").textContent = "🎉 To‘g‘ri! +15 ball";
      addPoints(15);
      recordGame();
      $("#puzzleCheck").disabled = true;
    } else {
      $("#puzzleResult").textContent = "Yana o‘ylab ko‘r!";
    }
  };
}

// ==========================================
// NEW GAME 1 — MEMORY
// ==========================================

function startMemoryGame() {
  const symbols = ["🚀", "🌟", "🎮", "💎", "🎨", "🦊", "👑", "⚡"];
  const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  let first = null;
  let locked = false;
  let matched = 0;

  openModal("🧠 Xotira sinovi", `
    <p>Bir xil belgilarni juftlab top!</p>
    <div class="memory-grid" id="memoryGrid">
      ${cards.map((_, i) => `<button class="memory-card" data-index="${i}">❔</button>`).join("")}
    </div>
    <div id="memoryResult" class="game-result">Topilgan juftlik: 0 / 8</div>
  `);

  const buttons = $$(".memory-card");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      if (locked || button.classList.contains("matched") || button === first) return;

      const index = Number(button.dataset.index);
      button.textContent = cards[index];

      if (!first) {
        first = button;
        return;
      }

      const firstIndex = Number(first.dataset.index);

      if (cards[firstIndex] === cards[index]) {
        first.classList.add("matched");
        button.classList.add("matched");
        first = null;
        matched++;

        $("#memoryResult").textContent = "Topilgan juftlik: " + matched + " / 8";

        if (matched === 8) {
          $("#memoryResult").textContent = "🏆 Ajoyib! Xotira sinovini tugatding! +30 ball";
          addPoints(30);
          recordGame();
        }
      } else {
        locked = true;
        const previous = first;
        first = null;

        setTimeout(() => {
          previous.textContent = "❔";
          button.textContent = "❔";
          locked = false;
        }, 750);
      }
    });
  });
}

// ==========================================
// NEW GAME 2 — MATH SPEED
// ==========================================

function startMathGame() {
  let score = 0;
  let question = 0;
  let answer = 0;

  openModal("➗ Matematik tezlik", `
    <p>5 ta misolni to‘g‘ri yech!</p>
    <h3 id="mathProgress">1 / 5</h3>
    <h2 id="mathQuestion"></h2>
    <input id="mathAnswer" type="number" placeholder="Javob...">
    <button class="btn primary" id="mathCheck">Tekshirish</button>
    <div id="mathResult" class="game-result">Omad!</div>
  `);

  function nextQuestion() {
    if (question >= 5) {
      $("#mathQuestion").textContent = "Tugadi!";
      $("#mathAnswer").style.display = "none";
      $("#mathCheck").style.display = "none";
      $("#mathResult").textContent = "🎉 Natija: " + score + " / 5. +"+ (score * 6) + " ball";
      if (score > 0) addPoints(score * 6);
      recordGame();
      return;
    }

    question++;
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const operation = Math.random() > 0.5 ? "+" : "×";

    answer = operation === "+" ? a + b : a * b;
    $("#mathProgress").textContent = question + " / 5";
    $("#mathQuestion").textContent = a + " " + operation + " " + b + " = ?";
    $("#mathAnswer").value = "";
    $("#mathAnswer").focus();
  }

  $("#mathCheck").onclick = () => {
    if (Number($("#mathAnswer").value) === answer) {
      score++;
      $("#mathResult").textContent = "✅ To‘g‘ri!";
    } else {
      $("#mathResult").textContent = "❌ To‘g‘ri javob: " + answer;
    }

    $("#mathCheck").disabled = true;
    setTimeout(() => {
      $("#mathCheck").disabled = false;
      nextQuestion();
    }, 650);
  };

  nextQuestion();
}

// ==========================================
// NEW GAME 3 — WORD GUESS
// ==========================================

function startWordGame() {
  const words = [
    { word: "KITOB", hint: "📚 Bilim manbai" },
    { word: "OLAM", hint: "🌍 Biz yashaydigan keng makon" },
    { word: "YULDUZ", hint: "⭐ Osmonda porlaydi" },
    { word: "ROBOT", hint: "🤖 Aqlli mexanik qurilma" },
    { word: "MAKTAB", hint: "🏫 Bilim oladigan joy" }
  ];

  const item = words[Math.floor(Math.random() * words.length)];
  const mixed = item.word.split("").sort(() => Math.random() - 0.5).join(" ");

  openModal("🔤 So‘z topish", `
    <p>Aralash harflardan to‘g‘ri so‘zni top!</p>
    <h2 class="game-result">${mixed}</h2>
    <p>${item.hint}</p>
    <input id="wordAnswer" placeholder="So‘zni yoz...">
    <button class="btn primary" id="wordCheck">Tekshirish</button>
    <div id="wordResult" class="game-result">Javobingni kutyapman!</div>
  `);

  $("#wordCheck").onclick = () => {
    const answer = $("#wordAnswer").value.trim().toUpperCase();

    if (answer === item.word) {
      $("#wordResult").textContent = "🎉 To‘g‘ri! +20 ball";
      addPoints(20);
      recordGame();
      $("#wordCheck").disabled = true;
    } else {
      $("#wordResult").textContent = "Yana urinib ko‘r!";
    }
  };
}

// ==========================================
// GAME BUTTONS
// ==========================================

$$(".game-open").forEach(button => {
  button.addEventListener("click", () => {
    const games = {
      number: startNumberGame,
      reaction: startReactionGame,
      puzzle: startPuzzleGame,
      memory: startMemoryGame,
      math: startMathGame,
      word: startWordGame
    };

    games[button.dataset.game]?.();
  });
});

// ==========================================
// WOW SHOP
// ==========================================

$$(".shop-buy").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.item;
    const price = Number(button.dataset.price);

    if (ownedItems.includes(id)) {
      showToast("Bu buyum allaqachon seniki!");
      return;
    }

    if (points < price) {
      showToast("😕 Ball yetarli emas! Yana o‘yin o‘yna.");
      return;
    }

    if (!confirm(price + " WOW ball evaziga sotib olasanmi?")) return;

    points -= price;
    ownedItems.push(id);
    saveData("wow_shop_owned", ownedItems);
    saveStats();
    updateAll();

    showToast("🎉 Xarid muvaffaqiyatli! Buyum kolleksiyangda.");
  });
});

// ==========================================
// AVATAR STUDIO
// ==========================================

let selectedFace = avatar.face || "🧑‍🚀";
let selectedColor = avatar.color || "#8b5cff";
let selectedColorName = avatar.colorName || "Binafsha";

function renderAvatarPreview() {
  if ($("#avatarFace")) $("#avatarFace").textContent = selectedFace;
  if ($("#avatarPreview")) {
    $("#avatarPreview").style.background = selectedColor;
    $("#avatarPreview").style.borderColor = selectedColor;
  }

  if ($("#avatarPreviewColor")) {
    $("#avatarPreviewColor").textContent = selectedColorName + " rang";
  }

  const name = $("#avatarName")?.value.trim() || avatar.name || "Yangi qahramon";
  if ($("#avatarPreviewName")) $("#avatarPreviewName").textContent = name;

  if (avatarImage) {
    $("#avatarPreview").innerHTML = "";
    const img = document.createElement("img");
    img.src = avatarImage;
    img.alt = "Avatar rasmi";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "50%";
    $("#avatarPreview").appendChild(img);
  } else if ($("#avatarPreview") && !$("#avatarFace")) {
    $("#avatarPreview").textContent = selectedFace;
  }
}

function selectAvatar(button, clearImage = true) {
  selectedFace = button.dataset.avatar;
  $$(".avatar-option").forEach(item => item.classList.remove("selected"));
  button.classList.add("selected");

  if (clearImage) {
    avatarImage = "";
    localStorage.removeItem("wow_avatar_image");
    if ($("#avatarUploadStatus")) $("#avatarUploadStatus").textContent = "Hozircha rasm tanlanmagan";
  }

  renderAvatarPreview();
}

$$(".avatar-option").forEach(button => {
  button.addEventListener("click", () => selectAvatar(button));
});

$$(".color-option").forEach(button => {
  button.addEventListener("click", () => {
    selectedColor = button.dataset.color;
    selectedColorName = button.dataset.name;

    $$(".color-option").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");

    renderAvatarPreview();
  });
});

$("#avatarName")?.addEventListener("input", renderAvatarPreview);

$("#randomAvatar")?.addEventListener("click", () => {
  const faces = $$(".avatar-option");
  const colors = $$(".color-option");

  selectAvatar(faces[Math.floor(Math.random() * faces.length)]);
  colors[Math.floor(Math.random() * colors.length)].click();

  showToast("🎲 Tasodifiy avatar tayyor!");
});

$("#avatarImageInput")?.addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Faqat rasm faylini tanla.");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showToast("Rasm hajmi 2 MB dan kichik bo‘lsin.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    avatarImage = reader.result;
    localStorage.setItem("wow_avatar_image", avatarImage);

    if ($("#avatarUploadStatus")) {
      $("#avatarUploadStatus").textContent = "✅ Rasm tanlandi";
    }

    renderAvatarPreview();
  };

  reader.readAsDataURL(file);
});

$("#removeAvatarImage")?.addEventListener("click", () => {
  avatarImage = "";
  localStorage.removeItem("wow_avatar_image");

  if ($("#avatarImageInput")) $("#avatarImageInput").value = "";
  if ($("#avatarUploadStatus")) {
    $("#avatarUploadStatus").textContent = "Hozircha rasm tanlanmagan";
  }

  renderAvatarPreview();
  showToast("Rasm olib tashlandi.");
});

$("#saveAvatar")?.addEventListener("click", () => {
  const name = $("#avatarName")?.value.trim() || "Yangi qahramon";

  avatar = {
    face: selectedFace,
    name,
    color: selectedColor,
    colorName: selectedColorName
  };

  saveData("wow_my_avatar", avatar);
  renderAvatarPreview();

  if ($("#avatarStatus")) $("#avatarStatus").textContent = "✅ Avatar muvaffaqiyatli saqlandi!";
  if ($("#cabinetStatus")) $("#cabinetStatus").textContent = "Qahramoning muvaffaqiyatli saqlandi!";

  updateCabinet();
  showToast("🎨 Avatar saqlandi!");
});

// Restore saved avatar
if ($("#avatarName")) $("#avatarName").value = avatar.name || "";

const savedFaceButton = $$(".avatar-option").find(button => button.dataset.avatar === selectedFace);
if (savedFaceButton) {
  $$(".avatar-option").forEach(button => button.classList.remove("selected"));
  savedFaceButton.classList.add("selected");
}

const savedColorButton = $$(".color-option").find(button => button.dataset.color === selectedColor);
if (savedColorButton) {
  $$(".color-option").forEach(button => button.classList.remove("selected"));
  savedColorButton.classList.add("selected");
}

if (avatarImage && $("#avatarUploadStatus")) {
  $("#avatarUploadStatus").textContent = "✅ Saqlangan rasm yuklandi";
}

renderAvatarPreview();

$("#editCabinet")?.addEventListener("click", () => {
  const newName = prompt("Yangi profiling nomini yoz:", avatar.name);

  if (newName === null) return;

  if (!newName.trim()) {
    showToast("Ism bo‘sh bo‘lmasin.");
    return;
  }

  avatar.name = newName.trim().slice(0, 20);
  saveData("wow_my_avatar", avatar);

  if ($("#avatarName")) $("#avatarName").value = avatar.name;
  renderAvatarPreview();
  updateCabinet();
  showToast("Profil yangilandi!");
});

$("#cabinetAvatarBtn")?.addEventListener("click", () => {
  $("#avatar")?.scrollIntoView({ behavior: "smooth" });
});

// ==========================================
// CHAT ASSISTANT
// ==========================================

function addChatMessage(message, type) {
  const box = $("#chatMessages");
  if (!box) return;

  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = message;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function getChatReply(message) {
  const text = message.toLowerCase();

  if (text.includes("salom")) return "Salom! WOW olamiga xush kelibsan! 😊";
  if (text.includes("isming")) return "Men WOW yordamchisiman! 🤖";
  if (text.includes("ball")) return "Ballarni o‘yinlar, kashfiyotlar va kunlik mukofotlardan olishing mumkin! ⭐";
  if (text.includes("o‘yin") || text.includes("oyin")) return "O‘yinlar bo‘limida 6 ta qiziqarli o‘yin seni kutmoqda! 🎮";
  if (text.includes("avatar")) return "Avatar Studio orqali o‘z qahramoningni yarat! 🎨";
  if (text.includes("rahmat")) return "Arzimaydi! Yana yordam kerak bo‘lsa, yoz! 💜";
  if (text.includes("do‘kon") || text.includes("dokon")) return "WOW do‘konida ballaringga virtual bezaklar sotib olishing mumkin! 💎";

  return "Qiziqarli savol! Men hozircha oddiy yordamchiman. WOW EXPERIENCE bo‘limlarini sinab ko‘r! ✨";
}

$("#chatForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const input = $("#chatInput");
  const message = input.value.trim();

  if (!message) return;

  addChatMessage(message, "user-message");
  input.value = "";

  setTimeout(() => {
    addChatMessage(getChatReply(message), "bot-message");
  }, 350);
});

// ==========================================
// INITIAL UPDATE
// ==========================================

updateDailyStatus();
updateAll();

console.log("WOW EXPERIENCE muvaffaqiyatli ishga tushdi! 🚀");

// Telegram init
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const subhintEl = document.getElementById("subhint");
const footerEl = document.getElementById("footerhint");

const restartBtn = document.getElementById("restart");
const pauseBtn = document.getElementById("pause");

const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const startGameBtn = document.getElementById("startGame");
const closeMenuBtn = document.getElementById("closeMenu");
const resetBestBtn = document.getElementById("resetBest");

const difficultySel = document.getElementById("difficulty");
const wallsSel = document.getElementById("walls");
const soundToggleBtn = document.getElementById("soundToggle");
const hapticToggleBtn = document.getElementById("hapticToggle");

const upBtn = document.getElementById("up");
const downBtn = document.getElementById("down");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");

// anti scroll
canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

/* ---------- SETTINGS / STORAGE ---------- */
const KEY = "snake_mini_settings_v1";

const defaultSettings = {
  difficulty: "normal",
  walls: "solid", // solid | wrap
  sound: true,
  haptic: true,
  best: 0,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings() {
  localStorage.setItem(KEY, JSON.stringify(settings));
}

let settings = loadSettings();

difficultySel.value = settings.difficulty;
wallsSel.value = settings.walls;
bestEl.textContent = `Рекорд: ${settings.best}`;

function updateToggleTexts() {
  soundToggleBtn.textContent = settings.sound ? "🔊 Звук: ВКЛ" : "🔇 Звук: ВЫКЛ";
  hapticToggleBtn.textContent = settings.haptic ? "📳 Вибро: ВКЛ" : "📴 Вибро: ВЫКЛ";
}
updateToggleTexts();

/* ---------- SOUND / HAPTIC ---------- */
let audioCtx = null;

function beep(freq = 880, ms = 55, gainVal = 0.06) {
  if (!settings.sound) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.value = gainVal;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    setTimeout(() => { o.stop(); }, ms);
  } catch {}
}

function haptic(type = "light") {
  if (!settings.haptic) return;
  try { tg?.HapticFeedback?.impactOccurred?.(type); } catch {}
}

/* ---------- GAME ---------- */
const GRID = 16;
const CELL = canvas.width / GRID;

let tickMs = 120;
let snake, dir, food, score, alive, timer, paused = false;
let gameStarted = false;

function same(a, b) { return a.x === b.x && a.y === b.y; }
function randCell() { return { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }; }
function spawnFood() {
  while (true) {
    const f = randCell();
    if (!snake.some(s => same(s, f))) return f;
  }
}

function difficultyToTick(d) {
  if (d === "easy") return 145;
  if (d === "normal") return 120;
  if (d === "hard") return 95;
  return 75; // insane
}

function setDir(nx, ny) {
  if (!alive || paused) return;
  if (snake.length > 1 && nx === -dir.x && ny === -dir.y) return;
  dir = { x: nx, y: ny };
}

function startLoop() {
  if (timer) clearInterval(timer);
  timer = setInterval(tick, tickMs);
}

function applySettingsToGame() {
  tickMs = difficultyToTick(settings.difficulty);
}

function resetGameState() {
  snake = [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }];
  dir = { x: 1, y: 0 };
  food = spawnFood();
  score = 0;
  alive = true;
  paused = false;
  scoreEl.textContent = `Счёт: ${score}`;
  pauseBtn.textContent = "⏸ Пауза";
}

function startGame() {
  applySettingsToGame();
  resetGameState();
  startLoop();
  gameStarted = true;
  subhintEl.textContent = settings.walls === "wrap" ? "Режим: сквозь стены" : "Режим: стены (классика)";
  footerEl.textContent = `Сложность: ${difficultySel.options[difficultySel.selectedIndex].text}`;
  draw();
}

function togglePause(forceState = null) {
  if (!alive || !gameStarted) return;
  paused = forceState === null ? !paused : !!forceState;

  if (paused) {
    if (timer) clearInterval(timer);
    pauseBtn.textContent = "▶ Продолжить";
    draw(false, true);
  } else {
    pauseBtn.textContent = "⏸ Пауза";
    startLoop();
  }
}

function wrapCoord(v) {
  if (v < 0) return GRID - 1;
  if (v >= GRID) return 0;
  return v;
}

function gameOver() {
  alive = false;
  if (timer) clearInterval(timer);

  if (score > settings.best) {
    settings.best = score;
    saveSettings();
    bestEl.textContent = `Рекорд: ${settings.best}`;
    beep(1200, 90, 0.08);
    haptic("medium");
  } else {
    beep(220, 120, 0.06);
    haptic("heavy");
  }

  draw(true, false);

  tg?.showPopup?.({
    title: "GAME OVER",
    message: `Счёт: ${score}${score === settings.best ? " (новый рекорд!)" : ""}`,
    buttons: [{ type: "ok" }]
  });
}

function tick() {
  if (!alive || paused) return;

  const head = snake[0];
  let next = { x: head.x + dir.x, y: head.y + dir.y };

  if (settings.walls === "wrap") {
    next = { x: wrapCoord(next.x), y: wrapCoord(next.y) };
  } else {
    if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) return gameOver();
  }

  if (snake.some((s, i) => i !== 0 && same(s, next))) return gameOver();

  snake.unshift(next);

  if (same(next, food)) {
    score += 1;
    scoreEl.textContent = `Счёт: ${score}`;
    haptic("light");
    beep(880, 40, 0.05);
    food = spawnFood();

    // микро-ускорение каждые 7 очков (не до бесконечности)
    if (score % 7 === 0 && tickMs > 55) {
      tickMs -= 5;
      startLoop();
      haptic("light");
      beep(980, 45, 0.05);
    }
  } else {
    snake.pop();
  }

  draw();
}

/* ---------- RENDER (funny snake) ---------- */
function drawGrid() {
  ctx.globalAlpha = 0.10;
  ctx.strokeStyle = "#ffffff";
  for (let i = 1; i < GRID; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(canvas.width, i * CELL); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawFoodApple(f) {
  const cx = f.x * CELL + CELL / 2;
  const cy = f.y * CELL + CELL / 2;

  ctx.fillStyle = "#ff4d4d";
  ctx.beginPath();
  ctx.arc(cx, cy, CELL * 0.34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffd1d1";
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.arc(cx - CELL * 0.10, cy - CELL * 0.10, CELL * 0.10, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#4ade80";
  ctx.beginPath();
  ctx.ellipse(cx + CELL * 0.10, cy - CELL * 0.32, CELL * 0.16, CELL * 0.10, -0.6, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawSnake() {
  // тело
  snake.forEach((s, i) => {
    const pad = 1.5;
    const x = s.x * CELL + pad;
    const y = s.y * CELL + pad;
    const w = CELL - pad * 2;
    const h = CELL - pad * 2;

    const t = i / Math.max(1, snake.length - 1);
    const r = Math.round(60 + 40 * t);
    const g = Math.round(255 - 70 * t);
    const b = Math.round(140 + 115 * t);
    ctx.fillStyle = `rgb(${r},${g},${b})`;

    roundRect(ctx, x, y, w, h, 7);
    ctx.fill();
  });

  // голова + глаза
  const head = snake[0];
  const hx = head.x * CELL;
  const hy = head.y * CELL;
  const cx = hx + CELL / 2;
  const cy = hy + CELL / 2;

  const ex = dir.x * CELL * 0.12;
  const ey = dir.y * CELL * 0.12;

  ctx.fillStyle = "#0b0f19";
  ctx.beginPath();
  ctx.arc(cx - CELL * 0.12 + ey, cy - CELL * 0.10 - ex, CELL * 0.06, 0, Math.PI * 2);
  ctx.arc(cx + CELL * 0.12 + ey, cy - CELL * 0.10 - ex, CELL * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // зрачки (в сторону движения)
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx - CELL * 0.12 + ey + dir.x * CELL * 0.03, cy - CELL * 0.10 - ex + dir.y * CELL * 0.03, CELL * 0.025, 0, Math.PI * 2);
  ctx.arc(cx + CELL * 0.12 + ey + dir.x * CELL * 0.03, cy - CELL * 0.10 - ex + dir.y * CELL * 0.03, CELL * 0.025, 0, Math.PI * 2);
  ctx.fill();

  // язычок
  ctx.strokeStyle = "#ff4d4d";
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx + dir.x * CELL * 0.18, cy + dir.y * CELL * 0.18);
  ctx.lineTo(cx + dir.x * CELL * 0.36, cy + dir.y * CELL * 0.36);
  ctx.stroke();
}

function drawOverlayText(text) {
  ctx.fillStyle = "#000a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "22px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function draw(isGameOver = false, isPaused = false) {
  // фон
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "#0b1328");
  grad.addColorStop(1, "#070a12");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawFoodApple(food);
  drawSnake();

  if (!gameStarted) drawOverlayText("НАЖМИ ⚙️ и СТАРТ");
  if (isPaused) drawOverlayText("PAUSED");
  if (isGameOver) drawOverlayText("GAME OVER");
}

/* ---------- INPUT ---------- */
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") setDir(0, -1);
  if (e.key === "ArrowDown") setDir(0, 1);
  if (e.key === "ArrowLeft") setDir(-1, 0);
  if (e.key === "ArrowRight") setDir(1, 0);
  if (e.key.toLowerCase() === "p") togglePause();
});

let touchStart = null;
canvas.addEventListener("touchstart", (e) => {
  const t = e.changedTouches[0];
  touchStart = { x: t.clientX, y: t.clientY };
}, { passive: true });

canvas.addEventListener("touchend", (e) => {
  if (!touchStart) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStart.x;
  const dy = t.clientY - touchStart.y;
  touchStart = null;

  if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
  if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0);
  else setDir(0, dy > 0 ? 1 : -1);
}, { passive: true });

function bindDirButton(btn, x, y) {
  btn.addEventListener("click", () => setDir(x, y));
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    setDir(x, y);
  }, { passive: false });
}
bindDirButton(upBtn, 0, -1);
bindDirButton(downBtn, 0, 1);
bindDirButton(leftBtn, -1, 0);
bindDirButton(rightBtn, 1, 0);

/* ---------- UI EVENTS ---------- */
function openMenu() {
  overlay.hidden = false;
  // на всякий — пауза
  if (gameStarted && alive) togglePause(true);
}
function closeMenu() {
  overlay.hidden = true;
}

menuBtn.addEventListener("click", openMenu);
closeMenuBtn.addEventListener("click", closeMenu);

startGameBtn.addEventListener("click", () => {
  settings.difficulty = difficultySel.value;
  settings.walls = wallsSel.value;
  saveSettings();
  closeMenu();
  startGame();
});

difficultySel.addEventListener("change", () => {
  settings.difficulty = difficultySel.value;
  saveSettings();
});
wallsSel.addEventListener("change", () => {
  settings.walls = wallsSel.value;
  saveSettings();
});

soundToggleBtn.addEventListener("click", () => {
  settings.sound = !settings.sound;
  updateToggleTexts();
  saveSettings();
  beep(settings.sound ? 660 : 220, 60, 0.06);
});

hapticToggleBtn.addEventListener("click", () => {
  settings.haptic = !settings.haptic;
  updateToggleTexts();
  saveSettings();
  haptic("light");
});

resetBestBtn.addEventListener("click", () => {
  settings.best = 0;
  saveSettings();
  bestEl.textContent = `Рекорд: ${settings.best}`;
  haptic("light");
  beep(440, 60, 0.06);
});

restartBtn.addEventListener("click", () => {
  if (!gameStarted) openMenu();
  else startGame();
});

pauseBtn.addEventListener("click", () => togglePause());

document.addEventListener("visibilitychange", () => {
  if (document.hidden) togglePause(true);
});

// стартовый экран
bestEl.textContent = `Рекорд: ${settings.best}`;
draw();
openMenu(); // сразу показываем меню при первом запуске

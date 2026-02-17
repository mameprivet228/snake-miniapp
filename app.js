// Telegram init
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart");
const pauseBtn = document.getElementById("pause");

// чтобы свайпы не превращались в скролл
canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

const GRID = 16;
const CELL = canvas.width / GRID;

let baseTickMs = 120;
let tickMs = baseTickMs;

let snake, dir, food, score, alive, timer, paused = false;

function same(a, b) { return a.x === b.x && a.y === b.y; }
function randCell() {
  return { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
}
function spawnFood() {
  while (true) {
    const f = randCell();
    if (!snake.some(s => same(s, f))) return f;
  }
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

function reset() {
  snake = [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }];
  dir = { x: 1, y: 0 };
  food = spawnFood();
  score = 0;
  alive = true;

  paused = false;
  pauseBtn.textContent = "⏸ Пауза";

  baseTickMs = 120;
  tickMs = baseTickMs;

  scoreEl.textContent = `Счёт: ${score}`;
  startLoop();
  draw();
}

function togglePause(forceState = null) {
  if (!alive) return;

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

function gameOver() {
  alive = false;
  if (timer) clearInterval(timer);
  draw(true, false);

  if (tg) {
    tg.showPopup({
      title: "Игра окончена",
      message: `Счёт: ${score}`,
      buttons: [{ type: "ok" }]
    });
  }
}

function tick() {
  if (!alive || paused) return;

  const head = snake[0];
  const next = { x: head.x + dir.x, y: head.y + dir.y };

  if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) return gameOver();
  if (snake.some((s, i) => i !== 0 && same(s, next))) return gameOver();

  snake.unshift(next);

  if (same(next, food)) {
    score += 1;
    scoreEl.textContent = `Счёт: ${score}`;
    food = spawnFood();

    // ускорение каждые 5 очков
    if (score % 5 === 0 && tickMs > 60) {
      tickMs -= 8;
      startLoop();
    }
  } else {
    snake.pop();
  }

  draw();
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

function drawCell(x, y, color) {
  const pad = 1.5;
  const r = 6;
  const px = x * CELL + pad;
  const py = y * CELL + pad;
  const w = CELL - pad * 2;
  const h = CELL - pad * 2;

  ctx.fillStyle = color;
  roundRect(ctx, px, py, w, h, r);
  ctx.fill();
}

function draw(isGameOver = false, isPaused = false) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // сетка
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#fff";
  for (let i = 1; i < GRID; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(canvas.width, i * CELL); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  drawCell(food.x, food.y, "#ff4d4d");
  snake.forEach((s, i) => drawCell(s.x, s.y, i === 0 ? "#7CFF6B" : "#38bdf8"));

  if (isGameOver || isPaused) {
    ctx.fillStyle = "#000a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(isGameOver ? "GAME OVER" : "PAUSED", canvas.width / 2, canvas.height / 2);
  }
}

// клавиатура
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") setDir(0, -1);
  if (e.key === "ArrowDown") setDir(0, 1);
  if (e.key === "ArrowLeft") setDir(-1, 0);
  if (e.key === "ArrowRight") setDir(1, 0);

  if (e.key.toLowerCase() === "p") togglePause();
});

// свайпы
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

// кнопки поверх
const upBtn = document.getElementById("up");
const downBtn = document.getElementById("down");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");

function bindDirButton(btn, x, y) {
  if (!btn) return;

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

// кнопки сверху
restartBtn.addEventListener("click", reset);
pauseBtn.addEventListener("click", () => togglePause());

// авто-пауза при сворачивании
document.addEventListener("visibilitychange", () => {
  if (document.hidden) togglePause(true);
});

// если Mini App свернули средствами Telegram
tg?.onEvent?.("viewportChanged", () => { /* можно расширять при желании */ });

reset();

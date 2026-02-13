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

const GRID = 16;                 // 16x16 клеток
const CELL = canvas.width / GRID;
let tickMs = 120;

let snake, dir, food, score, alive, timer;

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
  // запрет разворота на 180°
  if (snake.length > 1 && nx === -dir.x && ny === -dir.y) return;
  dir = { x: nx, y: ny };
}

function reset() {
  snake = [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }];
  dir = { x: 1, y: 0 };
  food = spawnFood();
  score = 0;
  alive = true;
  tickMs = 120;
  scoreEl.textContent = `Счёт: ${score}`;

  if (timer) clearInterval(timer);
  timer = setInterval(tick, tickMs);
  draw();
}

function gameOver() {
  alive = false;
  if (timer) clearInterval(timer);
  draw(true);

  if (tg) {
    tg.showPopup({
      title: "Игра окончена",
      message: `Счёт: ${score}`,
      buttons: [{ type: "ok" }]
    });
  }
}

function tick() {
  if (!alive) return;

  const head = snake[0];
  const next = { x: head.x + dir.x, y: head.y + dir.y };

  // столкновение со стеной
  if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) {
    return gameOver();
  }

  // столкновение с собой
  if (snake.some((s, i) => i !== 0 && same(s, next))) {
    return gameOver();
  }

  snake.unshift(next);

  if (same(next, food)) {
    score += 1;
    scoreEl.textContent = `Счёт: ${score}`;
    food = spawnFood();

    // чуть ускоряемся
    if (score % 5 === 0 && tickMs > 60) {
      tickMs -= 8;
      clearInterval(timer);
      timer = setInterval(tick, tickMs);
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

function draw(isGameOver = false) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // лёгкая сетка
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#fff";
  for (let i = 1; i < GRID; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(canvas.width, i * CELL); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // еда
  drawCell(food.x, food.y, "#ff4d4d");

  // змея
  snake.forEach((s, i) => drawCell(s.x, s.y, i === 0 ? "#7CFF6B" : "#38bdf8"));

  if (isGameOver) {
    ctx.fillStyle = "#000a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }
}

// Управление стрелками (ПК)
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") setDir(0, -1);
  if (e.key === "ArrowDown") setDir(0, 1);
  if (e.key === "ArrowLeft") setDir(-1, 0);
  if (e.key === "ArrowRight") setDir(1, 0);
});

// Управление свайпами (мобилка/Telegram)
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

restartBtn.addEventListener("click", reset);

reset();

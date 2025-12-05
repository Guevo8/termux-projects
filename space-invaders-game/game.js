"use strict";

// === DOM References & State =====================================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const statusEl = document.getElementById("status");

// === Input State ================================================
const keys = { left: false, right: false, shoot: false };

// --- Keyboard Input ---------------------------------------------
window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") keys.left = true;
  if (e.code === "ArrowRight") keys.right = true;
  if (e.code === "Space") {
    e.preventDefault();
    keys.shoot = true;
  }
  if (e.code === "KeyR" || e.code === "Enter") {
    if (game.gameOver) {
      game.reset();
      game.start();
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") keys.left = false;
  if (e.code === "ArrowRight") keys.right = false;
  if (e.code === "Space") keys.shoot = false;
});

// --- Touch / Button Input ---------------------------------------
function bindButton(id, onDown, onUp) {
  const el = document.getElementById(id);
  if (!el) return;

  const start = (ev) => {
    ev.preventDefault();
    onDown();
  };
  const end = (ev) => {
    ev.preventDefault();
    onUp();
  };

  ["mousedown", "touchstart", "pointerdown"].forEach((t) =>
    el.addEventListener(t, start, { passive: false })
  );
  ["mouseup", "mouseleave", "touchend", "touchcancel", "pointerup", "pointercancel"].forEach((t) =>
    el.addEventListener(t, end, { passive: false })
  );
}

function setupTouchControls() {
  bindButton("btn-left", () => (keys.left = true), () => (keys.left = false));
  bindButton("btn-right", () => (keys.right = true), () => (keys.right = false));
  bindButton("btn-fire", () => (keys.shoot = true), () => (keys.shoot = false));

  // Neustart-Button (Mobile & Desktop)
  bindButton(
    "btn-restart",
    () => {
      if (game) {
        game.reset();
        game.start();
      }
    },
    () => {}
  );
}

// === Utility =====================================================
function aabb(a, b) {
  return !(
    a.x + a.w < b.x ||
    a.x > b.x + b.w ||
    a.y + a.h < b.y ||
    a.y > b.y + b.h
  );
}

// === Entities ====================================================
class Player {
  constructor() {
    this.w = 40;
    this.h = 18;
    this.x = (canvas.width - this.w) / 2;
    this.y = canvas.height - this.h - 16;
    this.speed = 280;
    this.cooldown = 0;
  }

  update(dt, projectiles) {
    if (keys.left) this.x -= this.speed * dt;
    if (keys.right) this.x += this.speed * dt;
    this.x = Math.max(0, Math.min(canvas.width - this.w, this.x));

    if (this.cooldown > 0) this.cooldown -= dt;
    if (keys.shoot && this.cooldown <= 0) {
      projectiles.push(
        new Projectile(this.x + this.w / 2 - 2, this.y - 10, -320, "player")
      );
      this.cooldown = 0.3;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fillRect(this.x + this.w / 2 - 4, this.y - 8, 8, 8);
  }

  get bounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

class Projectile {
  constructor(x, y, vy, owner) {
    this.x = x;
    this.y = y;
    this.w = 4;
    this.h = 10;
    this.vy = vy;
    this.owner = owner;
    this.active = true;
  }

  update(dt) {
    this.y += this.vy * dt;
    if (this.y < -20 || this.y > canvas.height + 20) this.active = false;
  }

  draw(ctx) {
    ctx.fillStyle = this.owner === "player" ? "#facc15" : "#f97316";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  get bounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

class Invader {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 28;
    this.h = 20;
    this.alive = true;
  }

  draw(ctx) {
    if (!this.alive) return;
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "#022c22";
    ctx.fillRect(this.x + 4, this.y + 6, 4, 4);
    ctx.fillRect(this.x + this.w - 8, this.y + 6, 4, 4);
  }

  get bounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

class InvaderGrid {
  constructor() {
    this.rows = 4;
    this.cols = 8;
    this.marginX = 40;
    this.marginY = 40;
    this.spacingX = 50;
    this.spacingY = 32;
    this.speed = 40;
    this.direction = 1;
    this.dropY = 18;
    this.invaders = [];
    this.createInvaders();
  }

  createInvaders() {
    this.invaders = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.marginX + c * this.spacingX;
        const y = this.marginY + r * this.spacingY;
        this.invaders.push(new Invader(x, y));
      }
    }
  }

  get aliveInvaders() {
    return this.invaders.filter((i) => i.alive);
  }

  update(dt, projectiles, game) {
    const alive = this.aliveInvaders;
    if (!alive.length) return;

    let minX = Infinity;
    let maxX = -Infinity;
    for (const inv of alive) {
      minX = Math.min(minX, inv.x);
      maxX = Math.max(maxX, inv.x + inv.w);
    }

    const moveX = this.speed * this.direction * dt;
    for (const inv of alive) {
      inv.x += moveX;
    }

    if (minX <= 10 && this.direction === -1) {
      this.direction = 1;
      this.speed *= 1.05;
      for (const inv of alive) inv.y += this.dropY;
    } else if (maxX >= canvas.width - 10 && this.direction === 1) {
      this.direction = -1;
      this.speed *= 1.05;
      for (const inv of alive) inv.y += this.dropY;
    }

    for (const inv of alive) {
      if (inv.y + inv.h >= game.player.y) {
        game.lose("Die Invasoren haben die Erde erreicht!");
      }
    }

    const shootChance = 0.02;
    if (Math.random() < shootChance && alive.length) {
      const shooter = alive[Math.floor(Math.random() * alive.length)];
      projectiles.push(
        new Projectile(
          shooter.x + shooter.w / 2 - 2,
          shooter.y + shooter.h + 4,
          200,
          "invader"
        )
      );
    }
  }

  draw(ctx) {
    for (const inv of this.invaders) inv.draw(ctx);
  }
}

// === Game Core ===================================================
class Game {
  constructor() {
    this.player = new Player();
    this.grid = new InvaderGrid();
    this.projectiles = [];
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.lastTime = 0;
    this.running = false;
    this.updateHUD();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  reset() {
    this.player = new Player();
    this.grid = new InvaderGrid();
    this.projectiles = [];
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    statusEl.textContent = "";
    this.updateHUD();
    // optional: direkt initial zeichnen, damit Screen nicht leer ist
    this.draw();
  }

  win(msg) {
    if (this.gameOver) return;
    this.gameOver = true;
    statusEl.textContent = msg + " – Neustart: Button 🔄 oder Taste R.";
  }

  lose(msg) {
    if (this.gameOver) return;
    this.gameOver = true;
    statusEl.textContent = msg + " – Neustart: Button 🔄 oder Taste R.";
  }

  updateHUD() {
    scoreEl.textContent = this.score;
    livesEl.textContent = this.lives;
  }

  loop(timestamp) {
    if (!this.running) return;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.033);
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  }

  update(dt) {
    if (this.gameOver) return;

    this.player.update(dt, this.projectiles);
    this.grid.update(dt, this.projectiles, this);

    for (const p of this.projectiles) p.update(dt);
    this.projectiles = this.projectiles.filter((p) => p.active);

    for (const p of this.projectiles) {
      if (p.owner !== "player") continue;
      for (const inv of this.grid.invaders) {
        if (!inv.alive) continue;
        if (aabb(p.bounds, inv.bounds)) {
          inv.alive = false;
          p.active = false;
          this.score += 100;
          this.updateHUD();
          break;
        }
      }
    }

    for (const p of this.projectiles) {
      if (p.owner !== "invader") continue;
      if (aabb(p.bounds, this.player.bounds)) {
        p.active = false;
        this.lives -= 1;
        this.updateHUD();
        if (this.lives <= 0) {
          this.lose("Dein Schiff wurde zerstört.");
        }
      }
    }

    this.projectiles = this.projectiles.filter((p) => p.active);

    if (!this.grid.aliveInvaders.length) {
      this.win("Alle Invasoren sind besiegt!");
    }
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.player.draw(ctx);
    this.grid.draw(ctx);
    for (const p of this.projectiles) p.draw(ctx);

    if (this.gameOver) {
      ctx.fillStyle = "rgba(15,23,42,0.75)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#e5e7eb";
      ctx.textAlign = "center";
      ctx.font = "bold 24px system-ui";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "14px system-ui";
      ctx.fillText("Neustart: Button 🔄 oder Taste R", canvas.width / 2, canvas.height / 2 + 14);
    }
  }
}

// === Bootstrapping ===============================================
const game = new Game();
setupTouchControls();

// einmal initial zeichnen, damit direkt etwas sichtbar ist
game.draw();

canvas.addEventListener("click", () => {
  canvas.focus();
  game.start();
});

window.addEventListener("keydown", () => {
  game.start();
});

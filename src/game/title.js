/* ============================================================
   title.js - ecrã inicial + cartão do herói
   ============================================================ */
import { ctx, view, clear } from '../engine/screen.js';
import { CHARS, JAJO } from '../data/sprites.js';
import { draw as blit, silhouette } from '../engine/sprites.js';
import { register, go } from '../engine/scene.js';
import { initAudio, playMusic, sfx } from '../engine/audio.js';
import { fx } from '../engine/fx.js';
import { consume } from '../engine/input.js';
import { resetState } from './state.js';
import { showHud, refreshHud } from './ui.js';

const elTitle = document.getElementById('title');
const elCard = document.getElementById('herocard');
const btnStart = document.getElementById('btn-start');

let t = 0, stars = [], walker = 0, cardOpen = false;

function makeStars() {
  stars = [];
  for (let i = 0; i < 26; i++) {
    stars.push({
      x: Math.random() * view.w,
      y: Math.random() * view.h * 0.8,
      s: Math.random() < 0.3 ? 2 : 1,
      p: Math.random() * 6
    });
  }
}

const JAJO_GHOST = silhouette(JAJO, '#4a3f8f');

function startGame() {
  initAudio();
  playMusic('aldeia');
  sfx('confirm');
  resetState();
  elTitle.classList.add('hidden');
  showCard();
}

function showCard() {
  cardOpen = true;
  elCard.classList.remove('hidden');
  const c = document.getElementById('card-sprite');
  const cx = c.getContext('2d');
  cx.imageSmoothingEnabled = false;
  cx.clearRect(0, 0, 16, 16);
  cx.drawImage(CHARS.bernardo.down[0], 0, 0);
}

function closeCard() {
  if (!cardOpen) return;
  cardOpen = false;
  elCard.classList.add('hidden');
  sfx('confirm');
  refreshHud();
  fx.transition(() => go('world', { map: 'aldeia', x: 10, y: 12, dir: 'up' }), { dur: 0.35, hold: 0.1 });
}

btnStart.addEventListener('click', e => { e.preventDefault(); startGame(); });
elCard.addEventListener('pointerdown', e => { e.preventDefault(); closeCard(); });

register('title', {
  enter() {
    t = 0; walker = -20; cardOpen = false;
    makeStars();
    showHud(false);
    elTitle.classList.remove('hidden');
    elCard.classList.add('hidden');
    document.getElementById('battle').classList.add('hidden');
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('ending').classList.add('hidden');
  },
  update(dt) {
    t += dt;
    walker += dt * 22;
    if (walker > view.w + 20) walker = -20;
    if (cardOpen && consume('a')) closeCard();
    else consume('a');
  },
  draw() {
    clear('#0f0d24');
    // estrelas
    for (const s of stars) {
      const a = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.5 + s.p));
      ctx.globalAlpha = a;
      ctx.fillStyle = '#f6f2e2';
      ctx.fillRect(s.x | 0, s.y | 0, s.s, s.s);
    }
    ctx.globalAlpha = 1;

    // sombra do Jajo a passar, sempre longe de mais
    const gx = view.w - ((t * 9) % (view.w + 80)) - 20;
    ctx.globalAlpha = 0.65;
    blit(ctx, JAJO_GHOST, gx | 0, (view.h * 0.55 + Math.sin(t * 3) * 2) | 0);
    ctx.globalAlpha = 1;

    // chão
    ctx.fillStyle = '#1a1636';
    ctx.fillRect(0, view.h - 26, view.w, 26);
    ctx.fillStyle = '#241f47';
    ctx.fillRect(0, view.h - 26, view.w, 2);

    // Bernardo a andar de um lado para o outro
    const frames = CHARS.bernardo.side;
    const idx = [1, 0, 2, 0][Math.floor(t * 8) % 4];
    blit(ctx, frames[idx], walker | 0, view.h - 26 - 14);
  }
});

/* ============================================================
   title.js - ecrã inicial
   ============================================================ */
import { ctx, view, clear } from '../engine/screen.js';
import { draw as blit } from '../engine/sprites.js';
import { CHARS, PROPS, makeSockBig } from '../data/sprites.js';
import { MEIAS } from '../data/socks.js';
import { register, go } from '../engine/scene.js';
import { initAudio, playMusic, sfx } from '../engine/audio.js';
import { fx } from '../engine/fx.js';
import { showHud, esconderTudo } from './ui.js';

const elTitle = document.getElementById('title');
const btnStart = document.getElementById('btn-start');

let t = 0, meias = [], andreiaX = 0;

function preparar() {
  t = 0; andreiaX = -20;
  meias = [];
  for (let i = 0; i < 14; i++) {
    const m = MEIAS[(Math.random() * MEIAS.length) | 0];
    meias.push({
      spr: makeSockBig(m.cor, m.punho),
      x: Math.random() * view.w,
      y: Math.random() * view.h,
      vy: 8 + Math.random() * 16,
      rot: Math.random() * 6
    });
  }
}

btnStart.addEventListener('click', e => {
  e.preventDefault();
  initAudio();
  sfx('porta');
  elTitle.classList.add('hidden');
  fx.transition(() => go('loja', {}), { dur: 0.4, hold: 0.15 });
});

register('titulo', {
  enter() {
    preparar();
    showHud(false);
    esconderTudo();
    document.getElementById('summary').classList.add('hidden');
    elTitle.classList.remove('hidden');
    playMusic('titulo');
  },
  update(dt) {
    t += dt;
    andreiaX += dt * 16;
    if (andreiaX > view.w + 20) andreiaX = -20;
    for (const m of meias) {
      m.y += m.vy * dt;
      m.x += Math.sin(t + m.rot) * 6 * dt;
      if (m.y > view.h + 12) { m.y = -12; m.x = Math.random() * view.w; }
    }
  },
  draw() {
    clear('#241a3e');
    ctx.fillStyle = '#2e2250';
    for (let y = 0; y < view.h; y += 16) ctx.fillRect(0, y, view.w, 8);
    for (const m of meias) {
      ctx.globalAlpha = 0.75;
      blit(ctx, m.spr, m.x | 0, m.y | 0);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#3b2c63';
    ctx.fillRect(0, view.h - 26, view.w, 26);
    ctx.fillStyle = '#4a3878';
    ctx.fillRect(0, view.h - 26, view.w, 2);
    const frames = CHARS.andreia.side;
    const idx = [1, 0, 2, 0][Math.floor(t * 8) % 4];
    blit(ctx, frames[idx], andreiaX | 0, view.h - 26 - 14);
  }
});

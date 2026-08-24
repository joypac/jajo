/* ============================================================
   fx.js - tremer o ecra, flashes, particulas e transicoes
   ============================================================ */
import { ctx, view } from './screen.js';

let shakeT = 0, shakeAmt = 0;
let flashT = 0, flashDur = 0, flashColor = '#ffffff';
const parts = [];

// transicao: 0 = normal, sobe ate 1 (preto), executa, volta a 0
let fadeState = null;   // { phase:'out'|'hold'|'in', t, dur, cb, color }

export const fx = {
  shake(amount, dur) { shakeAmt = Math.max(shakeAmt, amount); shakeT = Math.max(shakeT, dur || 0.2); },
  flash(color, dur) { flashColor = color || '#ffffff'; flashDur = dur || 0.15; flashT = flashDur; },

  /** particulas simples (poeira, brilhos, folhas) */
  burst(x, y, opts) {
    const o = opts || {};
    const n = o.count || 6;
    for (let i = 0; i < n; i++) {
      const a = o.angle != null ? o.angle + (Math.random() - 0.5) * (o.spread || 2) : Math.random() * Math.PI * 2;
      const sp = (o.speed || 30) * (0.5 + Math.random());
      parts.push({
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (o.lift || 0),
        life: o.life || 0.5, max: o.life || 0.5,
        size: o.size || 2, color: o.color || '#f6f2e2',
        grav: o.grav != null ? o.grav : 60
      });
    }
  },

  transition(cb, opts) {
    const o = opts || {};
    fadeState = { phase: 'out', t: 0, dur: o.dur || 0.22, cb, color: o.color || '#07070d', hold: o.hold || 0 };
  },
  get busy() { return !!fadeState; },

  update(dt) {
    if (shakeT > 0) { shakeT -= dt; if (shakeT <= 0) { shakeT = 0; shakeAmt = 0; } }
    if (flashT > 0) flashT -= dt;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= dt;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.grav * dt;
    }
    if (fadeState) {
      fadeState.t += dt;
      if (fadeState.phase === 'out' && fadeState.t >= fadeState.dur) {
        fadeState.phase = 'hold'; fadeState.t = 0;
        if (fadeState.cb) { const c = fadeState.cb; fadeState.cb = null; c(); }
      } else if (fadeState.phase === 'hold' && fadeState.t >= fadeState.hold) {
        fadeState.phase = 'in'; fadeState.t = 0;
      } else if (fadeState.phase === 'in' && fadeState.t >= fadeState.dur) {
        fadeState = null;
      }
    }
  },

  /** deslocamento do tremor, aplicado pela cena antes de desenhar */
  get offsetX() { return shakeT > 0 ? (Math.random() - 0.5) * shakeAmt * 2 : 0; },
  get offsetY() { return shakeT > 0 ? (Math.random() - 0.5) * shakeAmt * 2 : 0; },

  drawParticles(camX, camY) {
    for (const p of parts) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.max));
      ctx.fillStyle = p.color;
      ctx.fillRect((p.x - camX) | 0, (p.y - camY) | 0, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  },

  /** desenhado por cima de tudo */
  drawOverlay() {
    if (flashT > 0) {
      ctx.globalAlpha = Math.max(0, flashT / flashDur) * 0.85;
      ctx.fillStyle = flashColor;
      ctx.fillRect(0, 0, view.w, view.h);
      ctx.globalAlpha = 1;
    }
    if (fadeState) {
      let a = 1;
      if (fadeState.phase === 'out') a = fadeState.t / fadeState.dur;
      else if (fadeState.phase === 'in') a = 1 - fadeState.t / fadeState.dur;
      ctx.globalAlpha = Math.max(0, Math.min(1, a));
      ctx.fillStyle = fadeState.color;
      ctx.fillRect(0, 0, view.w, view.h);
      ctx.globalAlpha = 1;
    }
  },

  clearParticles() { parts.length = 0; }
};

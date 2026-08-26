/* ============================================================
   screen.js - canvas, escala e helpers de desenho
   A canvas tem resolucao logica pequena (pixel art) e e esticada
   para o ecra. A largura logica muda conforme o tamanho do ecra
   para que em telemovel se veja menos mapa (mais zoom).
   ============================================================ */

export const TILE = 16;

export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d', { alpha: false });

export const view = { w: 240, h: 160, scale: 3 };

const stage = document.getElementById('stage');
const ui = document.getElementById('ui');

let onResizeCb = null;
export function onResize(cb) { onResizeCb = cb; }

export function isTouch() {
  return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
}

export function resize() {
  const availW = stage.clientWidth || window.innerWidth;
  const availH = stage.clientHeight || window.innerHeight;
  const portrait = availH > availW;
  const touch = document.body.classList.contains('touch');

  document.body.classList.toggle('portrait', portrait);

  // largura logica: ecras estreitos veem menos tiles (personagens maiores)
  const targetW = availW < 480 ? 208 : (availW < 780 ? 224 : 240);

  let s = Math.min(availW / targetW, 6);
  // em retrato tactil guardamos espaco em baixo para o d-pad
  const usableH = (portrait && touch) ? availH * 0.70 : availH;
  let vh = Math.round(usableH / s);
  if (vh < 140) { vh = 140; s = Math.min(s, usableH / 140); }
  if (vh > 330) { vh = 330; s = Math.min(s, usableH / 330); }

  view.w = targetW;
  view.h = vh;
  view.scale = s;

  canvas.width = view.w;
  canvas.height = view.h;
  ctx.imageSmoothingEnabled = false;

  const w = Math.round(view.w * s);
  const h = Math.round(view.h * s);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';

  // a camada de UI cobre exatamente a canvas
  const left = Math.round((availW - w) / 2);
  const top = (portrait && touch) ? 0 : Math.round((availH - h) / 2);
  ui.style.left = left + 'px';
  ui.style.top = top + 'px';
  ui.style.width = w + 'px';
  ui.style.height = h + 'px';

  const uiScale = Math.max(2.4, Math.min(s, 5.5));
  const touchScale = Math.max(2.6, Math.min(availW / 100, availH / 190, 7));
  const root = document.documentElement.style;
  root.setProperty('--s', String(Math.round(uiScale * 100) / 100));
  root.setProperty('--t', String(Math.round(touchScale * 100) / 100));

  if (onResizeCb) onResizeCb();
}

window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 120));

/* ---------------- helpers de desenho ---------------- */

export function clear(color) {
  ctx.fillStyle = color || '#0b0b16';
  ctx.fillRect(0, 0, view.w, view.h);
}

export function rect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function frameRect(x, y, w, h, color, t) {
  t = t || 1;
  rect(x, y, w, t, color);
  rect(x, y + h - t, w, t, color);
  rect(x, y, t, h, color);
  rect(x + w - t, y, t, h, color);
}

/** Caixa retro (fundo escuro + moldura clara) em coordenadas de jogo. */
export function panel(x, y, w, h) {
  rect(x, y, w, h, '#1b1d3e');
  frameRect(x, y, w, h, '#f6f2e2', 1);
  frameRect(x + 1, y + 1, w - 2, h - 2, '#33376e', 1);
}

export function text(str, x, y, opts) {
  const o = opts || {};
  const size = o.size || 8;
  ctx.font = size + 'px "Press Start 2P", ui-monospace, monospace';
  ctx.textAlign = o.align || 'left';
  ctx.textBaseline = o.baseline || 'top';
  if (o.shadow !== false) {
    ctx.fillStyle = o.shadowColor || '#0a0a14';
    ctx.fillText(str, (x | 0) + 1, (y | 0) + 1);
  }
  ctx.fillStyle = o.color || '#f6f2e2';
  ctx.fillText(str, x | 0, y | 0);
  ctx.textAlign = 'left';
}

export function measure(str, size) {
  ctx.font = (size || 8) + 'px "Press Start 2P", ui-monospace, monospace';
  return ctx.measureText(str).width;
}

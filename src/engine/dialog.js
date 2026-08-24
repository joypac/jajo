/* ============================================================
   dialog.js - a caixa de dialogo (HTML por cima da canvas)
   dialog.start([{s:'NOME',t:'texto'}, ...], aoAcabar)
   ============================================================ */
import { sfx } from './audio.js';

const root = document.getElementById('dialog');
const elSpeaker = document.getElementById('dialog-speaker');
const elText = document.getElementById('dialog-text');
const elNext = document.getElementById('dialog-next');

let lines = [], idx = 0, shown = 0, acc = 0, done = null, open = false;
const SPEED = 45; // caracteres por segundo

function normalize(l) {
  return (typeof l === 'string') ? { t: l } : l;
}

function render() {
  const line = lines[idx];
  const full = line.t || '';
  elText.textContent = full.slice(0, Math.floor(shown));
  if (line.s) { elSpeaker.textContent = line.s; elSpeaker.classList.remove('hidden'); }
  else elSpeaker.classList.add('hidden');
  elNext.classList.toggle('hidden', shown < full.length);
}

export const dialog = {
  get active() { return open; },

  start(list, onDone) {
    lines = (Array.isArray(list) ? list : [list]).map(normalize).filter(l => l && l.t != null);
    if (!lines.length) { if (onDone) onDone(); return; }
    idx = 0; shown = 0; acc = 0; done = onDone || null; open = true;
    root.classList.remove('hidden');
    render();
  },

  update(dt) {
    if (!open) return;
    const full = lines[idx].t || '';
    if (shown < full.length) {
      const before = Math.floor(shown);
      shown = Math.min(full.length, shown + SPEED * dt);
      const after = Math.floor(shown);
      if (after > before) {
        for (let i = before; i < after; i++) {
          const ch = full[i];
          if (i % 3 === 0 && ch !== ' ') sfx(i % 6 === 0 ? 'blip' : 'blip2');
        }
      }
      render();
    }
  },

  /** chamado quando o jogador carrega em A / toca na caixa */
  advance() {
    if (!open) return;
    const full = lines[idx].t || '';
    if (shown < full.length) { shown = full.length; render(); return; }
    idx++;
    if (idx >= lines.length) {
      this.hide();
      const cb = done; done = null;
      if (cb) cb();
    } else {
      shown = 0; render();
    }
  },

  hide() {
    open = false;
    root.classList.add('hidden');
    lines = []; idx = 0; shown = 0;
  }
};

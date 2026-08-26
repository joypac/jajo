/* ============================================================
   input.js - joystick virtual (ou dedo em qualquer sítio à
   esquerda) + teclado. Movimento é um vetor, não uma grelha.
   ============================================================ */

export const move = { x: 0, y: 0 };          // -1..1
export const btn = { a: false, b: false };   // estado (para "manter carregado")
const pressed = new Set();                   // toques discretos deste frame
let activity = 0;

export function consume(n) { if (pressed.has(n)) { pressed.delete(n); return true; } return false; }
export function press(n) { pressed.add(n); activity = performance.now(); }
export function endFrame() { pressed.clear(); }
export function idleTime() { return performance.now() - activity; }

const keys = { up: false, down: false, left: false, right: false };
const KEYMAP = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right'
};

let stickEl, knobEl, stickId = null, stickCx = 0, stickCy = 0, stickR = 60;
let stickHome = null;

function setKnob(dx, dy) {
  if (!knobEl) return;
  knobEl.style.transform = `translate(${dx}px, ${dy}px)`;
}

function recompute() {
  const r = stickEl.getBoundingClientRect();
  stickR = r.width / 2;
  if (stickId === null) { stickCx = r.left + r.width / 2; stickCy = r.top + r.height / 2; }
}

export function initInput() {
  stickEl = document.getElementById('stick');
  knobEl = document.getElementById('stick-knob');
  stickHome = { left: stickEl.style.left, bottom: stickEl.style.bottom };

  /* ---------- teclado ---------- */
  window.addEventListener('keydown', e => {
    const d = KEYMAP[e.code];
    if (d) { keys[d] = true; activity = performance.now(); e.preventDefault(); }
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') { if (!btn.a) press('a'); btn.a = true; e.preventDefault(); }
    if (e.code === 'ShiftLeft' || e.code === 'KeyQ' || e.code === 'Escape') { if (!btn.b) press('b'); btn.b = true; }
    if (e.code === 'KeyM') press('mute');
  });
  window.addEventListener('keyup', e => {
    const d = KEYMAP[e.code];
    if (d) keys[d] = false;
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') btn.a = false;
    if (e.code === 'ShiftLeft' || e.code === 'KeyQ' || e.code === 'Escape') btn.b = false;
  });
  window.addEventListener('blur', () => {
    keys.up = keys.down = keys.left = keys.right = false;
    btn.a = btn.b = false; stickId = null; move.x = move.y = 0; setKnob(0, 0);
  });

  /* ---------- joystick ---------- */
  const stage = document.getElementById('stage');
  recompute();
  window.addEventListener('resize', () => setTimeout(recompute, 60));

  const startStick = (e, moveHome) => {
    stickId = e.pointerId;
    if (moveHome) {
      const w = stickEl.offsetWidth;
      stickEl.style.left = (e.clientX - w / 2) + 'px';
      stickEl.style.bottom = 'auto';
      stickEl.style.top = (e.clientY - w / 2) + 'px';
      stickCx = e.clientX; stickCy = e.clientY;
    } else {
      const r = stickEl.getBoundingClientRect();
      stickCx = r.left + r.width / 2; stickCy = r.top + r.height / 2;
      stickR = r.width / 2;
    }
    activity = performance.now();
    dragStick(e);
    try { stickEl.setPointerCapture(e.pointerId); } catch (_) {}
  };

  /* O polegar não anda muito: a velocidade máxima chega-se com pouco
     desvio. A zona morta é radial (não por eixo), senão as diagonais
     ficavam a saltar. */
  const MORTO = 5;
  const dragStick = e => {
    if (e.pointerId !== stickId) return;
    const dx = e.clientX - stickCx, dy = e.clientY - stickCy;
    const d = Math.hypot(dx, dy);
    if (d <= MORTO) { move.x = 0; move.y = 0; setKnob(0, 0); return; }
    const cheio = Math.max(24, stickR * 0.55);      // desvio para velocidade máxima
    const k = Math.min(1, (d - MORTO) / (cheio - MORTO));
    move.x = (dx / d) * k;
    move.y = (dy / d) * k;
    const visual = Math.min(d, stickR);
    setKnob((dx / d) * visual, (dy / d) * visual);
  };

  const endStick = e => {
    if (e && e.pointerId !== stickId) return;
    stickId = null; move.x = 0; move.y = 0; setKnob(0, 0);
    stickEl.style.left = stickHome.left || '';
    stickEl.style.top = '';
    stickEl.style.bottom = stickHome.bottom || '';
    setTimeout(recompute, 30);
  };

  stickEl.addEventListener('pointerdown', e => { e.preventDefault(); startStick(e, false); });
  window.addEventListener('pointermove', dragStick);
  window.addEventListener('pointerup', endStick);
  window.addEventListener('pointercancel', endStick);

  // dedo em qualquer sítio na metade esquerda também controla
  stage.addEventListener('pointerdown', e => {
    if (!document.body.classList.contains('touch')) return;
    if (stickId !== null) return;
    if (e.target.closest('button, .opt, #ui > div:not(#toasts)')) return;
    if (e.clientX > window.innerWidth * 0.5) return;
    e.preventDefault();
    startStick(e, true);
  });

  /* ---------- botões ---------- */
  const bind = (id, name) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('pointerdown', e => { e.preventDefault(); btn[name] = true; press(name); });
    const up = e => { if (e) e.preventDefault(); btn[name] = false; };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', up);
    el.addEventListener('contextmenu', e => e.preventDefault());
  };
  bind('btn-a', 'a');
  bind('btn-b', 'b');
}

/* O dedo nunca aponta exatamente a direito. Sem isto a Andreia
   ia sempre um bocadinho de lado, roçava nas estantes e o sprite
   andava a saltar entre "de frente" e "de lado".
   Encaixamos em 8 direções, com uma zona larga para cima/baixo/
   esquerda/direita: só se anda na diagonal quando é mesmo de propósito. */
const SETOR_CARDEAL = 30 * Math.PI / 180;   // +-30 graus agarra a direção certa

function encaixar(x, y) {
  const d = Math.hypot(x, y);
  if (d < 0.001) return { x: 0, y: 0 };
  const ang = Math.atan2(y, x);
  const quarto = Math.PI / 2;
  const cardeal = Math.round(ang / quarto) * quarto;
  let alvo;
  if (Math.abs(((ang - cardeal + Math.PI) % (2 * Math.PI)) - Math.PI) <= SETOR_CARDEAL) {
    alvo = cardeal;                                   // perto de uma direção "a direito"
  } else {
    alvo = Math.round(ang / (Math.PI / 4)) * (Math.PI / 4);   // diagonal assumida
  }
  return { x: Math.cos(alvo) * d, y: Math.sin(alvo) * d };
}

/** vetor de movimento final (teclado tem prioridade se estiver a ser usado) */
export function moveVector() {
  const x = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  const y = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
  if (x || y) {
    const d = Math.hypot(x, y);
    return { x: x / d, y: y / d };
  }
  const d = Math.hypot(move.x, move.y);
  const mx = d > 1 ? move.x / d : move.x;
  const my = d > 1 ? move.y / d : move.y;
  return encaixar(mx, my);
}

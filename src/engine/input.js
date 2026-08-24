/* ============================================================
   input.js - teclado + d-pad tactil
   O jogo pergunta:  held.up / held.left ...  e  consume('a')
   ============================================================ */

export const held = { up: false, down: false, left: false, right: false };
const pressed = new Set();
let activity = 0;   // timestamp da ultima acao do jogador

export function consume(name) {
  if (pressed.has(name)) { pressed.delete(name); return true; }
  return false;
}
export function press(name) { pressed.add(name); activity = performance.now(); }
export function endFrame() { pressed.clear(); }
export function idleTime() { return performance.now() - activity; }
export function resetIdle() { activity = performance.now(); }
export function heldDir() {
  if (held.up) return 'up';
  if (held.down) return 'down';
  if (held.left) return 'left';
  if (held.right) return 'right';
  return null;
}
export function clearHeld() { held.up = held.down = held.left = held.right = false; }

const KEYS = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right'
};

export function initInput() {
  window.addEventListener('keydown', e => {
    const dir = KEYS[e.code];
    if (dir) { held[dir] = true; activity = performance.now(); e.preventDefault(); }
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ') { press('a'); e.preventDefault(); }
    if (e.code === 'Escape' || e.code === 'KeyI' || e.code === 'KeyX') { press('menu'); e.preventDefault(); }
    if (e.code === 'KeyM') press('mute');
  });
  window.addEventListener('keyup', e => {
    const dir = KEYS[e.code];
    if (dir) held[dir] = false;
  });
  window.addEventListener('blur', clearHeld);

  // ---- d-pad ----
  document.querySelectorAll('#dpad .dp').forEach(btn => {
    const dir = btn.dataset.dir;
    const on = e => {
      e.preventDefault();
      held[dir] = true; btn.classList.add('on'); activity = performance.now();
      if (btn.setPointerCapture && e.pointerId != null) { try { btn.setPointerCapture(e.pointerId); } catch (_) {} }
    };
    const off = e => { if (e) e.preventDefault(); held[dir] = false; btn.classList.remove('on'); };
    btn.addEventListener('pointerdown', on);
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointercancel', off);
    btn.addEventListener('pointerleave', off);
    btn.addEventListener('contextmenu', e => e.preventDefault());
  });

  const tap = (el, name) => {
    if (!el) return;
    el.addEventListener('pointerdown', e => { e.preventDefault(); press(name); });
    el.addEventListener('contextmenu', e => e.preventDefault());
  };
  tap(document.getElementById('btn-a'), 'a');
  tap(document.getElementById('btn-menu'), 'menu');

  // tocar na caixa de dialogo avanca
  tap(document.getElementById('dialog'), 'a');
  tap(document.getElementById('bt-log'), 'a');
}

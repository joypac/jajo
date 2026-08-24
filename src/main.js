/* ============================================================
   ONDE ESTÁ O JAJO?
   main.js - arranque e ciclo do jogo
   ============================================================ */
import { resize, isTouch } from './engine/screen.js';
import { initInput, endFrame, consume } from './engine/input.js';
import { fx } from './engine/fx.js';
import { sceneUpdate, sceneDraw, go } from './engine/scene.js';
import { initAudio, toggleMute, isMuted } from './engine/audio.js';
import { updateMenu } from './game/menu.js';

/* as cenas registam-se ao serem importadas */
import './game/world.js';
import './game/battle.js';
import './game/title.js';
import './game/ending.js';

function boot() {
  if (isTouch()) document.body.classList.add('touch');
  document.getElementById('touch').classList.remove('hidden');
  resize();
  initInput();

  const btnSound = document.getElementById('btn-sound');
  btnSound.addEventListener('pointerdown', e => {
    e.preventDefault();
    initAudio();
    btnSound.classList.toggle('off', toggleMute());
  });

  // qualquer toque desbloqueia o áudio nos browsers de telemóvel
  const unlock = () => { initAudio(); window.removeEventListener('pointerdown', unlock); };
  window.addEventListener('pointerdown', unlock);

  go('title', {});

  // atalho para testar cenas: abrir com  index.html#debug
  if (location.hash.indexOf('debug') >= 0) {
    import('./game/state.js').then(m => {
      window.__jajo = { go, state: m.state, flags: m.state.flags, reset: m.resetState, addItem: m.addItem };
    });
  }

  let last = performance.now();
  function loop(now) {
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.1) dt = 0.1;          // evita saltos ao voltar ao separador

    if (consume('mute')) { initAudio(); document.getElementById('btn-sound').classList.toggle('off', toggleMute()); }

    updateMenu(dt);
    fx.update(dt);
    sceneUpdate(dt);
    sceneDraw();
    fx.drawOverlay();
    endFrame();

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

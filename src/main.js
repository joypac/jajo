/* ============================================================
   ANDREIA - A LOJA DAS MEIAS
   main.js - arranque e ciclo do jogo
   ============================================================ */
import { resize, isTouch } from './engine/screen.js';
import { initInput, endFrame, consume } from './engine/input.js';
import { fx } from './engine/fx.js';
import { sceneUpdate, sceneDraw, go } from './engine/scene.js';
import { initAudio, toggleMute } from './engine/audio.js';

import './game/shop.js';
import './game/title.js';
import './game/summary.js';

function boot() {
  if (isTouch() || window.innerWidth < 760) {
    document.body.classList.add('touch');
    document.getElementById('touch').classList.remove('hidden');
  }
  resize();
  initInput();

  const btnSound = document.getElementById('btn-sound');
  btnSound.addEventListener('pointerdown', e => {
    e.preventDefault();
    initAudio();
    btnSound.classList.toggle('off', toggleMute());
  });
  const unlock = () => { initAudio(); window.removeEventListener('pointerdown', unlock); };
  window.addEventListener('pointerdown', unlock);

  go('titulo', {});

  if (location.hash.indexOf('debug') >= 0) {
    Promise.all([import('./game/state.js'), import('./game/shop.js')]).then(([st, sh]) => {
      window.__loja = {
        go, S: st.S, andreia: sh.A,
        clientes: () => sh.clientes,
        prateleiras: () => sh.prateleiras,
        tp: (x, y) => { sh.A.x = x * 16; sh.A.y = y * 16; },
        adiantar: seg => { st.S.t += seg; },
        spawn: t => sh.debugSpawn(t)
      };
    });
  }

  let last = performance.now();
  function loop(now) {
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.1) dt = 0.1;
    if (consume('mute')) { initAudio(); document.getElementById('btn-sound').classList.toggle('off', toggleMute()); }
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

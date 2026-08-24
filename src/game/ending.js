/* ============================================================
   ending.js - o ecrã preto, o susto e o fim
   ============================================================ */
import { ctx, view, clear, text } from '../engine/screen.js';
import { JAJO, JAJO_BIG } from '../data/sprites.js';
import { FINAL_SEQUENCE, FINAL_AFTER } from '../data/script.js';
import { DADOS } from '../data/dados.js';
import { dialog } from '../engine/dialog.js';
import { fx } from '../engine/fx.js';
import { consume } from '../engine/input.js';
import { sfx, playMusic, stopMusic, musicVolume, initAudio } from '../engine/audio.js';
import { register, go } from '../engine/scene.js';
import { state, elapsedMs, formatTime, learnFact, knowsFact } from './state.js';
import { showHud, hideToasts } from './ui.js';

const elEnd = document.getElementById('ending');
const btnAgain = document.getElementById('btn-again');

let phase = 'seq', i = 0, timer = 0, t = 0, popT = 0;

function startSeq() {
  phase = 'seq'; i = 0; timer = 0; t = 0; popT = 0;
  stopMusic();
}

function reveal() {
  phase = 'reveal';
  popT = 0;
  initAudio();
  sfx('sting');
  fx.flash('#ffffff', 0.45);
  fx.shake(6, 0.9);
}

function toDialog() {
  phase = 'dialog';
  musicVolume(0.5);
  playMusic('fim');
  dialog.start(FINAL_AFTER, showEndScreen);
}

function showEndScreen() {
  phase = 'done';
  state.endTime = performance.now();
  learnFact('fofo');
  document.getElementById('end-l2').textContent = 'Demoraste ' + formatTime(elapsedMs()) + '.';

  // ficha final do Jajo
  const inner = elEnd.querySelector('.end-inner');
  let box = document.getElementById('end-dados');
  if (!box) {
    box = document.createElement('div');
    box.id = 'end-dados';
    inner.insertBefore(box, btnAgain);
  }
  box.innerHTML = '<h2>DADOS DO JAJO</h2>' + DADOS.map(d =>
    '<div class="row"><span>' + d.label + '</span><b class="' +
    (d.warn ? 'warn' : d.heart ? 'heart' : '') + '">' +
    ((d.always || knowsFact(d.key)) ? d.value : '???') + '</b></div>'
  ).join('');

  elEnd.classList.remove('hidden');
  sfx('win');
}

btnAgain.addEventListener('click', e => {
  e.preventDefault();
  elEnd.classList.add('hidden');
  sfx('confirm');
  fx.transition(() => go('title', {}), { dur: 0.4 });
});

register('ending', {
  enter() {
    showHud(false);
    hideToasts();
    document.getElementById('battle').classList.add('hidden');
    elEnd.classList.add('hidden');
    startSeq();
  },
  update(dt) {
    t += dt;
    if (phase === 'seq') {
      timer += dt * 1000;
      const step = FINAL_SEQUENCE[i];
      if (timer >= step.wait) {
        timer = 0; i++;
        if (i >= FINAL_SEQUENCE.length) reveal();
        else if (FINAL_SEQUENCE[i].text) sfx(FINAL_SEQUENCE[i].big ? 'blip' : 'blip2');
      }
      consume('a');
    } else if (phase === 'reveal') {
      popT += dt;
      consume('a');
      if (popT > 1.9) toDialog();
    } else if (phase === 'dialog') {
      dialog.update(dt);
      if (consume('a')) dialog.advance();
    } else {
      consume('a');
    }
  },
  draw() {
    clear('#000000');
    if (phase === 'seq') {
      const step = FINAL_SEQUENCE[i] || FINAL_SEQUENCE[FINAL_SEQUENCE.length - 1];
      if (step.text) {
        const size = step.big ? 12 : 8;
        text(step.text, view.w / 2, view.h / 2 - size, {
          size, align: 'center',
          color: step.quiet ? '#a9a6c4' : '#f6f2e2'
        });
      }
      return;
    }
    // o Jajo aparece
    const s = Math.min(1, popT / 0.35);
    const scale = popT < 0.35 ? (0.3 + s * 0.9) : (1.2 - Math.min(1, (popT - 0.35) / 0.25) * 0.2);
    const w = Math.round(JAJO.width * 4 * scale);
    const h = Math.round(JAJO.height * 4 * scale);
    const x = Math.round(view.w / 2 - w / 2);
    const y = Math.round(view.h / 2 - h / 2 + Math.sin(t * 4) * 2);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(JAJO_BIG, x, y, w, h);
    if (popT > 0.8) {
      text('JAJO', view.w / 2, y + h + 6, { size: 8, align: 'center', color: '#ffd447' });
    }
  }
});

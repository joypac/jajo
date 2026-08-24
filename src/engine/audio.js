/* ============================================================
   audio.js - música chiptune e efeitos gerados na hora.
   Sem ficheiros: tudo osciladores.
   ============================================================ */

let actx = null, master = null, musicGain = null, sfxGain = null;
let muted = false, noiseBuf = null;

const PC = { C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11 };
function freq(name) {
  if (!name) return 0;
  const m = /^([A-G]#?)(-?\d)$/.exec(name);
  if (!m) return 0;
  return 440 * Math.pow(2, (PC[m[1]] + (parseInt(m[2], 10) + 1) * 12 - 69) / 12);
}

export function initAudio() {
  if (actx) { if (actx.state === 'suspended') actx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  actx = new AC();
  master = actx.createGain(); master.gain.value = muted ? 0 : 0.32; master.connect(actx.destination);
  musicGain = actx.createGain(); musicGain.gain.value = 0.5; musicGain.connect(master);
  sfxGain = actx.createGain(); sfxGain.gain.value = 1; sfxGain.connect(master);
  noiseBuf = actx.createBuffer(1, actx.sampleRate * 0.5, actx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}

export function isMuted() { return muted; }
export function toggleMute() {
  muted = !muted;
  if (master) master.gain.setTargetAtTime(muted ? 0 : 0.32, actx.currentTime, 0.02);
  return muted;
}
export function musicVolume(v) { if (musicGain && actx) musicGain.gain.setTargetAtTime(v, actx.currentTime, 0.3); }

function tone(dest, f, t, dur, type, vol, slideTo) {
  if (!actx || !f) return;
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type || 'square';
  o.frequency.setValueAtTime(f, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(dest);
  o.start(t); o.stop(t + dur + 0.02);
}
function noise(dest, t, dur, vol, hp) {
  if (!actx || !noiseBuf) return;
  const s = actx.createBufferSource(); s.buffer = noiseBuf;
  const g = actx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = s;
  if (hp) { const f = actx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; s.connect(f); node = f; }
  node.connect(g); g.connect(dest);
  s.start(t); s.stop(t + dur + 0.02);
}

const SFX = {
  porta:    t => { tone(sfxGain, 1318, t, 0.10, 'triangle', 0.20); tone(sfxGain, 1760, t + 0.09, 0.16, 'triangle', 0.18); },
  meia:     t => { tone(sfxGain, 520, t, 0.07, 'triangle', 0.16, 300); noise(sfxGain, t, 0.05, 0.05, 2000); },
  arrumar:  t => { noise(sfxGain, t, 0.07, 0.10, 1800); tone(sfxGain, 700, t, 0.05, 'square', 0.07); },
  caixote:  t => { tone(sfxGain, 120, t, 0.16, 'square', 0.22, 60); noise(sfxGain, t, 0.10, 0.16, 300); },
  registo:  t => { tone(sfxGain, 1046, t, 0.08, 'square', 0.18); tone(sfxGain, 1568, t + 0.07, 0.20, 'square', 0.18); noise(sfxGain, t + 0.02, 0.10, 0.10, 4000); },
  esfregona:t => noise(sfxGain, t, 0.18, 0.10, 900),
  pergunta: t => { tone(sfxGain, 880, t, 0.07, 'square', 0.16); tone(sfxGain, 1174, t + 0.07, 0.10, 'square', 0.16); },
  compra:   t => [784, 988, 1318, 1568].forEach((f, i) => tone(sfxGain, f, t + i * 0.07, 0.18, 'square', 0.20)),
  recusa:   t => { tone(sfxGain, 520, t, 0.12, 'square', 0.16); tone(sfxGain, 392, t + 0.11, 0.18, 'square', 0.16); },
  energia:  t => [523, 659, 880].forEach((f, i) => tone(sfxGain, f, t + i * 0.07, 0.16, 'triangle', 0.20)),
  aviso:    t => { tone(sfxGain, 660, t, 0.10, 'square', 0.16); tone(sfxGain, 660, t + 0.16, 0.12, 'square', 0.16); },
  erro:     t => { tone(sfxGain, 200, t, 0.20, 'sawtooth', 0.18, 90); },
  pegadas:  t => { noise(sfxGain, t, 0.06, 0.10, 600); noise(sfxGain, t + 0.09, 0.06, 0.08, 600); },
  clique:   t => tone(sfxGain, 760, t, 0.03, 'square', 0.10),
  sonia:    t => { tone(sfxGain, 440, t, 0.10, 'triangle', 0.14); tone(sfxGain, 415, t + 0.10, 0.16, 'triangle', 0.14); },
  fim:      t => [1046, 784, 659, 523].forEach((f, i) => tone(sfxGain, f, t + i * 0.13, 0.3, 'triangle', 0.18)),
  vitoria:  t => [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(sfxGain, f, t + i * 0.09, 0.25, 'square', 0.20))
};
export function sfx(name) {
  if (!actx || muted) return;
  const f = SFX[name];
  if (f) f(actx.currentTime + 0.001);
}

/* ---------------- música ---------------- */
const THEMES = {
  titulo: {
    bpm: 124, wave: 'square', bassWave: 'triangle', vol: 0.12,
    melody: [['E5',2],['G5',2],['A5',4],['G5',2],['E5',2],['D5',4],
             ['C5',2],['E5',2],['G5',4],['E5',2],['D5',2],['C5',4],
             ['D5',2],['F5',2],['A5',4],['G5',4],['E5',4],
             ['C5',2],['D5',2],['E5',4],['G5',4],[null,4]],
    bass: [['C3',4],['G2',4],['A2',4],['F2',4],['C3',4],['G2',4],['C3',4],['G2',4],
           ['F2',4],['C3',4],['G2',4],['A2',4],['F2',4],['G2',4],['C3',4],['C3',4]],
    drums: '--h---h---h---h-'
  },
  loja: {
    bpm: 138, wave: 'square', bassWave: 'triangle', vol: 0.10,
    melody: [['C5',2],['E5',2],['G5',2],['E5',2],['F5',2],['E5',2],['D5',4],
             ['D5',2],['F5',2],['A5',2],['F5',2],['G5',2],['F5',2],['E5',4],
             ['E5',2],['G5',2],['C6',2],['G5',2],['A5',4],['G5',4],
             ['F5',2],['E5',2],['D5',2],['C5',2],['G4',4],['C5',4]],
    bass: [['C3',2],['C3',2],['G2',2],['G2',2],['A2',2],['A2',2],['F2',2],['F2',2],
           ['C3',2],['C3',2],['G2',2],['G2',2],['F2',2],['F2',2],['G2',2],['G2',2],
           ['A2',2],['A2',2],['E3',2],['E3',2],['F2',2],['F2',2],['C3',2],['C3',2],
           ['F2',2],['F2',2],['G2',2],['G2',2],['C3',2],['C3',2],['C3',2],['C3',2]],
    drums: 'k-h-s-h-k-h-s-h-'
  },
  corrida: {
    bpm: 168, wave: 'square', bassWave: 'square', vol: 0.10,
    melody: [['A4',2],['C5',2],['E5',2],['C5',2],['D5',2],['F5',2],['E5',4],
             ['A4',2],['C5',2],['E5',2],['G5',2],['F5',2],['E5',2],['D5',4],
             ['G4',2],['B4',2],['D5',2],['B4',2],['C5',2],['E5',2],['D5',4],
             ['F5',2],['E5',2],['D5',2],['C5',2],['B4',4],['A4',4]],
    bass: [['A2',2],['A2',2],['A2',2],['A2',2],['F2',2],['F2',2],['F2',2],['F2',2],
           ['A2',2],['A2',2],['A2',2],['A2',2],['G2',2],['G2',2],['G2',2],['G2',2],
           ['G2',2],['G2',2],['G2',2],['G2',2],['C3',2],['C3',2],['C3',2],['C3',2],
           ['F2',2],['F2',2],['E2',2],['E2',2],['A2',2],['A2',2],['A2',2],['A2',2]],
    drums: 'k-hks-hkk-hks-hk'
  },
  venezia: {
    bpm: 92, wave: 'triangle', bassWave: 'triangle', vol: 0.13,
    melody: [['G4',4],['B4',4],['D5',4],['B4',4],['C5',4],['E5',4],['D5',8],
             ['A4',4],['C5',4],['E5',4],['C5',4],['D5',8],['G4',8]],
    bass: [['G2',8],['E2',8],['C3',8],['D3',8],['A2',8],['F2',8],['G2',8],['G2',8]],
    drums: '----h-------h---'
  },
  resumo: {
    bpm: 96, wave: 'triangle', bassWave: 'triangle', vol: 0.14,
    melody: [['C5',4],['E5',4],['G5',8],['F5',4],['E5',4],['D5',8],
             ['E5',4],['G5',4],['C6',8],['G5',4],['E5',4],['C5',8]],
    bass: [['C3',8],['G2',8],['F2',8],['G2',8],['C3',8],['E3',8],['F2',8],['G2',8]],
    drums: '----------------'
  }
};

function expand(seq) {
  const map = new Map(); let pos = 0;
  for (const [n, len] of seq) { if (n) map.set(pos, { f: freq(n), steps: len }); pos += len; }
  return { map, length: pos };
}
const COMPILED = {};
for (const k in THEMES) COMPILED[k] = { def: THEMES[k], mel: expand(THEMES[k].melody), bass: expand(THEMES[k].bass) };

let current = null, curName = '', step = 0, nextTime = 0, timer = null;

function scheduler() {
  if (!current || !actx) return;
  const d = 60 / current.def.bpm / 4;
  while (nextTime < actx.currentTime + 0.25) {
    const m = current.mel.map.get(step % current.mel.length);
    if (m) tone(musicGain, m.f, nextTime, m.steps * d * 0.9, current.def.wave, current.def.vol);
    const b = current.bass.map.get(step % current.bass.length);
    if (b) tone(musicGain, b.f, nextTime, b.steps * d * 0.9, current.def.bassWave, current.def.vol * 0.8);
    const dr = current.def.drums[step % current.def.drums.length];
    if (dr === 'k') tone(musicGain, 110, nextTime, 0.11, 'sine', 0.26, 40);
    else if (dr === 'h') noise(musicGain, nextTime, 0.035, 0.05, 6500);
    else if (dr === 's') noise(musicGain, nextTime, 0.11, 0.11, 1600);
    nextTime += d; step++;
    if (step > 1e9) step = 0;
  }
}

export function playMusic(name) {
  if (!actx || curName === name) return;
  stopMusic();
  const c = COMPILED[name];
  if (!c) return;
  current = c; curName = name; step = 0;
  nextTime = actx.currentTime + 0.06;
  timer = setInterval(scheduler, 45);
  scheduler();
}
export function stopMusic() { if (timer) { clearInterval(timer); timer = null; } current = null; curName = ''; }
export function currentMusic() { return curName; }

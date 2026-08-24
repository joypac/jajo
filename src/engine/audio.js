/* ============================================================
   audio.js - chiptune e efeitos gerados na hora (WebAudio)
   Nada de ficheiros: tudo sao osciladores.
   ============================================================ */

let actx = null, master = null, musicGain = null, sfxGain = null;
let muted = false;
let noiseBuf = null;

const PC = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
function freq(name) {
  if (!name) return 0;
  const m = /^([A-G]#?)(-?\d)$/.exec(name);
  if (!m) return 0;
  const midi = PC[m[1]] + (parseInt(m[2], 10) + 1) * 12;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function initAudio() {
  if (actx) { if (actx.state === 'suspended') actx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  actx = new AC();
  master = actx.createGain(); master.gain.value = muted ? 0 : 0.34; master.connect(actx.destination);
  musicGain = actx.createGain(); musicGain.gain.value = 0.55; musicGain.connect(master);
  sfxGain = actx.createGain(); sfxGain.gain.value = 1.0; sfxGain.connect(master);

  noiseBuf = actx.createBuffer(1, actx.sampleRate * 0.4, actx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}

export function isMuted() { return muted; }
export function toggleMute() {
  muted = !muted;
  if (master) master.gain.setTargetAtTime(muted ? 0 : 0.34, actx.currentTime, 0.02);
  return muted;
}

/* ---------------- blocos base ---------------- */
function tone(dest, f, t, dur, type, vol, slideTo) {
  if (!actx || !f) return;
  const o = actx.createOscillator();
  const g = actx.createGain();
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

/* ---------------- efeitos ---------------- */
const SFX = {
  blip:    t => tone(sfxGain, 760, t, 0.035, 'square', 0.10),
  blip2:   t => tone(sfxGain, 620, t, 0.035, 'square', 0.10),
  confirm: t => { tone(sfxGain, 620, t, 0.06, 'square', 0.18); tone(sfxGain, 930, t + 0.06, 0.10, 'square', 0.18); },
  cancel:  t => { tone(sfxGain, 420, t, 0.07, 'square', 0.16); tone(sfxGain, 260, t + 0.06, 0.10, 'square', 0.16); },
  step:    t => noise(sfxGain, t, 0.04, 0.05, 900),
  hit:     t => { noise(sfxGain, t, 0.14, 0.30, 500); tone(sfxGain, 220, t, 0.16, 'square', 0.20, 60); },
  hurt:    t => { tone(sfxGain, 180, t, 0.22, 'sawtooth', 0.20, 70); noise(sfxGain, t, 0.10, 0.16, 300); },
  drama:   t => { [0, .08, .16, .24].forEach((d, i) => tone(sfxGain, 330 * Math.pow(1.26, i), t + d, 0.18, 'sawtooth', 0.16)); noise(sfxGain, t + 0.3, 0.4, 0.22, 200); },
  item:    t => [523, 659, 784, 1046].forEach((f, i) => tone(sfxGain, f, t + i * 0.06, 0.12, 'square', 0.17)),
  heal:    t => [523, 784, 1046].forEach((f, i) => tone(sfxGain, f, t + i * 0.07, 0.16, 'triangle', 0.20)),
  chicken: t => { tone(sfxGain, 900, t, 0.08, 'square', 0.18, 500); tone(sfxGain, 780, t + 0.11, 0.10, 'square', 0.18, 420); },
  open:    t => { tone(sfxGain, 300, t, 0.05, 'square', 0.14); tone(sfxGain, 500, t + 0.05, 0.08, 'square', 0.14); },
  win:     t => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(sfxGain, f, t + i * 0.09, 0.22, 'square', 0.20)),
  flee:    t => tone(sfxGain, 700, t, 0.3, 'square', 0.16, 180),
  sting:   t => {
    [110, 220, 233, 466].forEach(f => tone(sfxGain, f, t, 1.1, 'sawtooth', 0.16));
    noise(sfxGain, t, 0.7, 0.30, 120);
    tone(sfxGain, 1400, t, 0.5, 'square', 0.12, 300);
  },
  boss:    t => { [55, 110, 116.5].forEach(f => tone(sfxGain, f, t, 1.6, 'sawtooth', 0.18)); noise(sfxGain, t, 1.2, 0.16, 80); }
};

export function sfx(name) {
  if (!actx || muted) return;
  const f = SFX[name];
  if (f) f(actx.currentTime + 0.001);
}

/* ---------------- musica ---------------- */
/* cada faixa: [nota|null, duracao em semicolcheias] */
const THEMES = {
  aldeia: {
    bpm: 132, wave: 'square', bassWave: 'triangle', vol: 0.13,
    melody: [['G4',2],['C5',2],['E5',2],['G5',2],['E5',2],['C5',2],['D5',4],
             ['F4',2],['A4',2],['C5',2],['F5',2],['E5',4],['D5',4],
             ['E5',2],['G5',2],['A5',2],['G5',2],['E5',2],['C5',2],['G4',4],
             ['A4',2],['C5',2],['E5',2],['D5',2],['C5',4],[null,4]],
    bass:   [['C3',4],['C3',4],['G2',4],['G2',4],['F2',4],['F2',4],['C3',4],['C3',4],
             ['C3',4],['E3',4],['F3',4],['G3',4],['A2',4],['F2',4],['G2',4],['G2',4]],
    drums: '----h-------h---'
  },
  floresta: {
    bpm: 96, wave: 'triangle', bassWave: 'triangle', vol: 0.15,
    melody: [['A4',4],['C5',2],['B4',2],['A4',4],['E4',4],
             ['F4',4],['E4',4],['D4',4],[null,4],
             ['A4',4],['E5',2],['D5',2],['C5',4],['B4',4],
             ['A4',8],[null,8]],
    bass:   [['A2',8],['A2',8],['F2',8],['G2',8],['A2',8],['E2',8],['F2',8],['G2',8]],
    drums: '----------------'
  },
  fatima: {
    bpm: 76, wave: 'triangle', bassWave: 'triangle', vol: 0.15,
    melody: [['C5',8],['G4',8],['A4',8],['G4',8],['F4',8],['E4',8],['G4',8],[null,8]],
    bass:   [['C3',16],['A2',16],['F2',16],['G2',16]],
    drums: '----------------'
  },
  caldas: {
    bpm: 118, wave: 'square', bassWave: 'triangle', vol: 0.12,
    melody: [['D5',2],['F5',2],['E5',2],['C5',2],['D5',4],[null,4],
             ['G4',2],['B4',2],['A4',2],['F4',2],['G4',4],[null,4],
             ['D5',2],['E5',2],['F5',2],['G5',2],['A5',4],['F5',4],
             ['E5',2],['D5',2],['C5',2],['B4',2],['A4',8]],
    bass:   [['D3',4],['A2',4],['D3',4],['A2',4],['G2',4],['D3',4],['G2',4],['D3',4],
             ['D3',4],['F3',4],['A2',4],['C3',4],['G2',4],['A2',4],['D3',8]],
    drums: '--h---h---h---h-'
  },
  combate: {
    bpm: 168, wave: 'square', bassWave: 'square', vol: 0.12,
    melody: [['E5',2],['E5',2],['G5',2],['E5',2],['D5',2],['C5',2],['B4',4],
             ['C5',2],['C5',2],['E5',2],['C5',2],['B4',2],['A4',2],['G4',4],
             ['A4',2],['B4',2],['C5',2],['D5',2],['E5',4],['G5',4],
             ['E5',2],['D5',2],['C5',2],['B4',2],['A4',8]],
    bass:   [['A2',2],['A2',2],['A2',2],['A2',2],['E2',2],['E2',2],['E2',2],['E2',2],
             ['F2',2],['F2',2],['F2',2],['F2',2],['G2',2],['G2',2],['G2',2],['G2',2],
             ['A2',2],['A2',2],['A2',2],['A2',2],['C3',2],['C3',2],['C3',2],['C3',2],
             ['F2',2],['F2',2],['F2',2],['F2',2],['E2',2],['E2',2],['E2',2],['E2',2]],
    drums: 'k-h-s-h-k-h-s-h-'
  },
  boss: {
    bpm: 84, wave: 'sawtooth', bassWave: 'square', vol: 0.11,
    melody: [['A4',4],['A4',2],['A#4',2],['A4',4],['E4',4],
             ['F4',4],['E4',2],['F4',2],['G4',4],['E4',4],
             ['A4',4],['C5',4],['B4',4],['A4',4],
             ['G#4',8],['A4',8]],
    bass:   [['A2',8],['A2',8],['F2',8],['E2',8],['A2',8],['F2',8],['G2',8],['E2',8]],
    drums: 'k---k---k---k-s-'
  },
  fim: {
    bpm: 70, wave: 'triangle', bassWave: 'triangle', vol: 0.16,
    melody: [['C5',8],['E5',8],['G5',8],['E5',8],['F5',8],['E5',8],['D5',8],['C5',8]],
    bass:   [['C3',16],['G2',16],['F2',16],['G2',16]],
    drums: '----------------'
  }
};

function expand(seq) {
  const map = new Map();
  let pos = 0;
  for (const [note, len] of seq) {
    if (note) map.set(pos, { f: freq(note), steps: len });
    pos += len;
  }
  return { map, length: pos };
}

const COMPILED = {};
for (const k in THEMES) {
  const t = THEMES[k];
  COMPILED[k] = { def: t, mel: expand(t.melody), bass: expand(t.bass) };
}

let current = null, curName = '', step = 0, nextTime = 0, timer = null;

function stepDur() { return 60 / current.def.bpm / 4; }

function scheduler() {
  if (!current || !actx) return;
  const ahead = actx.currentTime + 0.25;
  while (nextTime < ahead) {
    const d = stepDur();
    const mel = current.mel.map.get(step % current.mel.length);
    if (mel) tone(musicGain, mel.f, nextTime, mel.steps * d * 0.9, current.def.wave, current.def.vol);
    const bs = current.bass.map.get(step % current.bass.length);
    if (bs) tone(musicGain, bs.f, nextTime, bs.steps * d * 0.9, current.def.bassWave, current.def.vol * 0.85);
    const dr = current.def.drums[step % current.def.drums.length];
    if (dr === 'k') tone(musicGain, 110, nextTime, 0.12, 'sine', 0.30, 40);
    else if (dr === 'h') noise(musicGain, nextTime, 0.04, 0.06, 6000);
    else if (dr === 's') { noise(musicGain, nextTime, 0.12, 0.13, 1500); }
    nextTime += d;
    step++;
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

export function stopMusic() {
  if (timer) { clearInterval(timer); timer = null; }
  current = null; curName = '';
}

export function currentMusic() { return curName; }

/** volume da musica (0..1) - usado para "baixar o som" no fim */
export function musicVolume(v) {
  if (musicGain && actx) musicGain.gain.setTargetAtTime(v, actx.currentTime, 0.3);
}

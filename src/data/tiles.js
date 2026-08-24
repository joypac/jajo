/* ============================================================
   tiles.js - os quadrados de 16x16 que formam os mapas
   Cada tile: { frames:[canvas...], solid:bool, tall:bool, encounter:bool }
   ============================================================ */
import { paint } from '../engine/sprites.js';

const T = 16;
// ruido deterministico (o mesmo tile desenha sempre igual)
function n(i, j, s) { const v = Math.sin((i * 12.9898 + j * 78.233 + (s || 0) * 4.13)) * 43758.5453; return v - Math.floor(v); }

function speckled(base, dark, light) {
  return paint(T, T, (px) => {
    px(0, 0, T, T, base);
    for (let y = 0; y < T; y += 2) for (let x = 0; x < T; x += 2) {
      const r = n(x, y, 1);
      if (r > 0.82) px(x, y, 2, 1, dark);
      else if (r < 0.10) px(x, y, 1, 2, light);
    }
  });
}

function grassTile(base, dark, light, blades) {
  return paint(T, T, (px) => {
    px(0, 0, T, T, base);
    for (let y = 0; y < T; y += 4) for (let x = 0; x < T; x += 4) {
      const r = n(x, y, 2);
      if (r > 0.6) { px(x + 1, y + 1, 2, 1, dark); px(x + 2, y + 2, 1, 1, dark); }
      if (blades && r < 0.25) { px(x + 2, y, 1, 3, light); px(x + 3, y + 1, 1, 2, light); }
      if (!blades && r < 0.15) px(x + 1, y + 2, 2, 1, light);
    }
  });
}

const grass = grassTile('#4d9c58', '#3d8449', '#63b46b', false);
const grassFlor = paint(T, T, (px, x) => {
  x.drawImage(grass, 0, 0);
  px(4, 5, 2, 2, '#f2e46a'); px(3, 4, 1, 1, '#fff3b0'); px(6, 6, 1, 1, '#fff3b0');
  px(11, 11, 2, 2, '#e8709c'); px(10, 10, 1, 1, '#ffc0d4');
});
const relvaEscura = grassTile('#2f7a4a', '#22603a', '#48a163', true);

const caminho = speckled('#c9a97a', '#b0906a', '#ddc294');
const pedraChao = speckled('#6e6e88', '#5a5a72', '#8b8ba0');
const chaoFinal = grassTile('#5c8f6a', '#4a7757', '#74a67f', false);

const parede = paint(T, T, (px) => {
  px(0, 0, T, T, '#3a3550');
  px(0, 0, T, 2, '#4a4468'); px(0, 14, T, 2, '#282342');
  px(7, 0, 2, T, '#282342');
});

const vazio = paint(T, T, (px) => px(0, 0, T, T, '#0b0b16'));

function arvoreTile(dark, mid, light, trunk) {
  return paint(T, T, (px) => {
    px(0, 0, T, T, dark);
    for (let y = 0; y < T; y += 3) for (let x = 0; x < T; x += 3) {
      const r = n(x, y, 5);
      if (r > 0.45) px(x, y, 3, 2, mid);
      if (r > 0.88) px(x + 1, y, 2, 2, light);
    }
    px(0, 0, T, 1, '#1b3d26'); px(0, 15, T, 1, '#1b3d26');
    px(6, 12, 3, 4, trunk);
  });
}
const arvore = arvoreTile('#256b34', '#2f8040', '#43a355', '#4a3320');
const arvoreFloresta = arvoreTile('#1d5233', '#26653e', '#357c4d', '#3b2a1c');

function aguaFrame(off) {
  return paint(T, T, (px) => {
    px(0, 0, T, T, '#2f7fd0');
    px(0, 0, T, 3, '#3c92e0');
    for (let y = 2; y < T; y += 4) {
      const x = ((y * 3 + off * 4) % T);
      px(x, y, 4, 1, '#7fc4f2');
      px((x + 8) % T, y + 2, 3, 1, '#2266ad');
    }
  });
}

export const TILES = {
  '.': { frames: [grass], solid: false },
  ',': { frames: [grassFlor], solid: false },
  '=': { frames: [caminho], solid: false },
  'D': { frames: [relvaEscura], solid: false, encounter: true },
  'S': { frames: [pedraChao], solid: false },
  'G': { frames: [chaoFinal], solid: false },
  '#': { frames: [arvore], solid: true },
  'T': { frames: [arvoreFloresta], solid: true },
  'W': { frames: [parede], solid: true },
  '~': { frames: [aguaFrame(0), aguaFrame(1), aguaFrame(2), aguaFrame(3)], solid: true },
  'V': { frames: [vazio], solid: true }
};

export const DEFAULT_TILE = TILES['V'];

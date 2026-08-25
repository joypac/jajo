/* ============================================================
   tiles.js - o chão e as paredes (16x16)
   ============================================================ */
import { paint } from '../engine/sprites.js';
const T = 16;
function n(i, j, s) { const v = Math.sin(i * 12.9898 + j * 78.233 + (s || 0) * 4.13) * 43758.5453; return v - Math.floor(v); }

const chaoLoja = paint(T, T, (px) => {
  px(0, 0, T, T, '#eae3d7');
  px(0, 0, 8, 8, '#e5ddd0'); px(8, 8, 8, 8, '#e5ddd0');
  px(0, 0, T, 1, '#f0ebe1'); px(0, 8, T, 1, '#f0ebe1');
  px(0, 0, 1, T, '#f0ebe1'); px(8, 0, 1, T, '#f0ebe1');
});

const paredeLoja = paint(T, T, (px) => {
  px(0, 0, T, T, '#c8b9d8');
  px(0, 0, T, 3, '#d8cbe6');
  px(0, 13, T, 3, '#a898c0');
  for (let y = 4; y < 13; y += 4) px(0, y, T, 1, '#b8a8cc');
});

const passeio = paint(T, T, (px) => {
  px(0, 0, T, T, '#b8b4ae');
  px(0, 0, T, 1, '#c9c5bf'); px(0, 0, 1, T, '#c9c5bf');
  px(7, 0, 1, T, '#a5a19b'); px(0, 7, T, 1, '#a5a19b');
});

const asfalto = paint(T, T, (px) => {
  px(0, 0, T, T, '#4c4a52');
  for (let y = 0; y < T; y += 2) for (let x = 0; x < T; x += 2) {
    const r = n(x, y, 3);
    if (r > 0.85) px(x, y, 2, 1, '#57555e');
    else if (r < 0.12) px(x, y, 1, 1, '#414047');
  }
});

const passadeira = paint(T, T, (px) => {
  px(0, 0, T, T, '#4c4a52');
  px(0, 2, T, 5, '#e8e4dc');
  px(0, 10, T, 5, '#e8e4dc');
});

const chaoCafe = paint(T, T, (px) => {
  px(0, 0, T, T, '#3f3a4c');
  for (let y = 0; y < T; y += 8) for (let x = 0; x < T; x += 8) {
    const claro = ((x / 8) + (y / 8)) % 2 === 0;
    px(x, y, 8, 8, claro ? '#4a4458' : '#332f42');
  }
});

const paredeCafe = paint(T, T, (px) => {
  px(0, 0, T, T, '#2f6b5c');
  px(0, 0, T, 3, '#3f8271');
  px(0, 13, T, 3, '#245348');
});

const vazio = paint(T, T, (px) => px(0, 0, T, T, '#14111f'));

export const TILES = {
  'F': { frames: [chaoLoja], solid: false, loja: true, chao: true },
  'W': { frames: [paredeLoja], solid: true },
  'P': { frames: [passeio], solid: false, rua: true },
  'A': { frames: [asfalto], solid: false, rua: true },
  'X': { frames: [passadeira], solid: false, rua: true },
  'C': { frames: [chaoCafe], solid: false, cafe: true },
  'V': { frames: [paredeCafe], solid: true },
  '.': { frames: [vazio], solid: true }
};
export const DEFAULT_TILE = TILES['.'];

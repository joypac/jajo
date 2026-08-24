/* ============================================================
   sprites.js (dados) - toda a arte do jogo
   Muda cores/formas aqui para mudar o aspeto do jogo.
   ============================================================ */
import { makeSprite, paint } from '../engine/sprites.js';

/* ---------- helpers de pintura ---------- */
function disc(px, cx, cy, r, color) {
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(Math.max(0, r * r - y * y)));
    px(cx - w, cy + y, w * 2 + 1, 1, color);
  }
}
function ring(px, cx, cy, r, color) {
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(Math.max(0, r * r - y * y)));
    px(cx - w, cy + y, 1, 1, color);
    px(cx + w, cy + y, 1, 1, color);
    if (y === -r || y === r) px(cx - w, cy + y, w * 2 + 1, 1, color);
  }
}

/* ============================================================
   PERSONAGENS
   Um unico molde em "ASCII art" serve para toda a gente:
   basta trocar as cores.  O = contorno, H = cabelo, S = pele,
   C = camisola, P = calcas, W = sapatos, e = olho, m = boca.
   ============================================================ */

const BODY_DOWN = [
  '................',
  '....OOOOOO......',
  '...OHHHHHHO.....',
  '..OHHhhhhHHO....',
  '..OHSSSSSSHO....',
  '..OSeSSSSeSO....',
  '..OSSSSSSSSO....',
  '..OSSSmmSSSO....',
  '...OSSSSSSO.....',
  '..OCCCCCCCCO....',
  '..OCCCCCCCCO....',
  '.OSCCCCCCCCSO...',
  '..OCCCCCCCCO....',
  '..OPPPPPPPPO....'
];

const BODY_UP = [
  '................',
  '....OOOOOO......',
  '...OHHHHHHO.....',
  '..OHHhhhhHHO....',
  '..OHHHHHHHHO....',
  '..OHHHHHHHHO....',
  '..OHHHHHHHHO....',
  '..OHHHHHHHHO....',
  '...OSSSSSSO.....',
  '..OCCCCCCCCO....',
  '..OCCCCCCCCO....',
  '.OSCCCCCCCCSO...',
  '..OCCCCCCCCO....',
  '..OPPPPPPPPO....'
];

const BODY_SIDE = [
  '................',
  '....OOOOO.......',
  '...OHHHHHO......',
  '..OHHhhhHHO.....',
  '..OHHSSSSSO.....',
  '..OHHSeSSSO.....',
  '..OHSSSSSSO.....',
  '..OHSSSSmmO.....',
  '...OSSSSSO......',
  '...OCCCCCO......',
  '..OCCCCCCO......',
  '..OCCCCCCSO.....',
  '..OCCCCCCO......',
  '..OPPPPPPO......'
];

// pares de linhas das pernas: [parado, passo A, passo B]
const LEGS_FRONT = [
  ['...PPP..PPP.....', '...WWW..WWW.....'],
  ['..PPPP...PP.....', '..WWW....WW.....'],
  ['...PP...PPPP....', '...WW....WWW....']
];
const LEGS_SIDE = [
  ['...PPPPPP.......', '...WWW.WWW......'],
  ['..PPP..PPP......', '..WWW...WWW.....'],
  ['....PPPP........', '....WWWW........']
];

/** Cria os 9 sprites (3 direcoes x 3 poses) de uma personagem. */
export function makeCharacter(c) {
  const pal = {
    O: c.line || '#241a2b',
    H: c.hair, h: c.hair2 || c.hair,
    S: c.skin || '#f2c79a',
    e: c.eye || '#241a2b',
    m: c.mouth || '#b06a5a',
    C: c.shirt, P: c.pants || '#39406e', W: c.shoes || '#2a2436'
  };
  const build = (body, legs) => legs.map(l => makeSprite(body.concat(l), pal));
  return {
    down: build(BODY_DOWN, LEGS_FRONT),
    up: build(BODY_UP, LEGS_FRONT),
    side: build(BODY_SIDE, LEGS_SIDE)
  };
}

/* ---------- elenco ---------- */
export const CHARS = {
  bernardo: makeCharacter({ hair: '#4a3323', hair2: '#63432c', shirt: '#4f86e0', pants: '#39406e' }),
  aldeao1:  makeCharacter({ hair: '#b9b9c9', hair2: '#d7d7e2', shirt: '#59a45c', pants: '#4a4a63', skin: '#e8b98c' }),
  aldeao2:  makeCharacter({ hair: '#d0682f', hair2: '#e88a4a', shirt: '#8a5fc0', pants: '#3a3a5c' }),
  aldeao3:  makeCharacter({ hair: '#2a2233', hair2: '#443a52', shirt: '#c9484f', pants: '#43364f', skin: '#c98d63' }),
  lojista:  makeCharacter({ hair: '#5a3a22', hair2: '#7a5233', shirt: '#c9a04a', pants: '#5a4630', skin: '#f0c79c' }),
  sabio:    makeCharacter({ hair: '#eef0f5', hair2: '#ffffff', shirt: '#6f7bd6', pants: '#4a5290', skin: '#e5c0a0' })
};

/* ---------- galinha ---------- */
const CHICK_PAL = { O: '#2b2030', W: '#f6f2e2', R: '#d84a4a', Y: '#f2b134', p: '#2b2030' };
const CHICK_TOP = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '........RR......',
  '.......ORRO.....',
  '......OWWWO.....',
  '......OWpWOY....',
  '.....OWWWWO.....',
  '....OWWWWWWO....',
  '...OWWWWWWWWO...',
  '...OWWWWWWWWO...',
  '...OWWWWWWWWO...',
  '....OWWWWWWO....'
];
export const CHICKEN = [
  makeSprite(CHICK_TOP.concat(['....OYO..OYO....']), CHICK_PAL),
  makeSprite(CHICK_TOP.concat(['...OYO....OYO...']), CHICK_PAL)
];

/* ---------- o JAJO ---------- */
const JAJO_ROWS = [
  '................',
  '...OO......OO...',
  '..OJJO....OJJO..',
  '..OJJJOOOOJJJO..',
  '.OJJJJJJJJJJJJO.',
  '.OJJJJJJJJJJJJO.',
  '.OJwwJJJJJJwwJO.',
  '.OJwpJJJJJJpwJO.',
  '.OJwwJJJJJJwwJO.',
  '.OJJJJJnnJJJJJO.',
  '.OJJJJJJJJJJJJO.',
  '.OJJJJJJJJJJJJO.',
  '..OJJJJJJJJJJO..',
  '..OJJJJJJJJJJO..',
  '...OOJJOOJJOO...',
  '....OOOOOOOO....'
];
const JAJO_PAL = { O: '#2b1f33', J: '#ffd98a', w: '#ffffff', p: '#2b1f33', n: '#d4693f' };
export const JAJO = makeSprite(JAJO_ROWS, JAJO_PAL);
export const JAJO_BIG = paint(64, 64, (px, x) => { x.imageSmoothingEnabled = false; x.drawImage(JAJO, 0, 0, 16, 16, 0, 0, 64, 64); });

/* ============================================================
   CENARIO
   ============================================================ */

export const PROPS = {};

PROPS.casa = paint(48, 48, (px) => {
  px(6, 4, 36, 4, '#6d2634');
  px(4, 8, 40, 4, '#a8434f');
  px(2, 12, 44, 4, '#a8434f');
  px(0, 16, 48, 4, '#8f3844');
  px(6, 6, 34, 2, '#c25a66');
  px(4, 20, 40, 24, '#e0c79c');
  px(4, 20, 40, 2, '#b39a70');
  px(4, 42, 40, 4, '#6b4f36');
  px(2, 20, 2, 24, '#6b4f36');
  px(44, 20, 2, 24, '#6b4f36');
  px(20, 28, 10, 16, '#7a4d2e');
  px(20, 28, 10, 2, '#5c3720');
  px(27, 36, 2, 2, '#f2c14e');
  px(8, 24, 8, 8, '#4a5c8c'); px(9, 25, 6, 6, '#7fd4ef');
  px(34, 24, 8, 8, '#4a5c8c'); px(35, 25, 6, 6, '#7fd4ef');
  px(12, 24, 1, 8, '#4a5c8c'); px(38, 24, 1, 8, '#4a5c8c');
});

PROPS.loja = paint(48, 40, (px) => {
  px(4, 12, 40, 24, '#d8c49a');
  px(4, 12, 40, 2, '#a89070');
  px(2, 34, 44, 4, '#5c4632');
  px(0, 6, 48, 6, '#4a3a56');
  for (let i = 0; i < 8; i++) px(i * 6, 6, 3, 6, '#e0e0ee');
  px(0, 12, 48, 2, '#332942');
  px(19, 20, 10, 16, '#6b4a30');
  px(19, 20, 10, 2, '#4a3220');
  px(26, 28, 2, 2, '#f2c14e');
  px(6, 18, 9, 8, '#3d4a70'); px(7, 19, 7, 6, '#8fd8ef');
  px(33, 18, 9, 8, '#3d4a70'); px(34, 19, 7, 6, '#8fd8ef');
  px(14, 0, 20, 8, '#f2e4c0'); px(14, 0, 20, 1, '#a89070'); px(14, 7, 20, 1, '#a89070');
  px(17, 3, 2, 2, '#3a2f4a'); px(21, 3, 2, 2, '#3a2f4a'); px(25, 3, 2, 2, '#3a2f4a'); px(29, 3, 2, 2, '#3a2f4a');
});

PROPS.fonte = paint(32, 32, (px) => {
  px(2, 14, 28, 14, '#9a9ab0');
  px(4, 12, 24, 2, '#b6b6c9');
  px(2, 26, 28, 4, '#6e6e88');
  px(5, 16, 22, 9, '#2f7fd0');
  px(5, 16, 22, 2, '#57a9ec');
  px(13, 4, 6, 12, '#b6b6c9');
  px(11, 2, 10, 3, '#d0d0e0');
  px(15, 0, 2, 3, '#8fd8ef');
  px(9, 18, 2, 2, '#8fd8ef'); px(21, 20, 2, 2, '#8fd8ef');
  px(2, 14, 28, 1, '#d0d0e0');
});

function treeSprite(w, h, leaf, leafDark, leafLight, trunk) {
  return paint(w, h, (px) => {
    const cx = (w / 2) | 0;
    px(cx - 3, h - 14, 6, 14, trunk);
    px(cx - 3, h - 14, 2, 14, '#4a3320');
    disc(px, cx, h - 22, 12, leafDark);
    disc(px, cx, h - 23, 11, leaf);
    disc(px, cx - 4, h - 26, 5, leafLight);
    px(cx + 2, h - 28, 3, 2, leafLight);
  });
}
PROPS.arvore = treeSprite(32, 40, '#3f8f4a', '#2c6b38', '#59ad5c', '#6b4a2e');
PROPS.arvoreEscura = treeSprite(32, 44, '#2f6b46', '#1f4a32', '#3f8a58', '#4a3524');

/* a arvore que fala tem cara */
PROPS.arvoreFala = paint(32, 48, (px) => {
  px(13, 32, 8, 16, '#6b4a2e');
  px(13, 32, 3, 16, '#4a3320');
  disc(px, 16, 20, 14, '#255c3a');
  disc(px, 16, 19, 13, '#357a48');
  disc(px, 11, 14, 5, '#4a9c5c');
  px(9, 16, 5, 6, '#f6f2e2'); px(18, 16, 5, 6, '#f6f2e2');
  px(11, 18, 2, 3, '#241a2b'); px(20, 18, 2, 3, '#241a2b');
  px(12, 26, 8, 3, '#241a2b'); px(13, 25, 6, 1, '#241a2b');
});

PROPS.pedra = paint(16, 16, (px) => {
  px(2, 6, 12, 8, '#8b8ba0'); px(3, 4, 10, 3, '#a4a4bb');
  px(2, 12, 12, 2, '#63637c'); px(5, 6, 3, 2, '#c0c0d4');
});

PROPS.arbusto = paint(16, 16, (px) => {
  disc(px, 8, 10, 6, '#2c6b38'); disc(px, 8, 9, 5, '#3f8f4a');
  px(5, 6, 2, 2, '#59ad5c'); px(10, 8, 2, 2, '#59ad5c');
});

PROPS.placa = paint(16, 16, (px) => {
  px(7, 8, 2, 8, '#6b4a2e');
  px(1, 2, 14, 8, '#a87a4a'); px(1, 2, 14, 1, '#c99a68'); px(1, 9, 14, 1, '#6b4a2e');
  px(3, 4, 10, 1, '#4a3320'); px(3, 6, 7, 1, '#4a3320');
});

PROPS.cerca = paint(32, 16, (px) => {
  for (const x of [1, 9, 17, 25]) { px(x, 2, 4, 14, '#a87a4a'); px(x, 2, 1, 14, '#6b4a2e'); }
  px(0, 5, 32, 3, '#8a6238'); px(0, 11, 32, 3, '#8a6238');
});

PROPS.nevoeiro = paint(32, 16, (px) => {
  px(0, 4, 32, 9, 'rgba(210,214,240,0.55)');
  px(2, 2, 12, 4, 'rgba(230,232,250,0.5)');
  px(16, 10, 14, 5, 'rgba(230,232,250,0.45)');
});

PROPS.brilho = paint(8, 8, (px) => {
  px(3, 0, 2, 8, '#fff3b0'); px(0, 3, 8, 2, '#fff3b0');
  px(2, 2, 4, 4, '#ffffff');
});

/* ============================================================
   INIMIGOS
   ============================================================ */
export const ENEMY_SPRITES = {};

ENEMY_SPRITES.ansiedade = paint(48, 48, (px) => {
  disc(px, 24, 26, 17, '#3a2158');
  disc(px, 24, 25, 15, '#5b3390');
  disc(px, 19, 18, 6, '#7a4fc0');
  px(11, 20, 9, 10, '#f6f2e2'); px(28, 20, 9, 10, '#f6f2e2');
  px(15, 24, 4, 5, '#241a2b'); px(30, 24, 4, 5, '#241a2b');
  px(16, 36, 16, 4, '#241a2b');
  for (let i = 0; i < 8; i++) px(17 + i * 2, 36 + (i % 2 ? -2 : 2), 2, 2, '#241a2b');
  px(6, 8, 2, 6, '#ffd447'); px(40, 8, 2, 6, '#ffd447');
  px(2, 22, 6, 2, '#ffd447'); px(40, 22, 6, 2, '#ffd447');
});

ENEMY_SPRITES.overthinking = paint(48, 48, (px) => {
  disc(px, 24, 26, 18, '#4a3a6b');
  disc(px, 24, 25, 16, '#6f5c9c');
  disc(px, 12, 30, 8, '#6f5c9c'); disc(px, 36, 30, 8, '#6f5c9c');
  for (let a = 0; a < 26; a++) {
    const r = 3 + a * 0.42, an = a * 0.75;
    px(24 + Math.cos(an) * r, 22 + Math.sin(an) * r * 0.8, 2, 2, '#d8c9ff');
  }
  px(14, 16, 4, 4, '#f6f2e2'); px(15, 17, 2, 2, '#241a2b');
  px(30, 14, 4, 4, '#f6f2e2'); px(31, 15, 2, 2, '#241a2b');
  px(22, 38, 4, 4, '#f6f2e2'); px(23, 39, 2, 2, '#241a2b');
});

ENEMY_SPRITES.faltaResposta = paint(48, 48, (px) => {
  px(9, 4, 30, 40, '#2b2b3d');
  px(11, 8, 26, 30, '#8f96b8');
  px(11, 8, 26, 30, '#7a82a8');
  px(13, 10, 22, 26, '#aab1cf');
  px(20, 40, 8, 2, '#5a5a72');
  px(17, 20, 4, 4, '#2b2b3d'); px(23, 20, 4, 4, '#2b2b3d'); px(29, 20, 4, 4, '#2b2b3d');
  px(15, 12, 18, 4, '#d8dcf0');
  px(9, 4, 30, 2, '#5a5a72'); px(9, 42, 30, 2, '#5a5a72');
});

ENEMY_SPRITES.drama = paint(48, 48, (px) => {
  disc(px, 24, 26, 18, '#8a2350');
  disc(px, 24, 25, 16, '#d43f7a');
  px(8, 25, 32, 2, '#8a2350');
  px(13, 16, 8, 6, '#f6f2e2'); px(27, 16, 8, 6, '#f6f2e2');
  px(15, 18, 4, 4, '#241a2b'); px(29, 18, 4, 4, '#241a2b');
  px(30, 23, 2, 8, '#7fd4ef');
  px(16, 32, 16, 3, '#241a2b'); px(14, 30, 3, 3, '#241a2b'); px(31, 34, 3, 3, '#241a2b');
  px(20, 4, 8, 6, '#ffd447'); px(18, 8, 12, 3, '#ffd447');
});

ENEMY_SPRITES.boss = paint(64, 64, (px) => {
  px(14, 18, 36, 46, '#191430');
  px(18, 6, 28, 16, '#191430');
  disc(px, 32, 16, 15, '#191430');
  px(12, 30, 40, 34, '#221b3e');
  px(14, 18, 36, 46, 'rgba(0,0,0,0)');
  disc(px, 32, 18, 14, '#120e26');
  px(20, 20, 8, 6, '#ffd447'); px(36, 20, 8, 6, '#ffd447');
  px(22, 22, 4, 3, '#fff6c8'); px(38, 22, 4, 3, '#fff6c8');
  px(26, 40, 12, 4, '#4a3a6b'); px(28, 44, 8, 4, '#4a3a6b'); px(30, 48, 4, 8, '#4a3a6b');
  px(30, 58, 4, 4, '#4a3a6b');
  px(6, 34, 8, 20, '#191430'); px(50, 34, 8, 20, '#191430');
  px(12, 30, 4, 4, '#2e2450'); px(48, 30, 4, 4, '#2e2450');
});

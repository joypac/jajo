/* ============================================================
   sprites.js - toda a arte do jogo (pixel art em código)
   ============================================================ */
import { makeSprite, paint } from '../engine/sprites.js';

function disc(px, cx, cy, r, color) {
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(Math.max(0, r * r - y * y)));
    px(cx - w, cy + y, w * 2 + 1, 1, color);
  }
}

/* ============================================================
   PERSONAGENS - um molde, muitas cores
   O contorno, H cabelo, S pele, C camisola, P calças, W sapatos
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

/* cabelo comprido: desenhado por cima, para as personagens femininas */
function longHair(cv, hair, dark, dir) {
  const x = cv.getContext('2d');
  const px = (a, b, w, h, c) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
  if (dir === 'side') {
    px(2, 6, 3, 7, hair); px(2, 6, 1, 7, dark);
  } else {
    px(1, 4, 2, 8, hair); px(13, 4, 2, 8, hair);
    px(1, 4, 1, 8, dark); px(14, 4, 1, 8, dark);
    px(1, 11, 2, 2, dark); px(13, 11, 2, 2, dark);
  }
  return cv;
}

function glassesOn(cv, dir) {
  const x = cv.getContext('2d');
  const px = (a, b, w, h, c) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
  const F = '#2b2438', L = '#bfe6f5';
  if (dir === 'side') {
    px(4, 4, 6, 1, F); px(4, 5, 1, 3, F); px(9, 5, 1, 3, F); px(5, 5, 4, 3, L);
    px(6, 5, 1, 3, F);
  } else {
    px(2, 4, 12, 1, F);
    px(2, 5, 4, 3, L); px(9, 5, 4, 3, L);
    px(2, 5, 1, 3, F); px(5, 5, 1, 3, F); px(9, 5, 1, 3, F); px(12, 5, 1, 3, F);
    px(2, 8, 4, 1, F); px(9, 8, 4, 1, F);
    px(6, 6, 3, 1, F);
  }
  return cv;
}

export function makeCharacter(c) {
  const pal = {
    O: c.line || '#241a2b', H: c.hair, h: c.hair2 || c.hair,
    S: c.skin || '#f2c79a', e: c.eye || '#241a2b', m: c.mouth || '#c0705f',
    C: c.shirt, P: c.pants || '#39406e', W: c.shoes || '#241f33'
  };
  const build = (body, legs, dir) => legs.map(l => {
    let cv = makeSprite(body.concat(l), pal);
    if (c.longHair) cv = longHair(cv, c.hair, c.hairDark || c.line || '#241a2b', dir);
    if (c.glasses && dir !== 'up') cv = glassesOn(cv, dir);
    return cv;
  });
  return {
    down: build(BODY_DOWN, LEGS_FRONT, 'down'),
    up: build(BODY_UP, LEGS_FRONT, 'up'),
    side: build(BODY_SIDE, LEGS_SIDE, 'side')
  };
}

/* ---------- elenco ---------- */
export const CHARS = {
  andreia: makeCharacter({
    hair: '#332639', hair2: '#54405e', hairDark: '#1d1524',
    shirt: '#38334d', pants: '#232130', shoes: '#15131d',
    skin: '#f6cfa8', glasses: true, longHair: true
  }),
  sonia: makeCharacter({
    hair: '#6b4a2e', hair2: '#8a6238', hairDark: '#4a3220',
    shirt: '#4a7f8f', pants: '#33384f', skin: '#eec092', longHair: true
  })
};

/* clientes: variedade de cores, gerados a partir do mesmo molde */
const CLIENT_PALETTES = [
  { hair: '#3a2a1e', shirt: '#c9584f', pants: '#3f4360', skin: '#f0c096' },
  { hair: '#b9b9c9', shirt: '#5b8f5c', pants: '#4a4a63', skin: '#e8bb8c', hair2: '#d8d8e4' },
  { hair: '#d0682f', shirt: '#7f5fc0', pants: '#3a3a5c', skin: '#f2caa4', longHair: true },
  { hair: '#241d2b', shirt: '#e0a63f', pants: '#464056', skin: '#c9895f' },
  { hair: '#5a3a22', shirt: '#3f8f9c', pants: '#5a4630', skin: '#f0c79c', longHair: true },
  { hair: '#7a2f4a', shirt: '#f0f0f4', pants: '#2f3550', skin: '#e5b087', longHair: true },
  { hair: '#2a4a2a', shirt: '#d97ea8', pants: '#43364f', skin: '#f3c9a2' },
  { hair: '#8a8a9c', shirt: '#6f7bd6', pants: '#4a5290', skin: '#d8a373', glasses: true }
];
export const CLIENTS = CLIENT_PALETTES.map(p => makeCharacter(p));

/* Sónia sentada, com ventoinha */
export const SONIA_SIT = [0, 1].map(f => paint(16, 20, (px) => {
  px(4, 3, 8, 4, '#6b4a2e'); px(3, 5, 10, 6, '#6b4a2e'); px(3, 5, 2, 6, '#4a3220');
  px(5, 6, 6, 5, '#eec092');
  px(6, 8, 1, 1, '#241a2b'); px(9, 8, 1, 1, '#241a2b');
  px(7, 10, 2, 1, '#c0705f');
  px(4, 11, 8, 7, '#4a7f8f'); px(4, 11, 8, 1, '#63a0b0');
  px(2, 12, 2, 5, '#4a7f8f'); px(12, 12, 2, 4, '#4a7f8f');
  px(3, 17, 10, 3, '#33384f');
  // ventoinha na mão
  const fx = 13, fy = 10 - f;
  px(fx, fy + 2, 1, 4, '#8a8a9c');
  px(fx - 2 + f, fy, 5 - f * 2, 2, '#cfe6f5');
  px(fx - 1, fy - 1, 3, 4, '#9fd4ea');
}));

/* ============================================================
   MEIAS
   ============================================================ */
const SOCK_ROWS = [
  '..OOOO....',
  '..OwwO....',
  '..OwwO....',
  '..OCCO....',
  '..OCCO....',
  '..OCCO....',
  '..OCCOOO..',
  '..OCCCCCO.',
  '..OCCCCCCO',
  '...OOOOOOO'
];
export function makeSock(cor, punho) {
  return makeSprite(SOCK_ROWS, { O: '#2b2438', C: cor, w: punho || cor });
}
/* a mesma meia, é só usada em tamanhos diferentes */
export function makeSockBig(cor, punho) { return makeSock(cor, punho); }

/* ============================================================
   MOBÍLIA E CENÁRIO
   ============================================================ */
export const PROPS = {};

/* prateleira de meias: 3 estados de arrumação */
function prateleira(estado) {
  return paint(48, 32, (px) => {
    px(0, 4, 48, 28, '#8a6a4a');
    px(0, 4, 48, 2, '#a8845e');
    px(0, 30, 48, 2, '#5c4530');
    px(1, 6, 46, 11, '#e8dcc8');
    px(1, 18, 46, 11, '#e8dcc8');
    px(0, 16, 48, 2, '#6b5138');
    const cores = ['#2b2438', '#f2eee4', '#e0577f', '#4a7fd0', '#5fbf7f', '#f0b03f'];
    for (let fila = 0; fila < 2; fila++) {
      for (let i = 0; i < 7; i++) {
        const cor = cores[(i + fila * 3) % cores.length];
        let x = 2 + i * 6.6, y = 7 + fila * 12, h = 9;
        if (estado === 1 && i % 3 === 0) { y += 2; h -= 2; }
        if (estado === 2) {
          if (i % 2 === 0) continue;
          x += (i % 3) - 1; y += (i % 2) * 3; h -= 2;
        }
        px(x, y, 5, h, cor);
        px(x, y, 5, 2, '#f8f4ea');
        px(x, y, 1, h, 'rgba(0,0,0,.25)');
      }
    }
    if (estado === 2) { px(6, 29, 6, 3, '#e0577f'); px(30, 29, 5, 3, '#4a7fd0'); }
  });
}
PROPS.prateleira = [prateleira(0), prateleira(1), prateleira(2)];

PROPS.balcao = paint(80, 32, (px) => {
  px(0, 8, 80, 24, '#7a5638');
  px(0, 8, 80, 3, '#a8845e');
  px(0, 29, 80, 3, '#553a24');
  px(4, 12, 72, 14, '#6b4a30');
  for (let i = 0; i < 5; i++) px(6 + i * 15, 14, 12, 10, '#5c3f28');
  // registadora
  px(52, 0, 22, 10, '#3c4a63'); px(52, 0, 22, 2, '#586a8c');
  px(55, 2, 16, 5, '#9fd4ea');
  px(52, 10, 22, 3, '#2a3448');
  px(56, 5, 3, 2, '#f8f4ea'); px(62, 5, 3, 2, '#f8f4ea');
  // pilha de meias no balcão
  px(8, 2, 12, 3, '#e0577f'); px(8, 5, 12, 3, '#4a7fd0');
  px(24, 4, 10, 4, '#f2eee4');
});

PROPS.secretaria = paint(48, 36, (px) => {
  px(0, 14, 48, 20, '#6b5138');
  px(0, 14, 48, 3, '#8a6a4a');
  px(2, 32, 6, 4, '#4a3826'); px(40, 32, 6, 4, '#4a3826');
  // monitor
  px(12, 0, 26, 16, '#2a2438');
  px(14, 2, 22, 11, '#7fd4ef');
  px(16, 4, 12, 2, '#f8f4ea'); px(16, 7, 16, 1, '#cfe6f5'); px(16, 9, 9, 1, '#cfe6f5');
  px(22, 16, 6, 3, '#2a2438'); px(18, 19, 14, 2, '#3c3550');
  // teclado
  px(10, 22, 28, 6, '#cfc8dc'); px(12, 24, 24, 2, '#9a93b0');
});

PROPS.caixaStock = [0, 1].map(aberta => paint(20, 18, (px) => {
  px(1, 4, 18, 14, '#b98b58');
  px(1, 4, 18, 2, '#d4a771');
  px(1, 16, 18, 2, '#8a6238');
  px(9, 6, 2, 12, '#8a6238');
  if (aberta) {
    px(0, 0, 8, 5, '#d4a771'); px(12, 0, 8, 5, '#d4a771');
    px(4, 2, 5, 4, '#e0577f'); px(11, 1, 5, 5, '#4a7fd0');
  } else {
    px(1, 2, 18, 3, '#d4a771');
    px(3, 8, 14, 2, '#8a6238');
  }
}));

PROPS.esfregona = paint(12, 24, (px) => {
  px(5, 0, 2, 16, '#b98b58');
  px(2, 15, 8, 6, '#cfc8dc');
  px(2, 19, 8, 3, '#9a93b0');
  px(1, 21, 10, 2, '#8a8a9c');
});
PROPS.balde = paint(16, 16, (px) => {
  px(2, 4, 12, 11, '#4a7fd0'); px(2, 4, 12, 2, '#6fa0e8');
  px(3, 6, 10, 4, '#7fd4ef');
  px(2, 13, 12, 2, '#2f5c9c');
  px(1, 3, 14, 1, '#9fd4ea');
});

PROPS.planta = paint(16, 24, (px) => {
  px(4, 16, 8, 8, '#a8563f'); px(4, 16, 8, 2, '#c46e4f');
  disc(px, 8, 11, 6, '#2f6b46'); disc(px, 8, 10, 5, '#3f8f5c');
  px(3, 6, 3, 4, '#4aa36b'); px(11, 5, 3, 5, '#4aa36b');
});

PROPS.porta = paint(32, 20, (px) => {
  px(0, 0, 32, 20, '#5c4530');
  px(2, 2, 28, 16, '#7fd4ef');
  px(2, 2, 28, 3, '#9fe6f5');
  px(15, 2, 2, 16, '#5c4530');
  px(4, 6, 10, 2, '#f8f4ea'); px(4, 10, 6, 1, '#f8f4ea');
});

/* letras 5x7 para os letreiros da rua */
const FONT5 = {
  A: ['.OOO.','O...O','O...O','OOOOO','O...O','O...O','O...O'],
  E: ['OOOOO','O....','O....','OOOO.','O....','O....','OOOOO'],
  I: ['OOOOO','..O..','..O..','..O..','..O..','..O..','OOOOO'],
  M: ['O...O','OO.OO','O.O.O','O...O','O...O','O...O','O...O'],
  N: ['O...O','OO..O','O.O.O','O.O.O','O..OO','O...O','O...O'],
  S: ['.OOOO','O....','O....','.OOO.','....O','....O','OOOO.'],
  V: ['O...O','O...O','O...O','O...O','O...O','.O.O.','..O..'],
  Z: ['OOOOO','....O','...O.','..O..','.O...','O....','OOOOO']
};
function escrever(px, texto, x, y, cor) {
  let cx = x;
  for (const ch of texto) {
    const g = FONT5[ch];
    if (!g) { cx += 3; continue; }
    for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (g[r][c] === 'O') px(cx + c, y + r, 1, 1, cor);
    cx += 6;
  }
  return cx - x - 1;
}

PROPS.letreiro = paint(64, 20, (px) => {
  px(0, 0, 64, 18, '#2b2438');
  px(2, 2, 60, 14, '#e0577f');
  px(2, 2, 60, 2, '#f08fb0');
  escrever(px, 'MEIAS', 18, 5, '#f8f4ea');
  px(5, 5, 9, 9, '#f8f4ea'); px(7, 7, 5, 5, '#e0577f');
  px(51, 5, 9, 9, '#f8f4ea'); px(53, 7, 5, 5, '#e0577f');
});

PROPS.venezia = paint(56, 20, (px) => {
  px(0, 0, 56, 18, '#2b2438');
  px(2, 2, 52, 14, '#3f7f6b');
  px(2, 2, 52, 2, '#5fa88f');
  escrever(px, 'VENEZIA', 8, 6, '#f8f4ea');
});

PROPS.mesaCafe = paint(24, 22, (px) => {
  disc(px, 12, 8, 10, '#8a6a4a');
  disc(px, 12, 7, 9, '#a8845e');
  px(10, 14, 4, 8, '#5c4530');
  px(7, 20, 10, 2, '#5c4530');
  px(8, 4, 5, 4, '#f8f4ea'); px(9, 5, 3, 2, '#6b4a2e');
});

PROPS.maquinaCafe = paint(28, 30, (px) => {
  px(0, 4, 28, 26, '#8a8a9c');
  px(0, 4, 28, 3, '#b0b0c4');
  px(3, 8, 22, 10, '#3c3550');
  px(5, 10, 8, 6, '#e0577f'); px(15, 10, 8, 6, '#4a7fd0');
  px(8, 20, 4, 6, '#5c5a70'); px(16, 20, 4, 6, '#5c5a70');
  px(6, 26, 8, 2, '#f8f4ea'); px(14, 26, 8, 2, '#f8f4ea');
  px(2, 0, 24, 4, '#6b6a80');
});

PROPS.balcaoCafe = paint(64, 26, (px) => {
  px(0, 6, 64, 20, '#7a5638');
  px(0, 6, 64, 3, '#a8845e');
  px(0, 23, 64, 3, '#553a24');
  px(4, 10, 56, 10, '#6b4a30');
  px(8, 0, 10, 6, '#f8f4ea'); px(9, 1, 8, 4, '#c9a06a');   // sandes
  px(26, 1, 8, 5, '#f8f4ea'); px(27, 2, 6, 3, '#6b4a2e');  // chávena
  px(44, 0, 12, 6, '#e0c9a0');
});

PROPS.sandes = paint(16, 12, (px) => {
  px(1, 2, 14, 3, '#e8c88a'); px(1, 2, 14, 1, '#f2dcae');
  px(1, 5, 14, 3, '#f0e2c0');
  px(2, 6, 12, 2, '#d8d8a8');
  px(1, 8, 14, 3, '#e8c88a');
  px(1, 8, 14, 1, '#d8b070');
});

PROPS.seta = [0, 1].map(f => paint(10, 10, (px) => {
  const o = f;
  px(4, 0 + o, 2, 6, '#ffc44d');
  px(2, 4 + o, 6, 2, '#ffc44d');
  px(3, 6 + o, 4, 2, '#ffc44d');
  px(4, 8 + o, 2, 2, '#ffc44d');
}));

PROPS.interrogacao = paint(10, 14, (px) => {
  px(2, 0, 6, 3, '#ffc44d');
  px(6, 2, 3, 4, '#ffc44d');
  px(4, 5, 4, 3, '#ffc44d');
  px(4, 8, 2, 2, '#ffc44d');
  px(4, 11, 3, 3, '#ffc44d');
});

PROPS.brilho = paint(8, 8, (px) => {
  px(3, 0, 2, 8, '#fff3b0'); px(0, 3, 8, 2, '#fff3b0'); px(2, 2, 4, 4, '#ffffff');
});

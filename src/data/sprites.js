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
  sabio:    makeCharacter({ hair: '#eef0f5', hair2: '#ffffff', shirt: '#6f7bd6', pants: '#4a5290', skin: '#e5c0a0' }),
  /* Fátima */
  padre:    makeCharacter({ hair: '#d8d8e4', hair2: '#f0f0f8', shirt: '#22202e', pants: '#22202e', shoes: '#15131f', skin: '#e8bd93' }),
  pastor1:  makeCharacter({ hair: '#8a5a2e', hair2: '#a87038', shirt: '#e0d2a8', pants: '#7a6242', skin: '#f0c79c' }),
  pastor2:  makeCharacter({ hair: '#4a3a2a', hair2: '#634a33', shirt: '#c9b48a', pants: '#6b5438', skin: '#e8b98c' }),
  pastor3:  makeCharacter({ hair: '#2e2620', hair2: '#463a2e', shirt: '#d8c4a0', pants: '#5c4a30', skin: '#d9a877' }),
  peregrino: makeCharacter({ hair: '#7a7a8c', hair2: '#9a9aac', shirt: '#8a9ab0', pants: '#4a5464', skin: '#e0b088' }),
  peregrina: makeCharacter({ hair: '#a34a6a', hair2: '#c46886', shirt: '#e0a0b8', pants: '#6a4a5c', skin: '#f0c79c' }),
  /* Caldas da Rainha */
  senhor:   makeCharacter({ hair: '#b0b0bc', hair2: '#d0d0dc', shirt: '#4a8a8a', pants: '#3a4a52', skin: '#e8bd93' }),
  ceramista: makeCharacter({ hair: '#3a2a44', hair2: '#553f60', shirt: '#c96a4a', pants: '#4a3a30', skin: '#d9a877' }),
  senhora:  makeCharacter({ hair: '#5a4030', hair2: '#7a5a42', shirt: '#7a9c5a', pants: '#4a4438', skin: '#f0c79c' }),
  /* outros */
  homemMonte: makeCharacter({ hair: '#2e2620', hair2: '#463a2e', shirt: '#c9b070', pants: '#5a4a34', skin: '#c98d63' }),
  figura:   makeCharacter({ hair: '#15131f', hair2: '#24202e', shirt: '#24202e', pants: '#1a1826', shoes: '#15131f', skin: '#6a6478', eye: '#ffd447', mouth: '#3a3448' })
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

PROPS.cogumelo = paint(16, 16, (px) => {
  px(6, 9, 4, 6, '#e8dcc0'); px(6, 9, 1, 6, '#c4b795');
  disc(px, 8, 8, 6, '#8f2f3f');
  disc(px, 8, 7, 5, '#c0424f');
  px(4, 5, 3, 2, '#f2e4c0'); px(10, 8, 2, 2, '#f2e4c0'); px(8, 3, 2, 2, '#f2e4c0');
  px(3, 13, 10, 2, '#3d8449');
});

/* ---------- HIBERNARDO ---------- */
function camaFrame(lift, zzz) {
  return paint(32, 32, (px) => {
    px(3, 8, 5, 22, '#8a6238'); px(3, 8, 5, 3, '#a87a4a');     // cabeceira
    px(26, 14, 4, 16, '#8a6238'); px(26, 14, 4, 2, '#a87a4a'); // pes da cama
    px(5, 14, 23, 14, '#e6dccb');                              // colchao
    px(5, 26, 23, 3, '#c0b49f');
    px(7, 15, 9, 7, '#ffffff'); px(7, 15, 9, 1, '#d8d0c0');    // almofada
    px(14, 16 - lift, 14, 11 + lift, '#4f86e0');               // cobertor
    px(14, 16 - lift, 14, 2, '#6fa0f0');
    px(18, 19 - lift, 8, 5, '#3c6cc0');                        // volume do corpo
    px(9, 16, 7, 6, '#f2c79a');                                // cabeca
    px(9, 15, 7, 2, '#4a3323');
    px(10, 19, 2, 1, '#241a2b'); px(13, 19, 2, 1, '#241a2b');  // olhos fechados
    px(11, 21, 3, 1, '#b06a5a');
    if (zzz) {
      px(17, 6, 5, 1, '#f6f2e2'); px(19, 7, 2, 1, '#f6f2e2'); px(17, 8, 5, 1, '#f6f2e2');
      px(23, 2, 3, 1, '#f6f2e2'); px(24, 3, 1, 1, '#f6f2e2'); px(23, 4, 3, 1, '#f6f2e2');
    } else {
      px(18, 4, 5, 1, '#f6f2e2'); px(20, 5, 2, 1, '#f6f2e2'); px(18, 6, 5, 1, '#f6f2e2');
    }
  });
}
PROPS.cama = camaFrame(0, true);
PROPS.camaFrames = [camaFrame(0, true), camaFrame(1, false)];

/* ---------- Fátima ---------- */
PROPS.igreja = paint(64, 64, (px) => {
  px(6, 22, 52, 40, '#f2efe4');                    // corpo
  px(6, 22, 52, 2, '#d0cabb');
  px(4, 58, 56, 4, '#c9c2b0');
  px(22, 6, 20, 20, '#f2efe4');                    // torre
  px(22, 6, 20, 2, '#d0cabb');
  px(20, 2, 24, 5, '#b8465a');                     // telhado da torre
  px(24, 0, 16, 3, '#8f3448');
  px(30, 10, 4, 8, '#3a3550'); px(31, 11, 2, 6, '#f2c14e');  // sino
  px(6, 20, 52, 3, '#b8465a');
  px(26, 36, 12, 26, '#6b4a2e');                   // porta em arco
  px(28, 32, 8, 6, '#6b4a2e');
  px(29, 34, 6, 24, '#8a6238');
  px(31, 48, 2, 2, '#f2c14e');
  px(14, 34, 8, 10, '#4a5c8c'); px(15, 35, 6, 8, '#8fd8ef');  // janelas
  px(42, 34, 8, 10, '#4a5c8c'); px(43, 35, 6, 8, '#8fd8ef');
  px(28, 24, 8, 8, '#4a5c8c'); px(29, 25, 6, 6, '#ffd447');   // roseacea
});

function velasFrame(f) {
  return paint(32, 24, (px) => {
    px(1, 16, 30, 7, '#9a9ab0'); px(1, 16, 30, 2, '#b6b6c9');
    for (let i = 0; i < 6; i++) {
      const x = 2 + i * 5, h = 6 + (i % 3);
      px(x, 16 - h, 3, h, '#f6f2e2');
      px(x, 16 - h, 1, h, '#d8d2c0');
      const fl = (i + f) % 2;
      px(x + 1, 16 - h - 3 - fl, 1, 3, '#ffd447');
      px(x + 1, 16 - h - 4 - fl, 1, 1, '#fff3b0');
    }
  });
}
PROPS.velas = velasFrame(0);
PROPS.velasFrames = [velasFrame(0), velasFrame(1)];

PROPS.multidao = paint(32, 24, (px) => {
  const heads = [[4, 10, '#4a3323'], [12, 6, '#b9b9c9'], [20, 9, '#d0682f'], [27, 7, '#2a2233']];
  for (const [x, y, hair] of heads) {
    px(x - 1, y + 6, 10, 18, '#3a4460');
    disc(px, x + 3, y + 3, 4, '#241a2b');
    disc(px, x + 3, y + 3, 3, hair);
  }
});

PROPS.paragem = paint(32, 40, (px) => {
  px(14, 12, 4, 28, '#6e6e88');
  px(2, 4, 28, 14, '#3a4a70'); px(2, 4, 28, 2, '#5a6c98');
  px(4, 7, 24, 2, '#f6f2e2'); px(4, 11, 16, 2, '#a9a6c4'); px(4, 14, 20, 1, '#a9a6c4');
  px(2, 16, 28, 2, '#222a44');
  px(10, 38, 12, 2, '#4a4a5c');
});

/* ---------- Caldas da Rainha ---------- */
PROPS.ceramica = paint(48, 32, (px) => {
  px(2, 22, 44, 4, '#8a6238'); px(2, 26, 44, 4, '#6b4a2e');   // banca
  disc(px, 10, 16, 6, '#3f8f8f'); px(8, 8, 4, 3, '#3f8f8f');  // jarro
  px(9, 10, 2, 4, '#57b0b0');
  disc(px, 24, 17, 5, '#c96a4a'); px(21, 12, 6, 2, '#c96a4a');// tacho
  px(22, 13, 2, 3, '#e08a68');
  px(33, 12, 10, 10, '#e0d2a8'); px(34, 13, 8, 8, '#f2e8cf'); // peca indescritivel
  px(36, 8, 3, 5, '#e0d2a8'); px(41, 10, 3, 3, '#e0d2a8');
  px(35, 16, 2, 2, '#8a5a34'); px(39, 16, 2, 2, '#8a5a34');
});

PROPS.maco = paint(16, 16, (px) => {
  px(4, 6, 8, 9, '#f2e8dc'); px(4, 6, 8, 3, '#b8465a');
  px(4, 6, 1, 9, '#d0c4b4'); px(5, 4, 3, 3, '#f6f2e2');
  px(5, 3, 1, 2, '#d8d2c0');
  px(6, 11, 4, 1, '#8a8a9c');
});

/* ---------- Alentejo ---------- */
PROPS.oliveira = paint(32, 40, (px) => {
  px(13, 24, 6, 16, '#6b5a44'); px(13, 24, 2, 16, '#4a3d2e');
  px(11, 30, 3, 6, '#6b5a44'); px(18, 28, 3, 8, '#6b5a44');
  disc(px, 16, 18, 12, '#5c7a52');
  disc(px, 16, 17, 10, '#7d9c6a');
  disc(px, 11, 13, 5, '#96b585');
  px(20, 10, 3, 2, '#96b585');
});

PROPS.placaAlentejo = paint(48, 40, (px) => {
  px(10, 22, 4, 18, '#8a6238'); px(34, 22, 4, 18, '#8a6238');
  px(2, 6, 44, 18, '#f2e4c0'); px(2, 6, 44, 2, '#c9b48a'); px(2, 22, 44, 2, '#a89070');
  px(6, 11, 36, 3, '#3a3550');
  px(6, 16, 24, 2, '#7a7488');
  px(2, 4, 44, 2, '#8a6238');
});

PROPS.brilho = paint(8, 8, (px) => {
  px(3, 0, 2, 8, '#fff3b0'); px(0, 3, 8, 2, '#fff3b0');
  px(2, 2, 4, 4, '#ffffff');
});

/* ============================================================
   INIMIGOS
   ============================================================ */
export const ENEMY_SPRITES = {};

ENEMY_SPRITES.sono = paint(48, 48, (px) => {
  disc(px, 24, 28, 17, '#3f4a8a');
  disc(px, 24, 27, 15, '#5c6bb0');
  disc(px, 12, 32, 8, '#5c6bb0'); disc(px, 36, 32, 8, '#5c6bb0');
  px(13, 24, 8, 2, '#1c2140'); px(27, 24, 8, 2, '#1c2140');   // olhos fechados
  px(15, 26, 4, 1, '#1c2140'); px(29, 26, 4, 1, '#1c2140');
  px(20, 33, 8, 6, '#1c2140'); px(22, 35, 4, 3, '#8a4a6a');   // boca a bocejar
  px(14, 8, 20, 6, '#8a4a6a'); px(30, 4, 10, 8, '#8a4a6a');   // barrete
  px(36, 2, 6, 5, '#f6f2e2');
  px(2, 10, 7, 2, '#f6f2e2'); px(6, 12, 3, 2, '#f6f2e2'); px(2, 14, 7, 2, '#f6f2e2');
  px(4, 2, 5, 2, '#a9a6c4'); px(7, 4, 2, 2, '#a9a6c4'); px(4, 6, 5, 2, '#a9a6c4');
});

ENEMY_SPRITES.semCafe = paint(48, 48, (px) => {
  px(10, 16, 28, 24, '#e8e2d4');                              // chavena
  px(10, 16, 28, 3, '#c9c2b0');
  px(10, 37, 28, 4, '#c9c2b0');
  px(12, 42, 24, 3, '#8a8a9c');
  px(36, 22, 8, 12, '#e8e2d4'); px(38, 24, 4, 8, '#8a5a34');  // asa
  px(14, 20, 20, 4, '#4a3020');                               // fundo (vazio)
  px(16, 26, 5, 6, '#241a2b'); px(27, 26, 5, 6, '#241a2b');   // olhos tristes
  px(16, 25, 5, 1, '#8a5a34'); px(27, 25, 5, 1, '#8a5a34');
  px(18, 34, 12, 2, '#241a2b'); px(17, 33, 2, 2, '#241a2b'); px(29, 33, 2, 2, '#241a2b');
  px(4, 12, 2, 8, '#8a5a34'); px(42, 12, 2, 8, '#8a5a34');
  px(2, 26, 4, 2, '#8a5a34'); px(42, 30, 4, 2, '#8a5a34');
});

ENEMY_SPRITES.esActor = paint(48, 48, (px) => {
  px(14, 4, 20, 6, '#c9a04a');                                // ponto de interrogacao
  px(10, 8, 6, 8, '#c9a04a'); px(32, 8, 6, 10, '#c9a04a');
  px(26, 16, 8, 8, '#c9a04a');
  px(20, 22, 8, 8, '#c9a04a');
  px(20, 30, 8, 5, '#c9a04a');
  px(20, 38, 8, 7, '#c9a04a');
  px(14, 4, 20, 2, '#f0c96a'); px(20, 38, 8, 2, '#f0c96a');
  px(21, 24, 3, 4, '#f6f2e2'); px(25, 24, 3, 4, '#f6f2e2');   // olhinhos
  px(22, 25, 1, 2, '#241a2b'); px(26, 25, 1, 2, '#241a2b');
  px(18, 34, 4, 3, '#b8465a'); px(26, 34, 4, 3, '#b8465a');   // laco
  px(22, 34, 4, 3, '#8f3448');
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

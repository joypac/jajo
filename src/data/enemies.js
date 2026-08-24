/* ============================================================
   enemies.js - inimigos e ataques
   ============================================================ */

/* ---------- ataques do Bernardo ---------- */
export const ATTACKS = [
  {
    name: 'MANDAR ÁUDIO', min: 9, max: 15,
    text: () => 'BERNARDO mandou um áudio de 7 minutos.',
    after: e => `${e} ouviu tudo. Não estava preparado.`
  },
  {
    name: 'DIZER "OK"', min: 6, max: 11,
    text: () => 'BERNARDO respondeu apenas "ok".',
    after: () => 'Só isso. Foi devastador.'
  },
  {
    name: 'OFERECER CAFÉ', min: 8, max: 14,
    text: () => 'BERNARDO ofereceu um café.',
    after: e => `${e} aceitou. Ninguém recusa.`
  },
  {
    name: 'MANDAR MEME', min: 10, max: 16,
    text: () => 'BERNARDO mandou um meme.',
    after: () => 'Era mesmo à medida. Impressionante.'
  }
];

/* ---------- o botão DRAMA ---------- */
export const DRAMA_COST = 10;
export const DRAMA_DAMAGE = 37;
export const DRAMA_LINES = [
  'BERNARDO suspira olhando pela janela.',
  'BERNARDO diz "não, está tudo bem" com aquele tom.',
  'BERNARDO faz uma pausa dramática de sete segundos.',
  'BERNARDO põe uma música triste de propósito.',
  'BERNARDO lembra a toda a gente que o Jajo estudou teatro.'
];

/* ---------- inimigos ---------- */
export const ENEMIES = {
  sono: {
    id: 'sono', name: 'SONO', sprite: 'sono', hp: 32, color: '#5c6bb0',
    attacks: [
      { name: 'BOCEJO CONTAGIANTE', min: 4, max: 8 },
      { name: 'SÃO SÓ CINCO MINUTOS', min: 3, max: 9 }
    ],
    death: 'O SONO foi derrotado. Volta hoje por volta das duas da manhã.'
  },
  semCafe: {
    id: 'semCafe', name: 'FALTA DE CAFÉ', sprite: 'semCafe', hp: 36, color: '#8a5a34',
    attacks: [
      { name: 'TREMER LIGEIRAMENTE', min: 4, max: 9 },
      { name: 'OLHAR VAZIO', min: 3, max: 8 }
    ],
    death: 'A FALTA DE CAFÉ desapareceu. Alguém, algures, carregou num botão.'
  },
  esActor: {
    id: 'esActor', name: '"ÉS ACTOR?"', sprite: 'esActor', hp: 28, color: '#c9a04a',
    attacks: [
      { name: 'MAS ESTUDASTE TEATRO', min: 5, max: 10 },
      { name: 'FAZ AÍ UMA CENA', min: 3, max: 8 }
    ],
    death: '"ÉS ACTOR?" foi derrotado. Vai voltar num jantar de família.'
  },
  drama: {
    id: 'drama', name: 'DRAMA', sprite: 'drama', hp: 38, color: '#d43f7a',
    attacks: [
      { name: 'SUSPIRO PROFUNDO', min: 4, max: 9 },
      { name: 'OLHAR PARA A JANELA', min: 3, max: 10 }
    ],
    death: 'O DRAMA saiu de cena. Fez questão de bater a porta.'
  },
  boss: {
    id: 'boss', name: 'O GRANDE DESCONHECIDO', sprite: 'boss', hp: 60, color: '#4a3a6b',
    boss: true,
    noFlee: 'O GRANDE DESCONHECIDO não te deixa fugir. Ele também não sabe porquê.',
    attacks: [
      { name: 'ENCOLHER OS OMBROS', min: 1, max: 3 },
      { name: 'NÃO SABER', min: 1, max: 4 },
      { name: 'OLHAR MISTERIOSO', min: 0, max: 2 }
    ],
    death: 'O GRANDE DESCONHECIDO desfez-se em nevoeiro. Continua desconhecido.'
  }
};

/* quem aparece na relva escura */
export const WILD = ['sono', 'semCafe', 'esActor', 'drama'];

/* frases da vitória */
export const WIN_LINES = [
  'BERNARDO ganhou 0 XP. O XP não faz nada neste jogo.',
  'BERNARDO ganhou 0 XP. Continua nível 1. Sempre.',
  'BERNARDO ganhou 0 XP, mas está mais perto do Jajo. Provavelmente.'
];

/* ============================================================
   enemies.js - inimigos e ataques
   ============================================================ */

/* ---------- ataques do Bernardo ---------- */
export const ATTACKS = [
  {
    name: 'MANDAR ÁUDIO', min: 9, max: 15,
    text: e => `BERNARDO mandou um áudio de 7 minutos.`,
    after: e => `${e} ouviu tudo. ${e} não estava preparado.`
  },
  {
    name: 'DIZER "OK"', min: 6, max: 11,
    text: e => `BERNARDO disse "ok".`,
    after: e => `Só isso. Foi devastador.`
  },
  {
    name: 'FAZER DE CONTA', min: 0, max: 22,
    text: e => `BERNARDO faz de conta que não é nada.`,
    after: (e, d) => d === 0 ? `Não resultou minimamente.` : `Resultou. Ninguém sabe porquê.`
  },
  {
    name: 'MANDAR MEME', min: 10, max: 16,
    text: e => `BERNARDO mandou um meme.`,
    after: e => `Era mesmo à medida. Impressionante.`
  }
];

/* ---------- o botão DRAMA ---------- */
export const DRAMA_COST = 10;
export const DRAMA_DAMAGE = 37;
export const DRAMA_LINES = [
  'BERNARDO suspira olhando pela janela.',
  'BERNARDO diz "não, está tudo bem" com aquele tom.',
  'BERNARDO relembra uma conversa de 2019.',
  'BERNARDO põe uma música triste de propósito.',
  'BERNARDO escreve uma mensagem enorme. Apaga. Escreve "ok".'
];

/* ---------- inimigos ---------- */
export const ENEMIES = {
  ansiedade: {
    id: 'ansiedade', name: 'ANSIEDADE', sprite: 'ansiedade', hp: 34, color: '#5b3390',
    attacks: [
      { name: 'PENSAMENTO INTRUSIVO', min: 4, max: 8 },
      { name: 'E SE CORRER MAL?', min: 3, max: 9 }
    ],
    death: 'A ANSIEDADE foi-se embora. Volta logo à noite, mas pronto.'
  },
  overthinking: {
    id: 'overthinking', name: 'OVERTHINKING', sprite: 'overthinking', hp: 42, color: '#6f5c9c',
    attacks: [
      { name: 'REPETIR A CONVERSA NA CABEÇA', min: 4, max: 9 },
      { name: 'ANALISAR UMA VÍRGULA', min: 2, max: 7 }
    ],
    death: 'O OVERTHINKING desapareceu. Ainda ficou a pensar no assunto.'
  },
  faltaResposta: {
    id: 'faltaResposta', name: 'FALTA DE RESPOSTA', sprite: 'faltaResposta', hp: 28, color: '#8f96b8',
    attacks: [
      { name: 'VISTO ÀS 21:04', min: 5, max: 10 },
      { name: 'SILÊNCIO ABSOLUTO', min: 3, max: 8 }
    ],
    death: 'A FALTA DE RESPOSTA não respondeu. Coerente até ao fim.'
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
    boss: true, noFlee: 'O GRANDE DESCONHECIDO não te deixa fugir. Ele também não sabe porquê.',
    attacks: [
      { name: 'ENCOLHER OS OMBROS', min: 1, max: 3 },
      { name: 'NÃO SABER', min: 1, max: 4 },
      { name: 'OLHAR MISTERIOSO', min: 0, max: 2 }
    ],
    death: 'O GRANDE DESCONHECIDO desfez-se em nevoeiro. Continua desconhecido.'
  }
};

/* quem aparece na relva escura da floresta */
export const WILD = ['ansiedade', 'overthinking', 'faltaResposta', 'drama'];

/* frases da vitória */
export const WIN_LINES = [
  'BERNARDO ganhou 0 XP. O XP não faz nada neste jogo.',
  'BERNARDO ganhou 0 XP. Continua nível 1. Sempre.',
  'BERNARDO ganhou 0 XP, mas ganhou tempo. Não, também não.'
];

/* ============================================================
   script.js - TODOS os textos do jogo
   Formato de uma fala:  { s:'QUEM', t:'o que diz' }
   Sem "s" -> narração (sem etiqueta de nome por cima da caixa).
   Muda aqui os diálogos sem tocar em mais nada.
   ============================================================ */

const B = t => ({ s: 'BERNARDO', t });

export const SCRIPT = {

  /* ---------- aldeia ---------- */
  npc1: [
    { s: 'ALDEÃO', t: 'Procuras o Jajo?' },
    B('Sim.'),
    { s: 'ALDEÃO', t: 'Ah.' },
    { s: 'ALDEÃO', t: 'Boa sorte.' }
  ],
  npc1_repeat: [
    { s: 'ALDEÃO', t: 'Continua a boa sorte.' }
  ],

  npc2: [
    { s: 'VIZINHA', t: 'Vi alguém parecido com o Jajo passar por aqui.' },
    B('Quando?'),
    { s: 'VIZINHA', t: 'Não sei.' },
    B('Obrigado.'),
    { s: 'VIZINHA', t: 'De nada.' }
  ],
  npc2_repeat: [
    { s: 'VIZINHA', t: 'Continuo sem saber quando.' }
  ],

  npc3: [
    { s: 'RAPAZ', t: 'O Jajo desapareceu?' },
    B('Sim.'),
    { s: 'RAPAZ', t: 'Que estranho.' },
    B('Pois.'),
    { s: 'RAPAZ', t: 'Bom, boa sorte.' }
  ],
  npc3_repeat: [
    { s: 'RAPAZ', t: 'Continua estranho.' }
  ],

  galinha: [
    [{ s: 'GALINHA', t: 'COCÓ.' }],
    [{ s: 'GALINHA', t: 'COCÓ.' }],
    [{ s: 'GALINHA', t: '...' }],
    [{ s: 'GALINHA', t: 'COCÓ?' }],
    [{ s: 'GALINHA', t: 'Pára com isso.' }],
    [{ s: 'GALINHA', t: 'Eu sei mais do que pensas.' }, { t: 'A galinha olha para o horizonte.' }],
    [{ s: 'GALINHA', t: 'COCÓ.' }]
  ],

  lojista: [
    { s: 'LOJISTA', t: 'Bem-vindo à LOJA INÚTIL!' },
    B('O que é que vende?'),
    { s: 'LOJISTA', t: 'Nada.' },
    { s: 'LOJISTA', t: 'Mas vendo bem.' },
    { s: 'LOJISTA', t: 'Leva um café, ao menos.' }
  ],
  lojista_repeat: [
    { s: 'LOJISTA', t: 'Continua tudo esgotado. Nunca houve nada.' }
  ],

  casa: [
    { t: 'A porta está fechada.' },
    B('Isto é a minha casa.'),
    B('...esqueci-me da chave.')
  ],
  fonte: [
    { t: 'Uma fonte. A água faz aquele barulho de água.' },
    B('Fazes ideia de onde está o Jajo?'),
    { t: 'A fonte não responde. Como esperado.' }
  ],
  placa: [
    { t: 'ALDEIA DO JAJO' },
    { t: 'População: incerta.' },
    { t: 'Jajos: 0 de momento.' }
  ],
  pedra: [
    { t: 'Uma pedra.' },
    B('O Jajo não está debaixo desta pedra.'),
    B('Já verifiquei duas vezes.')
  ],
  lago: [
    { t: 'Um lago pequeno.' },
    B('Se o Jajo estiver aí dentro, temos um problema maior.')
  ],
  cerca: [
    { t: 'Uma cerca de madeira com um aviso pregado.' },
    { t: '"A floresta só abre depois de falares com toda a gente."' },
    B('Porquê?'),
    { t: 'A cerca não explica.' }
  ],
  cerca_abre: [
    { t: 'Falaste com toda a gente da aldeia.' },
    { t: 'A cerca abre-se sozinha, um bocado dramaticamente.' },
    { t: 'A FLORESTA DA INDECISÃO está aberta.' }
  ],

  /* ---------- floresta ---------- */
  arvore: [
    { s: 'ÁRVORE', t: 'Eu sei onde está o Jajo.' },
    B('ONDE?'),
    { s: 'ÁRVORE', t: 'Não sei.' },
    B('...'),
    { s: 'ÁRVORE', t: 'Mas sei que sei.' }
  ],
  arvore_repeat: [
    { s: 'ÁRVORE', t: 'Continuo a saber que não sei.' }
  ],

  sabio: [
    { s: 'SÁBIO', t: 'Para encontrares o Jajo tens de seguir o caminho certo.' },
    B('Qual?'),
    { s: 'SÁBIO', t: 'Não sei.' },
    B('E o senhor é o sábio?'),
    { s: 'SÁBIO', t: 'Sou o único que estava disponível.' },
    { s: 'SÁBIO', t: 'Segue para norte. Provavelmente.' }
  ],
  sabio_repeat: [
    { s: 'SÁBIO', t: 'Norte. Talvez. Ou não.' }
  ],

  nevoeiro: [
    { t: 'Um nevoeiro espesso bloqueia o caminho para norte.' },
    { t: 'Parece que falta ouvir alguém importante.' }
  ],
  nevoeiro_abre: [
    { t: 'O nevoeiro afasta-se lentamente.' },
    { t: 'Sente-se algo dramático a norte.' }
  ],
  cogumelo: [
    { t: 'Um cogumelo enorme.' },
    B('Sabes onde está o Jajo?'),
    { t: 'É um cogumelo.' }
  ],

  /* ---------- boss ---------- */
  boss_intro: [
    { s: '???', t: 'FINALMENTE.' },
    { s: '???', t: 'CHEGASTE ATÉ AQUI.' },
    { s: '???', t: 'EU SOU O GRANDE DESCONHECIDO.' },
    { t: 'A música fica muito mais dramática do que o necessário.' },
    B('Sabes onde está o Jajo?'),
    { s: 'O GRANDE DESCONHECIDO', t: '...não.' },
    B('Então porque é que isto é tudo tão dramático?'),
    { s: 'O GRANDE DESCONHECIDO', t: 'Por hábito.' }
  ],
  boss_win: [
    { s: 'O GRANDE DESCONHECIDO', t: 'Isso... foi mais rápido do que eu esperava.' },
    { s: 'O GRANDE DESCONHECIDO', t: 'Segue em frente.' },
    B('Sabes mesmo onde ele está?'),
    { s: 'O GRANDE DESCONHECIDO', t: 'Não. Mas tenho um bom pressentimento.' }
  ],

  /* ---------- área final ---------- */
  final_chegada: [
    { t: 'Fica tudo mais silencioso.' },
    { t: 'Até a música se porta bem.' }
  ],
  final_casa: [
    { t: 'Uma casa pequena. A porta está entreaberta.' },
    B('...')
  ],

  /* ---------- easter eggs ---------- */
  limite: [
    { t: 'Não.' }
  ]
};

/* falas curtas em balão por cima do Bernardo quando ficas parado */
export const IDLE_BUBBLES = ['Então?', 'Vamos?', 'Olá?', 'O Jajo...', 'Eu espero.'];

/* sequência final (ecrã preto) */
export const FINAL_SEQUENCE = [
  { text: 'Jajo?', wait: 1500 },
  { text: 'Jajo?', wait: 1700 },
  { text: 'JAAAAAJO?', wait: 1900, big: true },
  { text: '', wait: 1000 },
  { text: 'Atrás de ti.', wait: 1300, quiet: true }
];

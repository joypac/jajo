/* ============================================================
   script.js - TODOS os textos do jogo
   Formato de uma fala:  { s:'QUEM', t:'o que diz' }
   Sem "s" -> narração (sem etiqueta de nome).
   { fact:'origem' } numa fala -> desbloqueia um campo dos DADOS DO JAJO.
   ============================================================ */

const B = t => ({ s: 'BERNARDO', t });

export const SCRIPT = {

  /* ======================= ALDEIA ======================= */
  npc1: [
    { s: 'ALDEÃO', t: 'Procuras o Jajo?' },
    B('Sim.'),
    { s: 'ALDEÃO', t: 'Ah. O Jaja.' },
    B('Jajo.'),
    { s: 'ALDEÃO', t: 'Dina.' },
    B('...'),
    { s: 'ALDEÃO', t: 'É tudo a mesma pessoa.' },
    B('Eu sei. Fui eu que disse.'),
    { s: 'ALDEÃO', t: 'Boa sorte.', fact: 'nome' }
  ],
  npc1_repeat: [
    { s: 'ALDEÃO', t: 'Boa sorte, Dina.' },
    B('Eu é que sou o Bernardo.'),
    { s: 'ALDEÃO', t: 'Também é bonito.' }
  ],

  npc2: [
    { s: 'VIZINHA', t: 'Vi alguém parecido com o Jajo passar por aqui.' },
    B('Quando?'),
    { s: 'VIZINHA', t: 'Não sei.' },
    B('Obrigado.'),
    { s: 'VIZINHA', t: 'De nada.' },
    { s: 'VIZINHA', t: 'Ia a dormir em pé. Achei bonito.' }
  ],
  npc2_repeat: [
    { s: 'VIZINHA', t: 'Continuo sem saber quando. Mas ia mesmo a dormir.' }
  ],

  npc3: [
    { s: 'RAPAZ', t: 'Quem é o Jajo?' },
    B('É... o Jajo.'),
    { s: 'RAPAZ', t: 'Ah. O Dina.' },
    B('Sim.'),
    { s: 'RAPAZ', t: 'Que estranho.' },
    B('Pois.'),
    { s: 'RAPAZ', t: 'Bom, boa sorte.' }
  ],
  npc3_repeat: [
    { s: 'RAPAZ', t: 'Ainda ninguém me explicou os nomes.' }
  ],

  lojista: [
    { s: 'LOJISTA', t: 'Bem-vindo à LOJA INÚTIL!' },
    B('O que é que vende?'),
    { s: 'LOJISTA', t: 'Nada.' },
    { s: 'LOJISTA', t: 'Mas vendo bem.' },
    { s: 'LOJISTA', t: 'Toma. Café. É o combustível oficial do Jajo.' },
    B('Como é que sabe isso?'),
    { s: 'LOJISTA', t: 'Toda a gente sabe isso.', fact: 'cafe' }
  ],
  lojista_repeat: [
    { s: 'LOJISTA', t: 'Continua tudo esgotado. Nunca houve nada.' },
    { s: 'LOJISTA', t: 'Só café. Sempre houve café.' }
  ],

  galinha: [
    [{ s: 'GALINHA', t: 'COCÓ.' }],
    [{ s: 'GALINHA', t: 'COCÓ.' }],
    [{ s: 'GALINHA', t: '...' }],
    [{ s: 'GALINHA', t: 'COCÓ?' }],
    [{ s: 'GALINHA', t: 'Pára com isso.' }],
    [{ s: 'GALINHA', t: 'Eu sei mais do que pensas.' },
     { t: 'A galinha olha para o horizonte, na direção do sul.' }],
    [{ s: 'GALINHA', t: 'O Jajo deu-me café uma vez.' },
     B('E?'),
     { s: 'GALINHA', t: 'COCÓ.' }],
    [{ s: 'GALINHA', t: 'COCÓ.' }]
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
  placa_aldeia: [
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
    { t: '"A estrada para FÁTIMA só abre depois de falares com toda a gente."' },
    B('Porquê?'),
    { t: 'A cerca não explica.' }
  ],
  cerca_abre: [
    { t: 'Falaste com toda a gente da aldeia.' },
    { t: 'A cerca abre-se sozinha, um bocado dramaticamente.' },
    { t: 'A estrada para FÁTIMA está aberta.' }
  ],

  /* ---------- HIBERNARDO (gag recorrente) ---------- */
  cama: [
    [{ t: 'Uma cama. No meio do caminho. Com alguém lá dentro.' },
     { t: 'HIBERNARDO entrou em modo de hibernação.' }],
    [{ t: 'Hibernardo não pode responder neste momento.' }],
    [{ t: 'Continua a hibernar.' }],
    [{ t: 'É uma hibernação muito séria.' }],
    [B('Isto é o Jajo?'),
     { t: 'Não.' },
     { t: '...' },
     { t: 'Talvez.' },
     { t: 'Não.' }],
    [{ t: 'Hibernardo tentou dormir.' },
     { t: 'Falhou.' },
     { t: 'Está agora a hibernar por despeito.', fact: 'sono' }],
    [{ t: 'Zzz.' }]
  ],

  /* ======================= FÁTIMA ======================= */
  fatima_placa: [
    { t: 'FÁTIMA' },
    { t: 'Terra natal do Jajo.' },
    { t: 'Também tem uma rotunda.', fact: 'origem' }
  ],
  padre: [
    { s: 'PADRE', t: 'Meu filho, procuras o Jajo?' },
    B('Sim.'),
    { s: 'PADRE', t: 'Então tens uma longa jornada pela frente.' },
    B('Porquê?'),
    { s: 'PADRE', t: 'Porque ele foi para o Alentejo.' },
    { t: '...' },
    { s: 'PADRE', t: 'De autocarro.', fact: 'destino' },
    B('De autocarro?'),
    { s: 'PADRE', t: 'Foi o que ele disse. Levava um café.' }
  ],
  padre_repeat: [
    { s: 'PADRE', t: 'Alentejo. Autocarro. Café. É tudo o que sei.' }
  ],

  pastorinhos: [
    { s: 'PASTORINHO 1', t: 'Vimos uma aparição.' },
    { s: 'PASTORINHO 2', t: 'Era o Jajo?' },
    { s: 'PASTORINHO 3', t: 'Não sabemos.' },
    { s: 'PASTORINHO 1', t: 'Mas tinha café.' },
    B('Então era.'),
    { s: 'PASTORINHO 2', t: 'Disse-nos três segredos.' },
    B('Quais?'),
    { s: 'PASTORINHO 3', t: 'Esquecemo-nos de dois.' },
    { s: 'PASTORINHO 1', t: 'O terceiro era "vou ali e já venho".' }
  ],
  pastorinhos_repeat: [
    { s: 'PASTORINHO 2', t: 'Continuamos a ver aparições.' },
    { s: 'PASTORINHO 3', t: 'Hoje foi um autocarro.' }
  ],

  peregrino1: [
    { s: 'PEREGRINO', t: 'Vim a pé.' },
    B('De onde?'),
    { s: 'PEREGRINO', t: 'Dali.' },
    { t: 'Aponta para um sítio a cerca de quatro metros.' },
    B('...'),
    { s: 'PEREGRINO', t: 'Foi duro.' }
  ],
  peregrino1_repeat: [
    { s: 'PEREGRINO', t: 'Ainda estou a recuperar.' }
  ],
  peregrino2: [
    { s: 'PEREGRINA', t: 'És actor?' },
    B('Eu? Não. Estou à procura do Jajo.'),
    { s: 'PEREGRINA', t: 'Ah, o Jajo. Esse é actor.' },
    B('Não é.'),
    { s: 'PEREGRINA', t: 'Mas estudou teatro.' },
    B('Sim.'),
    { s: 'PEREGRINA', t: 'Então é actor.' },
    B('NÃO É.'),
    { s: 'PEREGRINA', t: 'Pronto.', fact: 'teatro' },
    { s: 'PEREGRINA', t: '(é.)' }
  ],
  peregrino2_repeat: [
    { s: 'PEREGRINA', t: 'Ainda acho que é actor.' }
  ],

  igreja: [
    { t: 'Um santuário pequeno, muito bem cuidado.' },
    { t: 'Está fechado para almoço.' },
    B('Às onze da manhã?'),
    { t: 'É um almoço muito sério.' }
  ],
  velas: [
    { t: 'Um mar de velas acesas.' },
    { t: 'Uma delas tem um papel colado: "PARA O JAJO CHEGAR BEM".' },
    B('Quem escreveu isto?'),
    { t: 'Letra de quem tem pressa e amor em quantidades iguais.' }
  ],
  paragem: [
    { t: 'PARAGEM DE AUTOCARRO' },
    { t: 'Destinos: ALENTEJO.' },
    { t: 'Horário: quando calhar.' },
    B('E o Jajo apanhou este autocarro?'),
    { t: 'Há um copo de café vazio no banco. É prova suficiente.' }
  ],
  fatima_gate: [
    { t: 'O caminho para a floresta está cheio de peregrinos parados.' },
    { t: 'Parece que falta falar com alguém de batina.' }
  ],
  fatima_gate_abre: [
    { t: 'Os peregrinos abrem caminho, muito devagar.' },
    { t: 'A FLORESTA DA INDECISÃO está aberta.' }
  ],

  /* ======================= FLORESTA ======================= */
  arvore: [
    { s: 'ÁRVORE', t: 'Eu sei onde está o Jajo.' },
    B('ONDE?'),
    { s: 'ÁRVORE', t: 'Não sei.' },
    B('...'),
    { s: 'ÁRVORE', t: 'Mas sei que sei.' },
    { s: 'ÁRVORE', t: 'E sei que ele estudou teatro.' },
    B('Mas não é actor.'),
    { s: 'ÁRVORE', t: 'Foi o que eu disse.' }
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
    { s: 'SÁBIO', t: 'Segue para norte. Ou para sul.' },
    B('São direções opostas.'),
    { s: 'SÁBIO', t: 'Exatamente.' },
    { s: 'SÁBIO', t: 'O Alentejo é a sul. Mas a saída é a norte.' },
    B('Isso faz algum sentido?'),
    { s: 'SÁBIO', t: 'Nenhum. Boa viagem.' }
  ],
  sabio_repeat: [
    { s: 'SÁBIO', t: 'Norte para sair. Sul para chegar. Não penses muito.' }
  ],
  figura_teatro: [
    { s: '???', t: 'Estudou teatro.' },
    B('Mas não é actor.'),
    { s: '???', t: 'Estudou teatro.' },
    B('Eu sei. Mas não é actor.'),
    { s: '???', t: 'Estudou. Teatro.' },
    { t: 'A figura desaparece entre as árvores, satisfeita.', fact: 'actor' }
  ],
  figura_teatro_repeat: [
    { s: '???', t: 'Teatro.' }
  ],
  cogumelo: [
    { t: 'Um cogumelo enorme.' },
    B('Sabes onde está o Jajo?'),
    { t: 'É um cogumelo.' }
  ],
  nevoeiro: [
    { t: 'Um nevoeiro espesso bloqueia o caminho para norte.' },
    { t: 'Parece que falta ouvir uma árvore e um velhote.' }
  ],
  nevoeiro_abre: [
    { t: 'O nevoeiro afasta-se lentamente.' },
    { t: 'Sente-se algo dramático a norte.' }
  ],
  desvio_caldas: [
    { t: 'Um carreiro lateral com uma placa torta.' },
    { t: '"CALDAS DA RAINHA - 2 min"' },
    B('Isto não me parece o caminho.'),
    { t: 'Não é.' }
  ],

  /* =================== CALDAS DA RAINHA =================== */
  caldas_npc: [
    { s: 'SENHOR', t: 'Estás à procura do Jajo?' },
    B('Sim.'),
    { s: 'SENHOR', t: 'Então estás no sítio errado.' },
    B('Onde estou?'),
    { s: 'SENHOR', t: 'Caldas da Rainha.' },
    B('...'),
    { s: 'SENHOR', t: 'Boa sorte.' }
  ],
  caldas_npc_repeat: [
    { s: 'SENHOR', t: 'Continuas no sítio errado. Mas com estilo.' }
  ],
  ceramica: [
    { t: 'LOJA DE CERÂMICA' },
    { t: 'Uma chávena com a forma de outra chávena.' },
    { t: 'Um jarro que só serve para entornar.' },
    { t: 'Uma peça que não pode ser descrita nesta caixa de diálogo.' },
    B('Quanto custa?'),
    { s: 'CERAMISTA', t: 'Não está à venda. Está aqui a existir.' }
  ],
  ceramica_repeat: [
    { s: 'CERAMISTA', t: 'Continua a existir. Obrigada por perguntares.' }
  ],
  prova_cigarro: [
    { s: 'SENHORA', t: 'O Jajo esteve aqui.' },
    B('Como sabe?'),
    { t: 'Aponta para um maço de tabaco esquecido num muro.' },
    { s: 'SENHORA', t: 'Ficou ali a filosofar vinte minutos.' },
    B('Sobre o quê?'),
    { s: 'SENHORA', t: 'Sobre ir embora. Depois foi.' }
  ],
  prova_cigarro_repeat: [
    { s: 'SENHORA', t: 'O maço ainda ali está. Ninguém lhe toca.' }
  ],

  /* ======================= BOSS ======================= */
  boss_intro: [
    { s: '???', t: 'FINALMENTE.' },
    { s: '???', t: 'CHEGASTE ATÉ AQUI.' },
    { s: '???', t: 'EU SOU O GRANDE DESCONHECIDO.' },
    { t: 'A música fica muito mais dramática do que o necessário.' },
    B('Sabes onde está o Jajo?'),
    { s: 'O GRANDE DESCONHECIDO', t: '...não.' },
    B('Então porque é que isto é tudo tão dramático?'),
    { s: 'O GRANDE DESCONHECIDO', t: 'Por hábito.' },
    { s: 'O GRANDE DESCONHECIDO', t: 'Sei que ele estudou teatro.' },
    B('MAS NÃO É ACTOR.'),
    { s: 'O GRANDE DESCONHECIDO', t: 'Eu sei. Só queria dizer.' }
  ],
  boss_win: [
    { s: 'O GRANDE DESCONHECIDO', t: 'Isso... foi mais rápido do que eu esperava.' },
    { s: 'O GRANDE DESCONHECIDO', t: 'Segue para sul. Sempre a sul.' },
    B('Para o Alentejo?'),
    { s: 'O GRANDE DESCONHECIDO', t: 'Para o Alentejo.' },
    B('E o que é que ele foi lá fazer?'),
    { s: 'O GRANDE DESCONHECIDO', t: 'Isso já não é um mistério meu.' }
  ],

  /* ======================= ALENTEJO ======================= */
  alentejo_placa: [
    { t: 'ALENTEJO' },
    { t: '' },
    B('Finalmente.'),
    { t: 'A planície não responde. A planície nunca responde.' }
  ],
  alentejo_npc: [
    { s: 'HOMEM DO MONTE', t: 'Vi o Jajo passar.' },
    B('Ele veio de longe.'),
    { s: 'HOMEM DO MONTE', t: 'Veio de muito longe.' },
    B('Porquê?'),
    { s: 'HOMEM DO MONTE', t: 'Veio por amor.' },
    B('...'),
    { s: 'HOMEM DO MONTE', t: 'E por causa do café daqui. Mas sobretudo amor.' }
  ],
  alentejo_npc_repeat: [
    { s: 'HOMEM DO MONTE', t: 'Amor. E café. Por esta ordem. Mais ou menos.' }
  ],
  alentejo_chegada: [
    { t: 'Fica tudo mais silencioso.' },
    { t: 'Até a música se porta bem.' },
    { t: 'Cheira a fim de viagem e a torrada.' }
  ],
  alentejo_casa: [
    { t: 'Uma casa pequena, caiada de branco. A porta está entreaberta.' },
    B('...'),
    B('É aqui.')
  ],

  /* ======================= EASTER EGGS ======================= */
  limite: [
    { t: 'Não.' }
  ]
};

/* ---------- falas em balão quando ficas parado ---------- */
export const IDLE_BUBBLES = [
  'Então?', 'Vamos?', 'Olá?', 'O Jajo...', 'Ele dormiu 3 horas.',
  'Isso conta como uma noite?', 'Eu espero.'
];

/* ---------- piadas soltas que aparecem de vez em quando ---------- */
export const FLAVOUR = [
  'O Jajo dormiu 3 horas. Isso conta como uma noite completa?',
  'Hibernardo tentou dormir. Falhou.',
  'O café resolveu o problema. O problema voltou.',
  'Algures, um autocarro atrasa-se por motivos poéticos.',
  'Alguém, algures, ainda pensa que ele é actor.'
];

/* ---------- sequência final (ecrã preto) ---------- */
export const FINAL_SEQUENCE = [
  { text: 'Jajo?', wait: 1500 },
  { text: 'Jajo?', wait: 1700 },
  { text: 'JAAAAAJO?', wait: 1900, big: true },
  { text: '', wait: 1000 },
  { text: 'Atrás de ti.', wait: 1400, quiet: true }
];

/* ---------- depois do susto ---------- */
export const FINAL_AFTER = [
  { t: 'O Jajo estava ali. Enrolado. A hibernar.' },
  { s: 'JAJO', t: 'Zzz.' },
  B('Jajo?'),
  { s: 'JAJO', t: '...' },
  { s: 'JAJO', t: 'Estava só a descansar os olhos.' },
  B('Há três dias.'),
  { s: 'JAJO', t: 'Foi uma viagem longa.' },
  B('Vieste de autocarro.'),
  { s: 'JAJO', t: 'Vim por amor.' },
  { t: 'Pausa.' },
  { s: 'JAJO', t: 'E há aqui um café muito bom.' }
];

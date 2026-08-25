/* ============================================================
   dialogue.js - tudo o que se diz na loja
   Perguntas curtas, respostas curtas. Nada de paredes de texto.
   ============================================================ */

/* ---------- o que os clientes perguntam ----------
   opts: três respostas da Andreia. "bom" é a que costuma correr melhor. */
export const PERGUNTAS = [
  {
    q: 'Tem meias pretas?',
    opts: ['Sim, olhe, tem esta opção.', 'Temos aquela parede inteira.', 'Deixe-me ver no stock.'],
    bom: 1
  },
  {
    q: 'Estas apertam?',
    opts: ['Esta não aperta tanto.', 'Esta tem menos elastano.', 'Depende um bocadinho do pé.'],
    bom: 0
  },
  {
    q: 'Tem de algodão?',
    opts: ['Esta é 100% algodão, mas vai-se gastar mais.', 'Tem estas, com um bocadinho de elastano.', 'Tenho, olhe aqui.'],
    bom: 0
  },
  {
    q: 'Qual é a diferença destas para aquelas?',
    opts: ['Esta tem menos elastano.', 'Essa é de cano alto.', 'Essa é dois euros mais cara.'],
    bom: 0
  },
  {
    q: 'Tem umas que não escorreguem?',
    opts: ['Estas têm silicone no calcanhar.', 'Como é que a senhora gosta das suas meias?', 'As desportivas seguram melhor.'],
    bom: 0
  },
  {
    q: 'Tem meias para diabetes?',
    opts: ['Tem diabetes?', 'Temos, sem costura, não apertam nada.', 'Estas aqui são as indicadas.'],
    bom: 1
  },
  {
    q: 'E problemas de circulação, tem?',
    opts: ['Estas são de compressão.', 'E problemas de circulação, tem?', 'Estas ajudam bastante.'],
    bom: 0
  },
  {
    q: 'Isto encolhe na máquina?',
    opts: ['A 30 graus não encolhe.', 'Esta é 100% algodão, encolhe um bocadinho.', 'Eu lavo as minhas a 40.'],
    bom: 0
  },
  {
    q: 'Tem isto mais barato?',
    opts: ['Este é o preço, mas olhe estas.', 'Se levar dois pares, sai melhor.', 'Mais barato do que isto, não.'],
    bom: 1
  },
  {
    q: 'Qual é que me aconselha?',
    opts: ['Qual é a sua cor favorita?', 'Depende do que procura.', 'Eu levava estas.'],
    bom: 0
  },
  {
    q: 'Tem destas em bege, com riscas, cano médio?',
    opts: ['Vou ver no stock.', 'Em bege tenho estas.', 'Com riscas só tenho em azul.'],
    bom: 0
  },
  {
    q: 'Estas são para homem ou para senhora?',
    opts: ['São para os dois.', 'Essas dão para toda a gente.', 'Depende do número.'],
    bom: 0
  },
  {
    q: 'Isto tem lã?',
    opts: ['Tem um bocadinho, para o inverno.', 'Essa não, essa é algodão.', 'Lã só as de cano alto.'],
    bom: 0
  },
  {
    q: 'Vocês têm casa de banho?',
    opts: ['Não temos, peço desculpa.', 'É ali no café em frente.', 'Temos, mas é só para funcionários.'],
    bom: 1
  }
];

/* ---------- tipos de cliente ---------- */
export const TIPOS_CLIENTE = [
  { id: 'indeciso',   nome: 'cliente indeciso',   perguntas: 1, compra: 0.14, paciencia: 9,  desarruma: 1.0, cor: '#ffc44d' },
  { id: 'pergunta',   nome: 'pergunta tudo',      perguntas: 3, compra: 0.10, paciencia: 12, desarruma: 1.4, cor: '#ff86b0' },
  { id: 'olhar',      nome: 'só quer olhar',      perguntas: 0, compra: 0.03, paciencia: 8,  desarruma: 1.2, cor: '#a89ec4' },
  { id: 'volta',      nome: 'vai dar uma volta',  perguntas: 1, compra: 0.05, paciencia: 7,  desarruma: 0.8, cor: '#a89ec4' },
  { id: 'especifico', nome: 'quer algo muito específico', perguntas: 2, compra: 0.12, paciencia: 10, desarruma: 1.6, cor: '#6fd18a' },
  { id: 'experimenta',nome: 'experimenta tudo',   perguntas: 1, compra: 0.08, paciencia: 14, desarruma: 2.4, cor: '#ff6b6b' },
  { id: 'comprador',  nome: 'vai mesmo comprar',  perguntas: 1, compra: 0.85, paciencia: 11, desarruma: 0.6, cor: '#6fd18a' }
];

/* peso de cada tipo na porta (o comprador é raro, claro) */
export const PESOS_CLIENTE = { indeciso: 26, pergunta: 20, olhar: 16, volta: 12, especifico: 10, experimenta: 10, comprador: 6 };

/* ---------- o que dizem quando vão embora ---------- */
export const RECUSAS = [
  'Vou pensar.',
  'Vou dar uma volta e já venho.',
  'Depois passo cá.',
  'Hoje não, obrigada.',
  'Vou ver ali em frente.',
  'É que eu queria mesmo em bege.',
  'Tenho de perguntar ao meu marido.',
  'Volto amanhã.',
  'Deixe estar, obrigada.',
  'Fico a pensar nisso.'
];
export const COMPRAS = [
  'Levo estas.',
  'Está bem, levo um par.',
  'Vá, convenceu-me.',
  'Levo estas duas.',
  'Estas servem, obrigada.'
];
export const CHEGADAS = [
  'Boa tarde!',
  'Olhe, desculpe...',
  'Bom dia.',
  'Só uma perguntinha.',
  'Isto está aberto?'
];

/* ---------- a Andreia ---------- */
export const ANDREIA_SIM = ['Sim 😊', 'Claro 😊', 'Diga 😊', 'Com certeza 😊', 'Sim, olhe 😊'];
export const ANDREIA_CANSACO = [
  'Andreia está cansada.',
  'Andreia precisa de café.',
  'Andreia precisa de uma sandes de atum.',
  'Andreia já não sente as pernas.'
];

/* ---------- a Sónia ---------- */
export const SONIA_FALAS = [
  [['SÓNIA', 'Andreia.'], ['ANDREIA', 'Sim?'], ['SÓNIA', 'Nada.']],
  [['SÓNIA', 'Andreia, sabes onde estão as meias pretas?'], ['ANDREIA', 'Ali.'], ['SÓNIA', 'Ah.']],
  [['SÓNIA', 'Já viste o email?'], ['ANDREIA', 'Ainda não.'], ['SÓNIA', 'Eu também não.']],
  [['SÓNIA', 'Andreia, chegaram meias novas.'], ['ANDREIA', 'Eu sei, estou a arrumá-las.'], ['SÓNIA', 'Ah.']],
  [['SÓNIA', 'Está calor, não está?'], ['ANDREIA', 'Está sim 😊'], ['SÓNIA', 'Pois.']],
  [['SÓNIA', 'Andreia, isto aqui não está a dar.'], ['ANDREIA', 'O quê?'], ['SÓNIA', 'O computador.']],
  [['SÓNIA', 'Andreia, era só para saber uma coisa.'], ['ANDREIA', 'Diga.'], ['SÓNIA', 'Já me esqueci.']],
  [['SÓNIA', 'Andreia, não te esqueças da caixa.'], ['ANDREIA', 'Não me esqueço 😊']]
];

export const SONIA_SAIDA = [
  ['SÓNIA', 'Andreia, eu vou andando.'],
  ['ANDREIA', 'Sim 😊'],
  ['SÓNIA', 'Até amanhã.'],
  ['ANDREIA', 'Até amanhã 😊']
];

/* ---------- eventos aleatórios ---------- */
export const EVENTOS_TEXTO = {
  meiaCaiu: 'Caiu uma meia da prateleira.',
  desarrumou: 'Um cliente desarrumou uma secção inteira.',
  stock: 'NOVO STOCK RECEBIDO!',
  stockSurpresa: 'Chegou stock que ninguém encomendou.',
  meiaRua: 'Apareceu uma meia na rua.',
  meiaTeto: 'Apareceu uma meia no teto.',
  soniaChama: 'A Sónia está a chamar.',
  clienteLimpeza: 'Entrou um cliente. Precisamente agora.',
  barato: 'Alguém quer saber se há mais barato.'
};

/* ---------- caixa ---------- */
export const CAIXA_PASSOS = [
  { label: 'Contar as notas', tipo: 'contar' },
  { label: 'Contar as moedas', tipo: 'contar' },
  { label: 'Confirmar o total', tipo: 'confirmar' },
  { label: 'Fechar a caixa', tipo: 'ok' }
];

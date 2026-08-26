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
  },

  /* ---------- novas perguntas (as de cima continuam todas) ---------- */
  { q: 'Estas são as mais quentinhas?', opts: ['Essas são de lã, sim.', 'Essas aguentam bem o inverno.', 'As de cano alto são melhores.'], bom: 0 },
  { q: 'Tem número 47?', opts: ['Tenho, mas só em preto.', 'Vou ver no stock.', 'Até ao 46 tenho de tudo.'], bom: 0 },
  { q: 'Isto é para oferecer.', opts: ['Então leve estas, é sempre um sucesso.', 'Qual é a cor favorita da pessoa?', 'Quer que embrulhe?'], bom: 1 },
  { q: 'Estas ficam largas?', opts: ['Essas assentam bem.', 'Essas têm mais elastano, seguram.', 'Depende um bocadinho do pé.'], bom: 1 },
  { q: 'Não têm nada mais simples?', opts: ['Simples tenho estas, lisas.', 'Estas pretas não têm nada.', 'Mais simples é ir descalço.'], bom: 0 },
  { q: 'Isto desbota?', opts: ['À primeira lavagem larga um bocadinho.', 'Essas não, essas são tingidas.', 'Lave com cores parecidas.'], bom: 2 },
  { q: 'Tem para criança?', opts: ['Tenho, é esta prateleira.', 'Tenho, mas acabaram as pequeninas.', 'Do 24 ao 34.'], bom: 0 },
  { q: 'Estas dão para andar muito a pé?', opts: ['Essas são desportivas, aguentam.', 'Essas têm almofada no calcanhar.', 'Eu ando com estas o dia todo.'], bom: 1 },
  { q: 'Vocês têm aquelas invisíveis?', opts: ['Tenho, são estas.', 'Essas escorregam um bocadinho.', 'Estas têm silicone, não caem.'], bom: 2 },
  { q: 'Isto é fabricado onde?', opts: ['Estas são portuguesas.', 'Vem escrito na embalagem.', 'Essas são do norte.'], bom: 0 },
  { q: 'Tem meias antiderrapantes?', opts: ['Para casa, tenho estas.', 'Com pontinhos por baixo, sim.', 'Essas são ótimas para andar em casa.'], bom: 1 },
  { q: 'A minha mulher usa sempre estas.', opts: ['Então leve duas.', 'Essas saem muito.', 'Boa escolha 😊'], bom: 0 },
  { q: 'Isto não aperta na perna?', opts: ['Esta não aperta tanto.', 'Esta tem menos elastano.', 'Essa é a mais folgada que tenho.'], bom: 0 },
  { q: 'Faz desconto?', opts: ['O preço é este, peço desculpa.', 'Se levar três, sai melhor.', 'Isso tinha de perguntar à Sónia.'], bom: 1 },
  { q: 'Aceitam multibanco?', opts: ['Aceitamos, sim.', 'Aceitamos a partir de cinco euros.', 'Aceitamos tudo menos cheques.'], bom: 0 },
  { q: 'Isto vem em par?', opts: ['Vem em par, sim.', 'Vem, senão era esquisito.', 'Essas vêm em três pares.'], bom: 0 },
  { q: 'Tem sacos?', opts: ['Tenho, é um cêntimo.', 'Tenho, olhe.', 'Ponho eu no saco 😊'], bom: 1 },
  { q: 'Estas são grossas?', opts: ['Médias, diria eu.', 'Grossas são as de lã.', 'Essas são fininhas.'], bom: 1 },
  { q: 'A senhora aqui do lado disse-me para vir cá.', opts: ['Que simpática 😊', 'Ainda bem.', 'Depois diga-lhe obrigada.'], bom: 0 },
  { q: 'Eu queria umas iguais às que tinha.', opts: ['E como eram?', 'Não faz mal, veja estas.', 'Se souber a marca, eu procuro.'], bom: 0 },
  { q: 'Não põem isto na máquina de secar, pois não?', opts: ['Não convém.', 'Encolhe logo.', 'Eu estendo sempre as minhas.'], bom: 0 },
  { q: 'Estas duram?', opts: ['Estas duram bastante.', 'Esta é 100% algodão, mas vai-se gastar mais.', 'Depende do uso.'], bom: 0 },
  { q: 'Ainda estão abertos?', opts: ['Ainda estamos, sim 😊', 'Até às sete.', 'Faltam uns minutinhos, mas diga.'], bom: 0 },
  { q: 'Tem meias de compressão médica?', opts: ['Tenho estas, de compressão.', 'E problemas de circulação, tem?', 'Essas são as mais fortes que tenho.'], bom: 1 },
  { q: 'Posso pagar com moedas?', opts: ['Pode, claro 😊', 'Pode, eu conto.', 'Pode, até dá jeito para a caixa.'], bom: 2 },
  { q: 'Tem daquelas de bolinhas?', opts: ['De bolinhas tenho estas.', 'Bolinhas só em azul.', 'Tenho de riscas, serve?'], bom: 0 },
  { q: 'Qual é a sua cor favorita?', opts: ['A minha? Preto 😊', 'Depende do dia.', 'Isso agora sou eu a escolher?'], bom: 0 },
  { q: 'Estas servem para uma pessoa que está acamada?', opts: ['Estas, sem costura, são as melhores.', 'Estas não apertam nada.', 'Tem diabetes?'], bom: 0 }
];

/* ---------- tipos de cliente ---------- */
export const TIPOS_CLIENTE = [
  { id: 'indeciso',   nome: 'cliente indeciso',   perguntas: 1, compra: 0.14, paciencia: 9,  desarruma: 1.0, cor: '#ffc44d' },
  { id: 'pergunta',   nome: 'pergunta tudo',      perguntas: 3, compra: 0.10, paciencia: 12, desarruma: 1.4, cor: '#ff86b0' },
  { id: 'olhar',      nome: 'só quer olhar',      perguntas: 0, compra: 0.03, paciencia: 8,  desarruma: 1.2, cor: '#a89ec4' },
  { id: 'volta',      nome: 'vai dar uma volta',  perguntas: 1, compra: 0.05, paciencia: 7,  desarruma: 0.8, cor: '#a89ec4' },
  { id: 'especifico', nome: 'quer algo muito específico', perguntas: 2, compra: 0.12, paciencia: 10, desarruma: 1.6, cor: '#6fd18a' },
  { id: 'experimenta',nome: 'experimenta tudo',   perguntas: 1, compra: 0.08, paciencia: 14, desarruma: 2.4, cor: '#ff6b6b' },
  { id: 'comprador',  nome: 'vai mesmo comprar',  perguntas: 1, compra: 0.85, paciencia: 11, desarruma: 0.6, cor: '#6fd18a' },
  /* ---- novos tipos (os de cima continuam todos) ---- */
  { id: 'preocupado', nome: 'está preocupado contigo', perguntas: 1, compra: 0.12, paciencia: 13, desarruma: 0.4, cor: '#9fd4ea', pool: 'preocupado' },
  { id: 'conversa',   nome: 'só quer conversar',    perguntas: 1, compra: 0.06, paciencia: 10, desarruma: 0.5, cor: '#a89ec4', pool: 'conversa' },
  { id: 'preco',      nome: 'pergunta o preço',     perguntas: 1, compra: 0.07, paciencia: 9,  desarruma: 0.7, cor: '#ffc44d', pool: 'preco' },
  { id: 'cor',        nome: 'quer outro verde',     perguntas: 1, compra: 0.0,  paciencia: 11, desarruma: 1.3, cor: '#6fd18a', pool: 'cor' },
  { id: 'senhor',     nome: 'Senhor Alberto',      perguntas: 1, compra: 0.0,  paciencia: 24, desarruma: 0.1, cor: '#e8c88a', pool: 'senhor', sprite: 1,
    saudacoes: ['Ó Andreia, boa tarde.', 'Então, Andreia?', 'Andreia, ouça lá uma coisa.', 'Ó Andreia.'] },
  { id: 'provador',   nome: 'quer experimentar',    perguntas: 1, compra: 0.0,  paciencia: 12, desarruma: 1.0, cor: '#ff6b6b', pool: 'provador' }
];

/* peso de cada tipo na porta (o comprador é raro, claro) */
export const PESOS_CLIENTE = {
  indeciso: 20, pergunta: 15, olhar: 11, volta: 8, especifico: 8, experimenta: 8, comprador: 6,
  preocupado: 7, conversa: 7, preco: 6, cor: 4, senhor: 4, provador: 2
};

/* ---------- o que dizem quando vão embora ---------- */
export const RECUSAS_EXTRA = [
  'Ah, está bem.',
  'Depois vejo com calma.',
  'Ainda vou ver noutro sítio.',
  'Era mesmo isso que eu queria evitar.',
  'Fica para a próxima.',
  'Obrigada, foi só uma pergunta.',
  'Tenho de medir o pé primeiro.',
  'Vou almoçar e depois passo.',
  'Já não me lembro do que vinha buscar.'
];

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
  'Andreia precisa de um café.',
  'Andreia precisa de uma sandes de atum.',
  'Andreia já não sente as pernas.',
  'Andreia precisa de um café. Ou de dois.'
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


/* ============================================================
   NOVOS TIPOS DE CONVERSA (as perguntas de cima continuam todas)
   Cada entrada é como uma pergunta: q + 3 respostas da Andreia.
   "seguimento" são as falas que aparecem em balão depois da resposta.
   "nuncaCompra" é para quem, honestamente, nunca ia comprar.
   ============================================================ */

/* clientes que percebem que a Andreia está cansada */
export const PERGUNTAS_PREOCUPADO = [
  {
    q: 'Está tudo bem consigo?',
    opts: ['Sim, sim 😊', 'Está tudo, obrigada.', 'Hoje está um bocadinho corrido.'], bom: 0,
    seguimento: [['CLIENTE', 'Tem a certeza? Parece cansada.'], ['ANDREIA', 'É só um bocadinho.']]
  },
  {
    q: 'Você está sempre de um lado para o outro.',
    opts: ['Pois, hoje está complicado.', 'É o que há 😊', 'Já me habituei.'], bom: 0,
    seguimento: [['CLIENTE', 'Devia parar um bocadinho.'], ['ANDREIA', 'Logo paro 😊']]
  },
  {
    q: 'Não está muito cansada?',
    opts: ['Um bocadinho, mas está tudo bem.', 'Estou bem, obrigada 😊', 'Estou, mas passa.'], bom: 0,
    seguimento: [['CLIENTE', 'Não se esqueça de descansar.'], ['ANDREIA', 'Obrigada 😊']]
  },
  {
    q: 'Está aqui sozinha?',
    opts: ['A Sónia está ali.', 'Hoje é quase 😊', 'Está tudo controlado.'], bom: 1,
    seguimento: [['CLIENTE', 'Ah. Pensei que estivesse sozinha.'], ['ANDREIA', 'Às vezes parece 😊']]
  },
  {
    q: 'Já almoçou?',
    opts: ['Ainda não, mas vou já.', 'Vou comer uma sandes ali em frente.', 'Já, obrigada 😊'], bom: 1,
    seguimento: [['CLIENTE', 'Coma qualquer coisa, olhe.'], ['ANDREIA', 'Como, sim 😊']]
  },
  {
    q: 'Não param de entrar pessoas, pois não?',
    opts: ['Hoje não 😊', 'Está sempre assim.', 'É bom sinal.'], bom: 0,
    seguimento: [['CLIENTE', 'Coitada.'], ['ANDREIA', 'Obrigada 😊']]
  }
];

/* O SENHOR ALBERTO. Aparece sempre. A consulta é dele. */
export const CONVERSAS_SENHOR = [
  {
    q: 'Então, Andreia, fui ao hospital.',
    opts: ['Ah, sim?', 'Espero que esteja tudo bem.', 'E correu bem?'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Pois. Tive lá uma coisa qualquer.'], ['ANDREIA', 'Espero que esteja tudo bem.'], ['ALBERTO', 'Também eu.']]
  },
  {
    q: 'Agora tenho tido um problema com os vizinhos.',
    opts: ['Ai, isso é chato.', 'Espero que se resolva.', 'A sério?'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Pois é.'], ['ANDREIA', 'Espero que se resolva.'], ['ALBERTO', 'Hei-de resolver.']]
  },
  {
    q: 'Hoje estava um trânsito...',
    opts: ['Está, está.', 'Imagino.', 'Nem me diga.'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Demorei imenso a chegar.'], ['ANDREIA', 'Imagino.'], ['ALBERTO', 'Uma coisa impressionante.']]
  },
  {
    q: 'Está um tempo horrível.',
    opts: ['Está mesmo.', 'Pois está.', 'E dizem que ainda piora.'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Ontem também esteve.'], ['ANDREIA', 'Esteve, esteve.']]
  },
  {
    q: 'Dormi mal esta noite.',
    opts: ['Ai que chatice.', 'Não descansou nada, então.', 'Isso sente-se o dia todo.'], bom: 1, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Acordei às quatro.'], ['ANDREIA', 'Que horas.'], ['ALBERTO', 'Pois.']]
  },
  {
    q: 'Tive de esperar duas horas na consulta.',
    opts: ['Duas horas?', 'Isso é muito tempo.', 'E depois foi rápido, aposto.'], bom: 2, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Duas horas e vinte.'], ['ANDREIA', 'Credo.'], ['ALBERTO', 'E depois foram cinco minutos.']]
  },
  {
    q: 'Rebentou-me um cano em casa.',
    opts: ['Ai não!', 'E ficou tudo alagado?', 'Isso dá um trabalho...'], bom: 1, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Ficou aquilo tudo num charco.'], ['ANDREIA', 'Que chatice.']]
  },
  {
    q: 'Lembra-se do que lhe disse dos vizinhos?',
    opts: ['Lembro, sim.', 'Ah, e então?', 'Resolveu-se?'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Pois. Continua na mesma.'], ['ANDREIA', 'Pois...'], ['ALBERTO', 'Enfim.']]
  },
  {
    q: 'Ligou-me o meu genro ontem.',
    opts: ['Ah, que bom.', 'E estava tudo bem?', 'Sim?'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Era só para perguntar uma coisa.'], ['ANDREIA', 'Ah.'], ['ALBERTO', 'Já nem me lembro o quê.']]
  },
  {
    q: 'Fui ao médico outra vez.',
    opts: ['E o que é que ele disse?', 'Espero que esteja melhor.', 'Outra vez?'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Disse para eu andar mais.'], ['ANDREIA', 'E anda?'], ['ALBERTO', 'Venho cá, não venho?']]
  },
  {
    q: 'Andreia, tenho estado preocupado com uma coisa.',
    opts: ['Com o quê?', 'Diga.', 'Espero que não seja nada.'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'É uma luz que se acendeu no carro.'], ['ANDREIA', 'Ah.'], ['ALBERTO', 'Deve ser alguma coisa.']]
  },
  {
    q: 'Estive à espera do autocarro quarenta minutos.',
    opts: ['Quarenta?', 'E chegou algum?', 'Isso é uma vergonha.'], bom: 1, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Vieram dois ao mesmo tempo.'], ['ANDREIA', 'É sempre assim.'], ['ALBERTO', 'É sempre.']]
  }
];

/* conversa de circunstância */
/* a running gag do vinho do senhor Alberto */
export const CONVERSAS_VINHO = [
  {
    q: 'Ontem bebi três copos de vinho ao jantar.',
    opts: ['Não pode ser, senhor Alberto, isso faz-lhe mal.', 'Três copos?', 'Ó senhor Alberto...'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Só três.'], ['ANDREIA', 'Senhor Alberto…']]
  },
  {
    q: 'Ontem foram quatro.',
    opts: ['Quatro copos?', 'Não pode ser, senhor Alberto.', 'Quatro?'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Sim.'], ['ANDREIA', 'Não pode ser, senhor Alberto, isso faz-lhe mal.'], ['ALBERTO', 'Foi ao jantar.']]
  },
  {
    q: 'Foram cinco.',
    opts: ['Cinco copos de vinho?', 'Senhor Alberto…', 'Cinco?'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Pois.'], ['ANDREIA', 'Senhor Alberto…'], ['ALBERTO', 'Mas eram pequenos.']]
  },
  {
    q: 'Eu só bebo vinho à refeição.',
    opts: ['Mas bebe bastante, senhor Alberto.', 'Ainda assim...', 'E quantas refeições faz?'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Faço quatro.'], ['ANDREIA', 'Quatro?'], ['ALBERTO', 'Cinco, com a ceia.']]
  },
  {
    q: 'Hoje não bebi vinho.',
    opts: ['Muito bem, senhor Alberto 😊', 'Ai que bom.', 'A sério?'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Só ontem.'], ['ANDREIA', 'Ah.']]
  },
  {
    q: 'O médico disse-me para cortar no vinho.',
    opts: ['E cortou?', 'Ainda bem, senhor Alberto.', 'E o que é que fez?'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Cortei.'], ['ANDREIA', 'Boa 😊'], ['ALBERTO', 'Agora é só ao almoço e ao jantar.']]
  },
  {
    q: 'Trouxeram-me um garrafão da aldeia.',
    opts: ['Um garrafão?', 'Isso é muito vinho, senhor Alberto.', 'E já provou?'], bom: 1, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Cinco litros.'], ['ANDREIA', 'Senhor Alberto…'], ['ALBERTO', 'Dura-me a semana.']]
  },
  {
    q: 'Ontem à noite bebi só um copito.',
    opts: ['Ainda bem 😊', 'Um copito?', 'Muito bem, senhor Alberto.'], bom: 0, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Depois bebi outro.'], ['ANDREIA', 'Ah.'], ['ALBERTO', 'E mais um.']]
  },
  {
    q: 'O vinho da casa lá do restaurante é bom.',
    opts: ['Ai é?', 'E bebeu muito?', 'Fico contente 😊'], bom: 1, nuncaCompra: true,
    seguimento: [['ALBERTO', 'Bebi o que estava na mesa.'], ['ANDREIA', 'E estava lá muito?'], ['ALBERTO', 'Uma garrafa.']]
  }
];

export const SMALL_TALK = [
  { q: 'Bom dia.', opts: ['Bom dia 😊', 'Bom dia, diga.', 'Olá, bom dia.'], bom: 0,
    seguimento: [['CLIENTE', 'Era só para ver.'], ['ANDREIA', 'Esteja à vontade 😊']] },
  { q: 'Boa tarde.', opts: ['Boa tarde 😊', 'Boa tarde, faça favor.', 'Olá 😊'], bom: 0 },
  { q: 'Está muito calor hoje.', opts: ['Está mesmo.', 'E ainda agora começou.', 'Aqui dentro dá-se bem.'], bom: 0 },
  { q: 'Está muito frio hoje.', opts: ['Está gelado.', 'Precisa de umas de lã 😊', 'Está, sim.'], bom: 1 },
  { q: 'Tem muita gente hoje.', opts: ['Hoje está movimentado 😊', 'Tem, tem.', 'E ainda agora abrimos.'], bom: 0 },
  { q: 'Está sempre tão arrumadinha esta loja.', opts: ['Obrigada 😊', 'Faço o que posso 😊', 'Hoje nem tanto.'], bom: 0,
    seguimento: [['CLIENTE', 'Está um brinquinho.'], ['ANDREIA', 'Obrigada 😊']] },
  { q: 'Vocês abrem ao sábado?', opts: ['Abrimos até às duas.', 'Abrimos, sim.', 'Ao sábado é a Sónia.'], bom: 0 },
  { q: 'Isto aqui era uma sapataria, não era?', opts: ['Era, há muitos anos.', 'Acho que era, sim.', 'Agora são meias 😊'], bom: 0 }
];

/* "quanto é?" */
export const PERGUNTAS_PRECO = [
  { q: 'Quanto é?', opts: ['São quatro e cinquenta.', 'Esse par é três e noventa.', 'Esse é seis euros.'], bom: 0,
    seguimento: [['CLIENTE', 'Ah.'], ['CLIENTE', '...'], ['CLIENTE', 'Está bem.']] },
  { q: 'E este, quanto custa?', opts: ['Esse é cinco euros.', 'Esse está em promoção: três.', 'Esse é o mais caro, sete.'], bom: 1,
    seguimento: [['CLIENTE', 'Hm.'], ['CLIENTE', 'Obrigado.']] },
  { q: 'Isto não é um bocadinho caro?', opts: ['É o preço de custo mais um bocadinho.', 'É a qualidade, olhe.', 'Há mais baratas, olhe estas.'], bom: 2,
    seguimento: [['CLIENTE', 'Pois.'], ['ANDREIA', 'Pois 😊']] }
];

/* o verde que nunca é o verde certo */
export const PERGUNTAS_COR = [
  { q: 'Tem em verde?', opts: ['Tenho esta.', 'Verde tenho estas duas.', 'Verde só me resta este.'], bom: 0, nuncaCompra: true,
    seguimento: [['CLIENTE', 'Não. Verde mesmo.'], ['ANDREIA', 'Esta é verde.'], ['CLIENTE', 'Mas eu queria outro verde.']] },
  { q: 'Tem em azul?', opts: ['Azul tenho estas.', 'Tenho azul-escuro e azul-claro.', 'Esta é azul.'], bom: 1, nuncaCompra: true,
    seguimento: [['CLIENTE', 'Esse azul é muito azul.'], ['ANDREIA', 'Ah.'], ['CLIENTE', 'Eu queria um azul mais... normal.']] },
  { q: 'Isto é bege ou é creme?', opts: ['Eu diria bege.', 'Isso é creme.', 'É bege-creme.'], bom: 2, nuncaCompra: true,
    seguimento: [['CLIENTE', 'Porque eu queria bege.'], ['ANDREIA', 'Este é bege 😊'], ['CLIENTE', 'Não é o meu bege.']] }
];

/* muito raramente: alguém quer experimentar as meias */
export const PERGUNTAS_PROVADOR = [
  { q: 'Posso experimentar?', opts: ['Não pode, peço desculpa.', 'Por causa da higiene, não dá.', 'Pode ver o número na embalagem.'], bom: 2, nuncaCompra: true,
    seguimento: [['CLIENTE', 'Então como é que eu sei se me ficam boas?'], ['ANDREIA', 'Pelo número costuma dar certinho 😊'], ['CLIENTE', 'Pff.']] },
  { q: 'Não há um provador para meias?', opts: ['Não há, peço desculpa.', 'Provador de meias não temos 😊', 'Nunca ninguém pediu isso.'], bom: 1, nuncaCompra: true,
    seguimento: [['CLIENTE', 'E se não me servirem?'], ['ANDREIA', 'Se não servirem, troco 😊'], ['CLIENTE', 'Isso já é outra conversa.']] }
];

/* pools por tipo de cliente */
export const POOLS = {
  preocupado: PERGUNTAS_PREOCUPADO,
  senhor: CONVERSAS_SENHOR.concat(CONVERSAS_VINHO),
  conversa: SMALL_TALK,
  preco: PERGUNTAS_PRECO,
  cor: PERGUNTAS_COR,
  provador: PERGUNTAS_PROVADOR
};

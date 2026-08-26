# 🧦 ANDREIA — A LOJA DAS MEIAS

Um jogo de gestão caótica em pixel art. Um turno na loja de meias.
Entram clientes sem parar, quase ninguém compra nada, chega stock a toda a hora,
há meias no chão, na rua e no teto — e a Andreia faz literalmente tudo.

A Sónia está no computador. Com a ventoinha.

> Um turno. Muitos clientes. Poucas vendas.

---

## Jogar

Não há build: são ficheiros estáticos com módulos ES. Só precisa de ser servido por HTTP.

```bash
python3 -m http.server 8099     # abre http://localhost:8099
# ou, com recarregamento automático:
npm install && npm run dev
```

No telemóvel, na mesma rede: `http://<ip-do-computador>:8099`.

### Controlos

| | Telemóvel | Computador |
|---|---|---|
| Mover | joystick (ou dedo na metade esquerda) | WASD / setas |
| Acção (manter para trabalhar) | botão **A** | espaço / E |
| Largar o que tem na mão | botão **LARGAR** | shift / Q |
| Som | botão ♪ | M |

---

## O turno

O relógio anda das **09:00** às **19:00** em cerca de cinco minutos.

**🛍️ Atender** — chega-te ao cliente com o `?` e carrega em A. Escolhe uma das três
respostas da Andreia. A resposta certa ajuda, mas a maioria vai dizer *"Vou pensar."*
e sair na mesma. É essa a piada.

**🧦 Arrumar** — fica em frente a uma prateleira e mantém A. Os clientes desarrumam-na
outra vez enquanto olham. As meias que caem no chão apanham-se só a passar por cima.

**📦 Stock** — chega uma caixa, carrega em A para a levantar (andas mais devagar),
leva-a a uma prateleira e mantém A para a arrumar. Se deixares acumular, a loja avisa.

**🧹 Chão** — vai buscar a esfregona ao balde. Andar com ela limpa o chão sujo, mas
deixa-o **molhado**. Se voltares a pisar molhado, fica sujo outra vez — e os clientes
atravessam tudo e deixam pegadas. É um pequeno puzzle de percurso.

**☕ Venezia** — o café em frente. Quando a energia baixa, atravessa a rua:
no balcão, 🥪 **sandes de atum (+35 energia)**; na máquina, ☕ **café (+15)**.
Basta carregar em A uma vez.

**💰 Caixa** — só na última hora. Contar notas, contar moedas, confirmar, fechar.
Se um cliente estiver à espera, alguém vai dizer *"Desculpe…"* e a conta fica a meio.

**⏰ A última hora** — a Sónia vai-se embora e aparece no canto uma pequena lista
do que tem de ficar feito antes de fechar. Os clientes continuam a entrar.

### O ritmo do dia

O caos é distribuído de propósito:

| | O que acontece |
|---|---|
| **Manhã** | poucos clientes, loja quase arrumada — é quando chegam quase todas as entregas |
| **Meio do dia** | começa a entrar mais gente, a loja começa a desarrumar-se |
| **Tarde** | mais clientes, mais meias no chão, o chão suja-se a sério |
| **Última hora** | não chega stock novo, mas há tudo para fechar |

Cada turno sorteia também um tipo de dia — **calmo**, **normal** ou **complicado** —
que muda a quantidade de clientes, de entregas e de sujidade. Nenhum é impossível.

Se geres bem o tempo (stock de manhã, arrumação a meio, limpeza ao fim da tarde),
dá mesmo para acabar com tudo feito: **🏆 TURNO PERFEITO**.

No fim há um **resumo do turno**, com estrelas e com a estatística mais importante:
*Ajuda da Sónia: 0*.

### O senhor Alberto

Há um cliente que aparece de vez em quando e não vem comprar meias: vem contar a vida.
Foi ao hospital, teve uma consulta, tem um problema com os vizinhos, estava um trânsito.
E, sobretudo, bebe demasiado vinho às refeições:

> **ALBERTO:** Ontem foram quatro.
> **ANDREIA:** Quatro copos?
> **ALBERTO:** Sim.
> **ANDREIA:** Não pode ser, senhor Alberto, isso faz-lhe mal.

Há também clientes que reparam que a Andreia está cansada, clientes que perguntam o preço
e vão embora, clientes que querem *outro* verde, e — muito raramente — alguém que quer
experimentar as meias e não gosta nada da resposta.

---

## Mexer no jogo

Tudo o que é conteúdo está em `src/data/`, em texto simples:

| Ficheiro | O que muda |
|---|---|
| `data/dialogue.js` | perguntas dos clientes, respostas da Andreia, falas da Sónia, tipos de cliente, eventos |
| `data/map.js` | a loja, a rua, o Venezia, mobília, pontos de clientes e de stock, meias no teto |
| `data/socks.js` | tipos de meia (cor e nome) |
| `data/sprites.js` | toda a arte (pixel art escrita em código) |
| `data/tiles.js` | o chão e as paredes |

Uma pergunta nova é uma entrada em `PERGUNTAS`:

```js
{ q: 'Isto encolhe na máquina?',
  opts: ['A 30 graus não encolhe.', 'É 100% algodão, encolhe um bocadinho.', 'Eu lavo as minhas a 40.'],
  bom: 0 }        // "bom" é a resposta que costuma correr melhor
```

Um tipo de cliente novo é uma entrada em `TIPOS_CLIENTE` + um peso em `PESOS_CLIENTE`:

```js
{ id: 'apressado', nome: 'tem o carro em cima do passeio',
  perguntas: 1, compra: 0.3, paciencia: 5, desarruma: 0.5, cor: '#ffc44d' }
```

### Motor

`src/engine/` — peças genéricas e independentes: `screen` (canvas e escala),
`sprites` (fábrica de pixel art), `input` (joystick + teclado), `audio`
(chiptune gerado por osciladores, sem ficheiros), `fx` (partículas, tremores,
transições) e `scene`.

`src/game/` — `shop` (o turno), `customers`, `state`, `ui`, `title`, `summary`.

Para testar depressa, abre com `#debug` e usa `window.__loja` na consola:

```js
__loja.tp(8, 11)        // teleportar a Andreia (em tiles)
__loja.adiantar(195)    // saltar para a última hora
__loja.S.energia = 10
```

---

## Publicar

Sem build, o GitHub Pages serve o repositório tal como está:
**Settings → Pages → Deploy from a branch → `andreia` / `(root)`**.

---

Toda a arte é desenhada em código e a música é gerada por osciladores.
Nada aqui usa personagens, sprites ou marcas de terceiros.

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

**☕ Venezia** — o café em frente. Quando a energia baixa, atravessa a rua e mantém A
no balcão: 🥪 sandes de atum, **ENERGIA +35**.

**💰 Caixa** — só na última hora. Contar notas, contar moedas, confirmar, fechar.
Se um cliente estiver à espera, alguém vai dizer *"Desculpe…"* e a conta fica a meio.

**⏰ A última hora** — a Sónia vai-se embora e aparece a lista do que tem de ficar
feito antes de fechar. Os clientes continuam a entrar.

No fim há um **resumo do turno**, com estrelas e com a estatística mais importante:
*Ajuda da Sónia: 0*.

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

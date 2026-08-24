# ONDE ESTÁ O JAJO?

Um pequeno RPG pixel art absurdo, feito à mão em HTML, CSS e JavaScript.
Sem backend, sem base de dados, sem login. Abre e joga.

O objetivo é um só: **encontrar o Jajo**.

> Uma aventura completamente desnecessária.

---

## Jogar

Não precisa de build — são ficheiros estáticos com módulos ES.
Só precisa de ser servido por HTTP (o browser não carrega módulos a partir de `file://`).

```bash
# opção 1 - o que já tens instalado
python3 -m http.server 8099
# depois abre http://localhost:8099

# opção 2 - com Vite (recarrega sozinho ao editar)
npm install
npm run dev
```

Para jogar no telemóvel na mesma rede, abre `http://<ip-do-computador>:8099`.

### Controlos

| | Telemóvel | Computador |
|---|---|---|
| Andar | D-pad no canto | setas ou WASD |
| Falar / confirmar | botão **A** | espaço, enter ou Z |
| Mochila | botão **MENU** | esc, I ou X |
| Som | botão ♪ | M |

---

## O que há para encontrar

* **Aldeia do Jajo** — três aldeões, uma loja inútil, uma galinha e uma cerca com opiniões.
* **Fátima** — santuário, velas, peregrinos, três pastorinhos com pistas absurdamente vagas e um padre que sabe demais.
* **Floresta da Indecisão** — uma árvore que sabe que não sabe, um sábio disponível e combates.
* **Caldas da Rainha** — o sítio errado, com cerâmica indescritível.
* **???** — alguém muito dramático.
* **Alentejo** — o fim da viagem.

**HIBERNARDO** aparece em vários mapas. Está sempre a hibernar. Insiste.

A ficha **DADOS DO JAJO** (menu → separador da direita) preenche-se sozinha à medida que descobres coisas.

---

## Mexer no jogo

Tudo o que é conteúdo está em `src/data/` e é texto simples:

| Ficheiro | O que muda |
|---|---|
| `data/script.js` | **todos os diálogos**, balões e a sequência final |
| `data/maps.js` | mapas, objetos, NPCs, saídas e portões |
| `data/items.js` | itens da mochila e o que fazem |
| `data/enemies.js` | inimigos, ataques e as falas do DRAMA |
| `data/dados.js` | os campos da ficha DADOS DO JAJO |
| `data/sprites.js` | toda a arte (pixel art em texto ou em retângulos) |
| `data/tiles.js` | os quadrados de 16×16 que formam o chão |

Uma fala é só isto:

```js
npc1: [
  { s: 'ALDEÃO', t: 'Procuras o Jajo?' },
  { s: 'BERNARDO', t: 'Sim.' },
  { s: 'ALDEÃO', t: 'Ah. O Jaja.', fact: 'nome' }   // fact desbloqueia a ficha
]
```

Um NPC novo é uma linha em `maps.js`:

```js
{ id: 'quemQuerQueSeja', x: 12, y: 9, dir: 'down', char: 'aldeao2',
  talk: 'npc2', repeat: 'npc2_repeat', flag: 'npc2', give: 'cafe' }
```

### Motor

`src/engine/` tem as peças genéricas, todas pequenas e independentes:
`screen` (canvas e escala), `sprites` (fábrica de pixel art), `input` (teclado + d-pad),
`audio` (chiptune gerado na hora, sem ficheiros), `dialog`, `fx` (tremores, partículas, transições) e `scene`.

`src/game/` tem as cenas: `title`, `world`, `battle`, `menu`, `ending`, mais `state` e `ui`.

Para testar cenas depressa, abre com `#debug` no fim do endereço
(`index.html#debug`) e usa `window.__jajo` na consola:

```js
__jajo.loadMap('alentejo', 9, 14, 'up')
__jajo.go('battle', { enemy: 'drama' })
__jajo.state.flags.bossDefeated = true
```

---

## Publicar

Como não há build, o GitHub Pages serve o repositório tal como está:
**Settings → Pages → Deploy from a branch → `main` / `(root)`**.

---

Nada aqui usa personagens, sprites, música ou marcas de terceiros.
Toda a arte é desenhada em código e a música é gerada por osciladores.

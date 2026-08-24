/* ============================================================
   maps.js - os mapas do jogo
   tiles: '.' relva  ',' relva com flores  '=' caminho
          'D' relva escura (encontros)     'S' pedra
          'G' relva do fim   '#'/'T' árvore  'W' parede  '~' água
   objetos: x,y,w,h em TILES (16px). O sprite é alinhado em baixo.
   ============================================================ */

export const MAPS = {

  /* =========================== ALDEIA =========================== */
  aldeia: {
    id: 'aldeia',
    name: 'ALDEIA DO JAJO',
    music: 'aldeia',
    tiles: [
      '#########==#############',
      '#########==#############',
      '#.......,==,..........,#',
      '#........==............#',
      '#........==............#',
      '#........==............#',
      '#===================...#',
      '#.,......==........,...#',
      '#...~~~..==............#',
      '#..~~~~~.==............#',
      '#...~~~..==,...........#',
      '#.,......==............#',
      '#........==............#',
      '#..,...,.==,...,...,...#',
      '#........==............#',
      '#.,....,.==........,...#',
      '#........==,....,......#',
      '########################'
    ],
    spawn: { x: 10, y: 12, dir: 'up' },
    objects: [
      { key: 'casa', x: 16, y: 3, w: 3, h: 3, sprite: 'casa', talk: 'casa' },
      { key: 'loja', x: 3, y: 3, w: 3, h: 2, sprite: 'loja', talk: 'lojista', repeat: 'lojista_repeat', flag: 'loja', give: 'cafe' },
      { key: 'fonte', x: 13, y: 9, w: 2, h: 2, sprite: 'fonte', talk: 'fonte' },
      { key: 'arvore', x: 18, y: 12, w: 2, h: 2, sprite: 'arvore', talk: null },
      { key: 'pedra', x: 6, y: 11, w: 1, h: 1, sprite: 'pedra', talk: 'pedra' },
      { key: 'placa', x: 12, y: 2, w: 1, h: 1, sprite: 'placa', talk: 'placa' },
      { key: 'arbusto1', x: 20, y: 7, w: 1, h: 1, sprite: 'arbusto' },
      { key: 'arbusto2', x: 2, y: 15, w: 1, h: 1, sprite: 'arbusto' },
      { key: 'cerca', x: 9, y: 1, w: 2, h: 1, sprite: 'cerca', talk: 'cerca', gate: 'floresta' }
    ],
    npcs: [
      { id: 'npc1', x: 7, y: 7, dir: 'down', char: 'aldeao1', talk: 'npc1', repeat: 'npc1_repeat', flag: 'npc1' },
      { id: 'npc2', x: 17, y: 10, dir: 'left', char: 'aldeao2', talk: 'npc2', repeat: 'npc2_repeat', flag: 'npc2' },
      { id: 'npc3', x: 14, y: 14, dir: 'down', char: 'aldeao3', talk: 'npc3', repeat: 'npc3_repeat', flag: 'npc3' },
      { id: 'lojista', x: 6, y: 4, dir: 'down', char: 'lojista', talk: 'lojista', repeat: 'lojista_repeat', flag: 'loja', give: 'cafe' },
      { id: 'galinha', x: 7, y: 15, dir: 'down', kind: 'chicken', wander: true }
    ],
    items: [
      { key: 'it_maca', x: 15, y: 12, item: 'maca' },
      { key: 'it_tel', x: 3, y: 8, item: 'telemovel' }
    ],
    exits: [
      { x: 9, y: 0, w: 2, h: 1, to: 'floresta', sx: 11, sy: 18, dir: 'up', need: 'floresta' }
    ]
  },

  /* ====================== FLORESTA DA INDECISÃO ====================== */
  floresta: {
    id: 'floresta',
    name: 'FLORESTA DA INDECISÃO',
    music: 'floresta',
    shade: 'rgba(20,40,60,0.22)',
    encounters: true,
    tiles: [
      'TTTTTTTTTT==TTTTTTTTTTTT',
      'TTTTTTTTTT==TTTTTTTTTTTT',
      'TTT....D..==..D....TTTTT',
      'TTT.DDDD..==..DDDD..TTTT',
      'TTT.DDTT..==..TTDD..TTTT',
      'TTT....TT..=..TT....TTTT',
      'TTTT...TTT.=.TTT...TTTTT',
      'TTTTTDDTTT.=.TTTDD.TTTTT',
      'TTT...TT...=...TT...TTTT',
      'TTT.D......=......D.TTTT',
      'T==================...TT',
      'T=..TTDD...=...DDTT....T',
      'T=..TTDD...=...DDTT....T',
      'T=.....D...=...D.......T',
      'T=..TTT....=....TTT....T',
      'T=..TTT..=====..TTT....T',
      'T=.......=...=.........T',
      'T=..DDD..=...=..DDD....T',
      'T========..=..=========T',
      'TTTTTTTTTT==TTTTTTTTTTTT'
    ],
    spawn: { x: 11, y: 18, dir: 'up' },
    objects: [
      { key: 'arvoreFala', x: 7, y: 15, w: 2, h: 2, sprite: 'arvoreFala', talk: 'arvore', repeat: 'arvore_repeat', flag: 'arvore' },
      { key: 'cogumelo', x: 19, y: 13, w: 1, h: 1, sprite: 'cogumelo', talk: 'cogumelo' },
      { key: 'pedraF', x: 3, y: 9, w: 1, h: 1, sprite: 'pedra', talk: 'pedra' },
      { key: 'nevoeiro', x: 10, y: 1, w: 2, h: 1, sprite: 'nevoeiro', talk: 'nevoeiro', gate: 'boss' }
    ],
    npcs: [
      { id: 'sabio', x: 19, y: 11, dir: 'left', char: 'sabio', talk: 'sabio', repeat: 'sabio_repeat', flag: 'sabio' }
    ],
    items: [
      { key: 'it_meia', x: 20, y: 16, item: 'meia' }
    ],
    exits: [
      { x: 10, y: 19, w: 2, h: 1, to: 'aldeia', sx: 10, sy: 2, dir: 'down' },
      { x: 10, y: 0, w: 2, h: 1, to: 'clareira', sx: 9, sy: 15, dir: 'up', need: 'boss' }
    ]
  },

  /* ====================== CLAREIRA DO BOSS ====================== */
  clareira: {
    id: 'clareira',
    name: '???',
    music: 'boss',
    shade: 'rgba(10,6,30,0.42)',
    tiles: [
      'WWWWWWWWWWWWWWWWWWWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWSSSSSSSSSSSSSSSSWW',
      'WWWWWWWWSSWWWWWWWWWW',
      'WWWWWWWWSSWWWWWWWWWW',
      'WWWWWWWWSSWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWW'
    ],
    spawn: { x: 9, y: 15, dir: 'up' },
    objects: [],
    npcs: [],
    items: [],
    triggers: [
      { id: 'bossFight', x: 6, y: 8, w: 8, h: 3, event: 'boss' }
    ],
    exits: [
      { x: 8, y: 17, w: 2, h: 1, to: 'floresta', sx: 11, sy: 2, dir: 'down' },
      { x: 8, y: 0, w: 4, h: 1, to: 'fim', sx: 9, sy: 14, dir: 'up', need: 'fim' }
    ]
  },

  /* ====================== O FIM DO CAMINHO ====================== */
  fim: {
    id: 'fim',
    name: 'O FIM DO CAMINHO',
    music: 'fim',
    shade: 'rgba(30,30,60,0.18)',
    tiles: [
      'TTTTTTTTTTTTTTTTTTTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTTTTTTTTGGTTTTTTTTT',
      'TTTTTTTTTGGTTTTTTTTT',
      'TTTTTTTTTGGTTTTTTTTT',
      'TTTTTTTTTTTTTTTTTTTT'
    ],
    spawn: { x: 9, y: 14, dir: 'up' },
    objects: [
      { key: 'casaFim', x: 8, y: 4, w: 3, h: 3, sprite: 'casa', talk: 'final_casa', enter: true },
      { key: 'arv1', x: 3, y: 8, w: 2, h: 2, sprite: 'arvoreEscura' },
      { key: 'arv2', x: 15, y: 8, w: 2, h: 2, sprite: 'arvoreEscura' },
      { key: 'arv3', x: 4, y: 3, w: 2, h: 2, sprite: 'arvoreEscura' },
      { key: 'arv4', x: 14, y: 3, w: 2, h: 2, sprite: 'arvoreEscura' }
    ],
    npcs: [],
    items: [],
    triggers: [
      { id: 'chegada', x: 6, y: 10, w: 8, h: 2, event: 'chegada' }
    ],
    exits: []
  }
};

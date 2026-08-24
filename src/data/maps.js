/* ============================================================
   maps.js - os mapas do jogo
   tiles: '.' relva  ',' relva com flores  '=' caminho
          'D' relva escura (encontros)  'S' pedra  'P' calçada
          'A' terra alentejana  'C' seara  'G' relva do fim
          '#'/'T' árvore  'O' oliveira  'W' parede  '~' água
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
      { key: 'arvore', x: 18, y: 12, w: 2, h: 2, sprite: 'arvore' },
      { key: 'pedra', x: 6, y: 11, w: 1, h: 1, sprite: 'pedra', talk: 'pedra' },
      { key: 'placa', x: 12, y: 2, w: 1, h: 1, sprite: 'placa', talk: 'placa_aldeia' },
      { key: 'camaAldeia', x: 2, y: 12, w: 2, h: 2, sprite: 'cama', anim: 'camaFrames', talk: 'cama', hibernardo: true },
      { key: 'arbusto1', x: 20, y: 7, w: 1, h: 1, sprite: 'arbusto' },
      { key: 'arbusto2', x: 2, y: 16, w: 1, h: 1, sprite: 'arbusto' },
      { key: 'cerca', x: 9, y: 1, w: 2, h: 1, sprite: 'cerca', talk: 'cerca', gate: 'fatima' }
    ],
    npcs: [
      { id: 'npc1', x: 7, y: 7, dir: 'down', char: 'aldeao1', talk: 'npc1', repeat: 'npc1_repeat', flag: 'npc1' },
      { id: 'npc2', x: 17, y: 10, dir: 'left', char: 'aldeao2', talk: 'npc2', repeat: 'npc2_repeat', flag: 'npc2' },
      { id: 'npc3', x: 14, y: 14, dir: 'down', char: 'aldeao3', talk: 'npc3', repeat: 'npc3_repeat', flag: 'npc3' },
      { id: 'lojista', x: 6, y: 5, dir: 'down', char: 'lojista', talk: 'lojista', repeat: 'lojista_repeat', flag: 'loja', give: 'cafe' },
      { id: 'galinha', x: 7, y: 15, dir: 'down', kind: 'chicken', wander: true }
    ],
    items: [
      { key: 'it_maca', x: 15, y: 12, item: 'maca' },
      { key: 'it_tel', x: 3, y: 8, item: 'telemovel' }
    ],
    exits: [
      { x: 9, y: 0, w: 2, h: 1, to: 'fatima', sx: 10, sy: 16, dir: 'up', need: 'fatima' }
    ]
  },

  /* =========================== FÁTIMA =========================== */
  fatima: {
    id: 'fatima',
    name: 'FÁTIMA',
    music: 'fatima',
    tiles: [
      '####==##################',
      '####==##################',
      '#...===................#',
      '#..PPPPPPPPPPPP........#',
      '#..PPPPPPPPPPPP........#',
      '#..PPPPPPPPPPPP........#',
      '#..PPPPPPPPPPPP........#',
      '#..PPPPPPPPPPPP........#',
      '#..PPPPPPPPPPPP........#',
      '#..PPPPPPPPPPPP........#',
      '#..PPPPPPPPPPPP........#',
      '#..PPPPPPPPPPPP........#',
      '#..PPPPPPPPPPPP........#',
      '#......................#',
      '#.........,,...........#',
      '#......................#',
      '#.........==...........#',
      '##########==############'
    ],
    spawn: { x: 10, y: 16, dir: 'up' },
    objects: [
      { key: 'igreja', x: 5, y: 3, w: 4, h: 4, sprite: 'igreja', talk: 'igreja' },
      { key: 'velas', x: 10, y: 6, w: 2, h: 1, sprite: 'velas', anim: 'velasFrames', talk: 'velas' },
      { key: 'paragem', x: 16, y: 9, w: 2, h: 2, sprite: 'paragem', talk: 'paragem' },
      { key: 'placaFatima', x: 3, y: 13, w: 1, h: 1, sprite: 'placa', talk: 'fatima_placa' },
      { key: 'camaFatima', x: 18, y: 4, w: 2, h: 2, sprite: 'cama', anim: 'camaFrames', talk: 'cama', hibernardo: true },
      { key: 'arb1', x: 20, y: 13, w: 1, h: 1, sprite: 'arbusto' },
      { key: 'arb2', x: 16, y: 15, w: 1, h: 1, sprite: 'arbusto' },
      { key: 'multidao', x: 4, y: 1, w: 2, h: 1, sprite: 'multidao', talk: 'fatima_gate', gate: 'floresta' }
    ],
    npcs: [
      { id: 'padre', x: 7, y: 8, dir: 'down', char: 'padre', talk: 'padre', repeat: 'padre_repeat', flag: 'padre' },
      { id: 'pastor1', x: 11, y: 9, dir: 'down', char: 'pastor1', talk: 'pastorinhos', repeat: 'pastorinhos_repeat', flag: 'pastorinhos' },
      { id: 'pastor2', x: 12, y: 10, dir: 'left', char: 'pastor2', talk: 'pastorinhos', repeat: 'pastorinhos_repeat', flag: 'pastorinhos' },
      { id: 'pastor3', x: 10, y: 11, dir: 'up', char: 'pastor3', talk: 'pastorinhos', repeat: 'pastorinhos_repeat', flag: 'pastorinhos' },
      { id: 'peregrino', x: 17, y: 13, dir: 'left', char: 'peregrino', talk: 'peregrino1', repeat: 'peregrino1_repeat', flag: 'peregrino1' },
      { id: 'peregrina', x: 19, y: 7, dir: 'down', char: 'peregrina', talk: 'peregrino2', repeat: 'peregrino2_repeat', flag: 'peregrino2' }
    ],
    items: [],
    exits: [
      { x: 10, y: 17, w: 2, h: 1, to: 'aldeia', sx: 10, sy: 2, dir: 'down' },
      { x: 4, y: 0, w: 2, h: 1, to: 'floresta', sx: 11, sy: 18, dir: 'up', need: 'floresta' }
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
      '===================...TT',
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
      { key: 'placaCaldas', x: 2, y: 11, w: 1, h: 1, sprite: 'placa', talk: 'desvio_caldas' },
      { key: 'camaFloresta', x: 19, y: 15, w: 2, h: 2, sprite: 'cama', anim: 'camaFrames', talk: 'cama', hibernardo: true },
      { key: 'nevoeiro', x: 10, y: 1, w: 2, h: 1, sprite: 'nevoeiro', talk: 'nevoeiro', gate: 'boss' }
    ],
    npcs: [
      { id: 'sabio', x: 19, y: 11, dir: 'left', char: 'sabio', talk: 'sabio', repeat: 'sabio_repeat', flag: 'sabio' },
      { id: 'figura', x: 13, y: 13, dir: 'down', char: 'figura', talk: 'figura_teatro', repeat: 'figura_teatro_repeat', flag: 'figura' }
    ],
    items: [
      { key: 'it_meia', x: 21, y: 13, item: 'meia' }
    ],
    exits: [
      { x: 10, y: 19, w: 2, h: 1, to: 'fatima', sx: 4, sy: 2, dir: 'down' },
      { x: 0, y: 10, w: 1, h: 1, to: 'caldas', sx: 18, sy: 13, dir: 'left' },
      { x: 10, y: 0, w: 2, h: 1, to: 'clareira', sx: 9, sy: 15, dir: 'up', need: 'boss' }
    ]
  },

  /* ====================== CALDAS DA RAINHA ====================== */
  caldas: {
    id: 'caldas',
    name: 'CALDAS DA RAINHA',
    music: 'caldas',
    tiles: [
      'TTTTTTTTTTTTTTTTTTTT',
      'TTTTTTTTTTTTTTTTTTTT',
      'T..................T',
      'T..PPPPPPPPPPPPPP..T',
      'T..PPPPPPPPPPPPPP..T',
      'T..PPPPPPPPPPPPPP..T',
      'T..PPPPPPPPPPPPPP..T',
      'T..PPPPPPPPPPPPPP..T',
      'T..PPPPPPPPPPPPPP..T',
      'T..PPPPPPPPPPPPPP..T',
      'T..PPPPPPPPPPPPPP..T',
      'T..PPPPPPPPPPPPPP..T',
      'T..................T',
      'T.................==',
      'T..................T',
      'T..................T',
      'TTTTTTTTTTTTTTTTTTTT',
      'TTTTTTTTTTTTTTTTTTTT'
    ],
    spawn: { x: 18, y: 13, dir: 'left' },
    objects: [
      { key: 'lojaCer', x: 12, y: 3, w: 3, h: 2, sprite: 'loja', talk: 'ceramica', repeat: 'ceramica_repeat', flag: 'ceramica' },
      { key: 'bancaCer', x: 4, y: 7, w: 3, h: 1, sprite: 'ceramica', talk: 'ceramica', repeat: 'ceramica_repeat' },
      { key: 'camaCaldas', x: 15, y: 10, w: 2, h: 2, sprite: 'cama', anim: 'camaFrames', talk: 'cama', hibernardo: true },
      { key: 'macoObj', x: 5, y: 11, w: 1, h: 1, sprite: 'maco' },
      { key: 'arbC', x: 3, y: 15, w: 1, h: 1, sprite: 'arbusto' }
    ],
    npcs: [
      { id: 'senhorCaldas', x: 9, y: 12, dir: 'down', char: 'senhor', talk: 'caldas_npc', repeat: 'caldas_npc_repeat', flag: 'caldas' },
      { id: 'ceramista', x: 13, y: 6, dir: 'down', char: 'ceramista', talk: 'ceramica', repeat: 'ceramica_repeat', flag: 'ceramica' },
      { id: 'senhoraCaldas', x: 6, y: 10, dir: 'down', char: 'senhora', talk: 'prova_cigarro', repeat: 'prova_cigarro_repeat', flag: 'cigarro', give: 'cigarro' }
    ],
    items: [],
    exits: [
      { x: 19, y: 13, w: 1, h: 1, to: 'floresta', sx: 1, sy: 10, dir: 'right' }
    ]
  },

  /* ====================== CLAREIRA DO BOSS ====================== */
  clareira: {
    id: 'clareira',
    name: '???',
    music: 'boss',
    shade: 'rgba(10,6,30,0.42)',
    tiles: [
      'WWWWWWWWSSWWWWWWWWWW',
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
      'WWWWWWWWSSWWWWWWWWWW'
    ],
    spawn: { x: 9, y: 15, dir: 'up' },
    objects: [
      { key: 'bossFigure', x: 8, y: 4, w: 4, h: 4, sprite: 'boss', fromEnemies: true }
    ],
    npcs: [],
    items: [],
    triggers: [
      { id: 'bossFight', x: 2, y: 9, w: 16, h: 2, event: 'boss' }
    ],
    exits: [
      { x: 8, y: 17, w: 2, h: 1, to: 'floresta', sx: 11, sy: 2, dir: 'down' },
      { x: 8, y: 0, w: 2, h: 1, to: 'alentejo', sx: 9, sy: 14, dir: 'up', need: 'alentejo' }
    ]
  },

  /* =========================== ALENTEJO =========================== */
  alentejo: {
    id: 'alentejo',
    name: 'ALENTEJO',
    music: 'fim',
    shade: 'rgba(60,40,10,0.10)',
    tiles: [
      'OOOOOOOOOOOOOOOOOOOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOAACCCCCCCCCCCCAAOO',
      'OOAACCCCCCCCCCCCAAOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOAAAAAAAAAAAAAAAAOO',
      'OOOOOOOOOAAOOOOOOOOO',
      'OOOOOOOOOAAOOOOOOOOO',
      'OOOOOOOOOAAOOOOOOOOO',
      'OOOOOOOOOAAOOOOOOOOO'
    ],
    spawn: { x: 9, y: 14, dir: 'up' },
    objects: [
      { key: 'casaFim', x: 8, y: 3, w: 3, h: 3, sprite: 'casa', talk: 'alentejo_casa', enter: true },
      { key: 'placaAlentejo', x: 12, y: 12, w: 3, h: 2, sprite: 'placaAlentejo', talk: 'alentejo_placa' },
      { key: 'oli1', x: 4, y: 7, w: 2, h: 2, sprite: 'oliveira' },
      { key: 'oli2', x: 15, y: 6, w: 2, h: 2, sprite: 'oliveira' },
      { key: 'oli3', x: 5, y: 3, w: 2, h: 2, sprite: 'oliveira' },
      { key: 'oli4', x: 14, y: 11, w: 2, h: 2, sprite: 'oliveira' }
    ],
    npcs: [
      { id: 'homemMonte', x: 6, y: 11, dir: 'right', char: 'homemMonte', talk: 'alentejo_npc', repeat: 'alentejo_npc_repeat', flag: 'homemMonte' }
    ],
    items: [],
    triggers: [
      { id: 'chegada', x: 2, y: 11, w: 16, h: 2, event: 'chegada' }
    ],
    exits: []
  }
};

/* ============================================================
   map.js - a loja, a rua e o Venezia
   Tiles: F chão da loja | W parede | P passeio | A asfalto
          X passadeira   | C chão do café | V parede do café
   Objetos: x,y,w,h em tiles (16px). O sprite alinha em baixo.
   ============================================================ */

export const MAP = {
  tiles: [
    'WWWWWWWWWWWWWWWWWW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WFFFFFFFFFFFFFFFFW',
    'WWWWWWWWFFWWWWWWWW',
    'PPPPPPPPPPPPPPPPPP',
    'AAAAAAAAXXAAAAAAAA',
    'AAAAAAAAXXAAAAAAAA',
    'PPPPPPPPPPPPPPPPPP',
    'VVVVVVVVCCVVVVVVVV',
    'VCCCCCCCCCCCCCCCCV',
    'VCCCCCCCCCCCCCCCCV',
    'VCCCCCCCCCCCCCCCCV',
    'VCCCCCCCCCCCCCCCCV',
    'VCCCCCCCCCCCCCCCCV',
    'VCCCCCCCCCCCCCCCCV',
    'VVVVVVVVVVVVVVVVVV'
  ],

  /* onde a Andreia começa o turno */
  spawn: { x: 8.5, y: 11 },

  /* portas (em tiles) */
  portaLoja: { x: 8.5, y: 13.5 },
  portaCafe: { x: 8.5, y: 18.5 },

  objects: [
    /* ---- prateleiras (a alma do negócio) ---- */
    { key: 'p1', kind: 'prateleira', nome: 'PRETAS',      x: 1,  y: 1, w: 3, h: 1 },
    { key: 'p2', kind: 'prateleira', nome: 'BRANCAS',     x: 5,  y: 1, w: 3, h: 1 },
    { key: 'p3', kind: 'prateleira', nome: 'COLORIDAS',   x: 9,  y: 1, w: 3, h: 1 },
    { key: 'p4', kind: 'prateleira', nome: 'ALGODÃO',     x: 1,  y: 5, w: 3, h: 1 },
    { key: 'p5', kind: 'prateleira', nome: 'DESPORTIVAS', x: 5,  y: 5, w: 3, h: 1 },
    { key: 'p6', kind: 'prateleira', nome: 'COMPRESSÃO',  x: 9,  y: 5, w: 3, h: 1 },

    /* ---- resto da loja ---- */
    { key: 'sec',   kind: 'secretaria', x: 13, y: 1,  w: 3, h: 2 },
    { key: 'bal',   kind: 'balcao',     x: 11, y: 9,  w: 5, h: 1 },
    { key: 'balde', kind: 'balde',      x: 1,  y: 11, w: 1, h: 1 },
    { key: 'pl1',   kind: 'planta',     x: 16, y: 11, w: 1, h: 1 },
    { key: 'pl2',   kind: 'planta',     x: 16, y: 6,  w: 1, h: 1 },
    { key: 'letr',  kind: 'letreiro',   x: 12, y: 13, w: 4, h: 1, deco: true },

    /* ---- Venezia ---- */
    { key: 'balcafe', kind: 'balcaoCafe',  x: 3,  y: 20, w: 4, h: 1 },
    { key: 'maq',     kind: 'maquinaCafe', x: 8,  y: 20, w: 2, h: 1 },
    { key: 'm1',      kind: 'mesaCafe',    x: 2,  y: 23, w: 1, h: 1 },
    { key: 'm2',      kind: 'mesaCafe',    x: 6,  y: 23, w: 1, h: 1 },
    { key: 'm3',      kind: 'mesaCafe',    x: 11, y: 23, w: 1, h: 1 },
    { key: 'm4',      kind: 'mesaCafe',    x: 14, y: 23, w: 1, h: 1 },
    { key: 'vsign',   kind: 'venezia',     x: 3,  y: 18, w: 4, h: 1, deco: true }
  ],

  /* onde os clientes gostam de parar (em frente às prateleiras) */
  pontosCliente: [
    /* ao lado das prateleiras, não em cima do sítio onde a Andreia arruma */
    { x: 1.7, y: 3.3 }, { x: 3.4, y: 3.3 }, { x: 5.7, y: 3.3 }, { x: 7.4, y: 3.3 },
    { x: 9.7, y: 3.3 }, { x: 11.4, y: 3.3 },
    { x: 1.7, y: 7.3 }, { x: 3.4, y: 7.3 }, { x: 5.7, y: 7.3 }, { x: 7.4, y: 7.3 },
    { x: 9.7, y: 7.3 }, { x: 11.4, y: 7.3 },
    { x: 13.6, y: 6.5 }, { x: 8.5, y: 9.4 }, { x: 13.2, y: 11.6 }, { x: 5.0, y: 11.5 }
  ],


  /* onde caem caixas de stock */
  pontosStock: [
    { x: 7.5, y: 11.5 }, { x: 5.5, y: 10.5 }, { x: 10.0, y: 11.0 },
    { x: 4.0, y: 12.0 }, { x: 12.0, y: 12.0 }, { x: 9.0, y: 9.5 }
  ],

  /* meias que aparecem misteriosamente no teto (topo da parede da loja) */
  teto: [
    { x: 2.4, y: 0.35 }, { x: 4.9, y: 0.2 }, { x: 7.6, y: 0.4 },
    { x: 11.3, y: 0.25 }, { x: 13.8, y: 0.4 }, { x: 15.2, y: 0.2 },
    { x: 9.4, y: 0.3 }
  ]
};

/* área de cada divisão, para saber onde a Andreia está */
export const AREAS = {
  loja:  { x0: 1, y0: 1, x1: 16, y1: 12 },
  rua:   { x0: 0, y0: 14, x1: 17, y1: 17 },
  cafe:  { x0: 1, y0: 19, x1: 16, y1: 24 }
};

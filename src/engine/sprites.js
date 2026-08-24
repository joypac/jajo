/* ============================================================
   sprites.js - fabrica de pixel art
   Duas formas de criar arte:
     makeSprite(rows, palette) -> a partir de "ASCII art"
     paint(w, h, fn)           -> a partir de retangulos (px)
   Ambas devolvem uma <canvas> pronta a desenhar.
   ============================================================ */

function newCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  return c;
}

/** rows: array de strings do mesmo tamanho. palette: { char: '#rrggbb' } */
export function makeSprite(rows, palette) {
  const h = rows.length;
  const w = rows[0].length;
  const c = newCanvas(w, h);
  const x = c.getContext('2d');
  for (let j = 0; j < h; j++) {
    const row = rows[j];
    for (let i = 0; i < w; i++) {
      const col = palette[row[i]];
      if (!col) continue;                 // '.' ou nao mapeado = transparente
      x.fillStyle = col;
      x.fillRect(i, j, 1, 1);
    }
  }
  return c;
}

/** fn recebe (px, ctx) onde px(x,y,w,h,cor) desenha um retangulo. */
export function paint(w, h, fn) {
  const c = newCanvas(w, h);
  const x = c.getContext('2d');
  const px = (a, b, ww, hh, col) => { x.fillStyle = col; x.fillRect(a | 0, b | 0, ww | 0, hh | 0); };
  fn(px, x, w, h);
  return c;
}

/** Desenha um sprite (opcionalmente espelhado na horizontal). */
export function draw(ctx, spr, x, y, flip) {
  if (!spr) return;
  if (flip) {
    ctx.save();
    ctx.translate((x | 0) + spr.width, y | 0);
    ctx.scale(-1, 1);
    ctx.drawImage(spr, 0, 0);
    ctx.restore();
  } else {
    ctx.drawImage(spr, x | 0, y | 0);
  }
}

/** Versao a branco de um sprite (usada no flash de dano). */
export function tinted(spr, color) {
  const c = newCanvas(spr.width, spr.height);
  const x = c.getContext('2d');
  x.drawImage(spr, 0, 0);
  x.globalCompositeOperation = 'source-in';
  x.fillStyle = color;
  x.fillRect(0, 0, spr.width, spr.height);
  return c;
}

/** Silhueta escura, para o boss aparecer misterioso. */
export function silhouette(spr, color) { return tinted(spr, color || '#0d0d1a'); }

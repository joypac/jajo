/* ============================================================
   scene.js - registo e troca de cenas
   ============================================================ */
const scenes = {};
let cur = null, curName = '';

export function register(name, scene) { scenes[name] = scene; }
export function go(name, params) {
  if (cur && cur.exit) cur.exit();
  cur = scenes[name];
  curName = name;
  if (cur && cur.enter) cur.enter(params || {});
}
export function sceneUpdate(dt) { if (cur && cur.update) cur.update(dt); }
export function sceneDraw() { if (cur && cur.draw) cur.draw(); }
export function currentScene() { return curName; }

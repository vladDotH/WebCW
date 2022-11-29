import { TileSet, Vec } from "./core";
import { createGameObject, SoundManager } from "./engine";
import { GameMap, parseMap } from "./map";
import { Game } from "./game";

// TODO менеджеры: карты, игры, спрайтов, событий, физики, звука

const app = document.getElementById("app");

const canvas = document.createElement("canvas");
canvas.style.margin = "auto";
canvas.style.display = "block";
app.appendChild(canvas);

const ctx = canvas.getContext("2d");
let size = Math.min(window.innerWidth, window.innerHeight);
[ctx.canvas.width, ctx.canvas.height] = [size, size];

void (async function () {
  const ts = new TileSet("./assets", "tileset.tsj");
  await ts.load();
  console.log(ts);

  const [field, objects] = await parseMap("./assets/map.tmj");

  console.log(field, objects);

  const map = new GameMap(ts, field);
  console.log(map);

  // console.log(map.getRealSize());
  // canvas.height = map.getRealSize().y;
  // canvas.width = map.getRealSize().x;

  console.log(map.get(new Vec(0, 0), true));
  console.log(map.get(new Vec(64, 64)));

  const gobj = objects.objects.map((o) => createGameObject(o, ts));
  await SoundManager.load("./assets/sounds");
  let game = new Game(ctx, ts, map, gobj);
})();

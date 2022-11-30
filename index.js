import { TileSet } from "./core";
import { createGameObject, SoundManager } from "./engine";
import { GameMap, parseMap } from "./map";
import { Game } from "./game";
import {
  appear,
  delay,
  disappear,
  hide,
  renderRecords,
  saveRecord,
  show,
} from "./util.js";

const ANIM_DELAY = 300;

const canvas = document.getElementById("canvas"),
  input = document.getElementById("inputSection"),
  end = document.getElementById("end"),
  winMsg = document.getElementById("winMsg"),
  gameOverMsg = document.getElementById("gameOverMsg"),
  records = document.getElementById("records");

const ctx = canvas.getContext("2d");
let size = Math.min(window.innerWidth, window.innerHeight);
[ctx.canvas.width, ctx.canvas.height] = [size, size];
ctx.font = "30px KJV1611";
ctx.fillStyle = "red";
ctx.save();

const levels = ["level1.tmj", "level2.tmj", "level3.tmj"];
const assets = "./assets";

[input, canvas, end, records].map((e) => {
  disappear(e);
  hide(e);
});
[winMsg, gameOverMsg].map(hide);

let playerName = "";

/** @param {TileSet} ts */
async function startGame(ts) {
  let time = Date.now();
  let res = false;
  for (let i = 0; i < levels.length; i++) {
    const [field, objects] = await parseMap(`${assets}/${levels[i]}`);
    let game = new Game(
      ctx,
      ts,
      new GameMap(ts, field),
      objects.objects.map((o) => createGameObject(o, ts))
    );
    appear(canvas);
    res = await game.startGame();
    disappear(canvas);
    await delay(ANIM_DELAY);
    game.restoreCanvas();
    if (!res) break;
  }
  hide(canvas);
  if (res) {
    show(winMsg);
    SoundManager.sounds.win.play(0.5);
    saveRecord(playerName, (Date.now() - time) / 1000);
  } else {
    show(gameOverMsg);
    SoundManager.sounds.dead.play(0.5);
  }
  show(end);
  await delay(ANIM_DELAY);
  appear(end);
}

(async function () {
  await SoundManager.load(`${assets}/sounds`);
  const ts = new TileSet(assets, "tileset.tsj");
  await ts.load();

  show(input);
  appear(input);
  show(document.body);
  input.querySelector("button").addEventListener("click", (ev) => {
    playerName = input.querySelector("input").value;
    disappear(input);
    setTimeout(() => {
      hide(input);
      show(canvas);
      startGame(ts);
    }, ANIM_DELAY);
  });

  end.querySelector("button").addEventListener("click", (ev) => {
    disappear(end);
    setTimeout(() => {
      hide(end);
      show(records);
      appear(records);
      renderRecords(records);
    }, ANIM_DELAY);
  });
})();

import {TileSet} from "./TileSet.js";
import {SpriteManager} from "./SpriteManager.js";
import {Vec} from "./core.js";
import {Map, parseMap} from "./Map.js";

// TODO менеджеры: карты, игры, спрайтов, событий, физики, звука


let app = document.getElementById("app");
console.log(app);

let canvas = document.createElement("canvas");
canvas.style.margin = 'auto';
canvas.style.display = 'block';
canvas.height = canvas.width = 900;
app.appendChild(canvas);

let ctx = canvas.getContext("2d");
ctx.fillStyle = "#ebac0c"
ctx.fillRect(-50, -50, 200, 200);
ctx.scale(0.7, 0.7);
ctx.save()

let img = new Image(50, 50);
img.src = "./assets/sprites/chest.png";

// img.onload = function (event) {
//     ctx.save();
//     ctx.translate(50 + 32, 50 + 32);
//     ctx.rotate(/*-Math.PI / 4*/ 0);
//     // ctx.scale(-1, -1)
//     ctx.translate(-32, -32);
//     ctx.drawImage(img, 0, 0);
//     ctx.restore();
// }

void async function () {
    let ts = new TileSet('./assets', 'tileset.tsj');
    await ts.load();
    console.log(ts);
    // let sm = new SpriteManager(ts);
    // await sm.load();
    // console.log(sm);

    let [field, objects] = await parseMap('./assets/map.tmj');
    let map = new Map(ts, field);
    console.log(map);

    console.log(map.get(new Vec(0, 0), true));
    console.log(map.get(new Vec(64, 64)));

    map.draw(ctx);

    ctx.drawImage(sm.get(48).image, 0, 0)
}()
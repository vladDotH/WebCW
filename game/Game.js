import { Engine } from "../engine";
import { Vec } from "../core";
import { EventManager, KeyEvents } from "./EventManager.js";

export class Game {
  /** @type {CanvasRenderingContext2D} */
  ctx;
  /** @type {TileSet} */
  ts;
  /** @type {Map} */
  map;
  /** @type {GameObject[]} */
  objects;
  /** @type {Entity} */
  player;
  /** @type {EventManager} */
  em;

  constructor(ctx, ts, map, objects) {
    this.ctx = ctx;
    this.ts = ts;
    this.map = map;
    this.objects = objects;
    console.log(objects);
    this.player = objects.find((o) => o.props.entity === "player");

    this.em = new EventManager(ctx);

    this.engine = new Engine(map, objects, ctx);
    setInterval(() => {
      this.player.velocity = new Vec(
        this.em.state.moves.has(KeyEvents.RIGHT) -
          this.em.state.moves.has(KeyEvents.LEFT),
        this.em.state.moves.has(KeyEvents.DOWN) -
          this.em.state.moves.has(KeyEvents.UP)
      )
        .norm()
        .mult(this.player.props.speed);
      this.engine.update();
    }, 10);
    this.engine.update();
    this.draw();
  }

  draw() {
    // TODO очищение со scale фактором
    this.ctx.clearRect(
      0,
      0,
      this.ctx.canvas.width * 2,
      this.ctx.canvas.height * 2
    );
    this.map.draw(this.ctx);
    this.engine.nonSolid.forEach((o) => o.draw(this.ctx));
    this.engine.solid.forEach((o) => o.draw(this.ctx));
    requestAnimationFrame(this.draw.bind(this));
  }
}

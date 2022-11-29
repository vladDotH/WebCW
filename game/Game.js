import { Engine, ObjectTypes } from "../engine";
import { Vec } from "../core";
import { EventManager, KeyEvents } from "./EventManager.js";
import { EnemyController } from "./EnemyController.js";

export class Game {
  /** @type {CanvasRenderingContext2D} */
  ctx;
  /** @type {TileSet} */
  ts;
  /** @type {GameMap} */
  map;
  /** @type {GameObject[]} */
  objects;
  /** @type {Entity} */
  player;
  /** @type {Exit} */
  exit;
  /** @type {EnemyController[]} */
  enemies;
  /** @type {EventManager} */
  em;
  /** @type {number} */
  mapScale;

  /** @param {CanvasRenderingContext2D} ctx
   * @param {TileSet} ts
   * @param {GameMap} map
   * @param {GameObject[]} objects */
  constructor(ctx, ts, map, objects) {
    this.ctx = ctx;
    this.ts = ts;
    this.map = map;
    this.objects = objects;
    console.log(objects);

    this.player = objects.find((o) => o.props.entity === "player");
    this.exit = objects.find((o) => o.type === ObjectTypes.EXIT);
    this.em = new EventManager(ctx);

    this.mapScale = Math.max(
      ctx.canvas.width / map.getRealSize().x,
      ctx.canvas.height / map.getRealSize().y
    );
    ctx.scale(this.mapScale, this.mapScale);

    this.engine = new Engine(map, objects, ctx);
    this.enemies = objects
      .filter((o) => o.props.entity === "enemy")
      .map((o) => new EnemyController(this.engine, o));

    setInterval(() => {
      // console.log(this.exit.isPlayerStepped(this.player));

      let mousePos = this.em.state.mousePos.mult(1 / this.mapScale);
      this.player.rot = mousePos.diff(this.player.pos).norm();
      this.player.velocity = new Vec(
        this.em.state.moves.has(KeyEvents.RIGHT) -
          this.em.state.moves.has(KeyEvents.LEFT),
        this.em.state.moves.has(KeyEvents.DOWN) -
          this.em.state.moves.has(KeyEvents.UP)
      )
        .norm()
        .mult(this.player.props.speed);

      if (this.em.state.moves.has(KeyEvents.SPACE))
        this.player.dropWeapon(this.engine, mousePos);

      if (this.em.state.mouseClick) this.player.attack(this.engine);

      this.enemies.forEach((e) => e.update());
      this.engine.update();
    }, 10);
    this.engine.update();
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, ...this.map.getRealSize().flat());
    this.map.draw(this.ctx);
    this.engine.nonSolid.forEach((o) => o.draw(this.ctx));
    this.engine.solid.forEach((o) => o.draw(this.ctx));
    requestAnimationFrame(this.draw.bind(this));
  }
}

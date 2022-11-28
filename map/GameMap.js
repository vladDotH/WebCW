import { Vec } from "../core";
import { Tile } from "./Tile.js";

export class GameMap {
  /** @type {Tile[][]} */
  field;
  /** @type {TileSet} */
  ts;
  /** @type {Vec} */
  size;
  /** @type {Vec} */
  tilesSize;

  /** @param {TileSet} ts
   * @param {any} field */
  constructor(ts, field) {
    this.size = new Vec(field.width, field.height);
    this.tilesSize = new Vec(field.tilewidth, field.tileheight);
    this.ts = ts;
    this.field = [];
    for (let i = 0; i < this.size.y; i++) {
      this.field.push([]);
      for (let j = 0; j < this.size.x; j++) {
        const id = field.data[i * this.size.x + j] - 1;
        this.field[i].push(new Tile(ts.get(id), new Vec(j, i)));
      }
    }
  }

  /** @returns {Vec} */
  getRealSize() {
    return this.size.mult(this.tilesSize);
  }

  /** @param {Vec} v
   * @return {Vec} */
  getIdx(v) {
    return new Vec(
      Math.floor(v.x / this.ts.size.x),
      Math.floor(v.y / this.ts.size.y)
    );
  }

  /** @param {Vec} v
   * @param {boolean} indexes
   * @return {Tile | null} */
  get(v, indexes = false) {
    if (!indexes) v = this.getIdx(v);
    return v.x < 0 || v.y < 0 ? null : this.field?.at(v.y)?.at(v.x) ?? null;
  }

  /** @param{CanvasRenderingContext2D} ctx */
  draw(ctx) {
    for (let y = 0; y < this.size.y; y++) {
      for (let x = 0; x < this.size.x; x++) {
        ctx.drawImage(
          this.get(new Vec(x, y), true)?.tile.sprite,
          x * this.ts.size.x,
          y * this.ts.size.y
        );
      }
    }
  }
}

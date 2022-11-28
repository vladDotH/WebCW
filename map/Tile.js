export class Tile {
  /** @type {boolean} */
  passable;
  /** @type {TileSetObject} */
  tile;
  /** @type {Vec} */
  pos;

  /** @param {TileSetObject} tile
   * @param {Vec} pos */
  constructor(tile, pos) {
    this.tile = tile;
    this.passable = tile.props.passable;
    this.pos = pos;
  }

  /** @returns {Vec} */
  getRealPos() {
    this.pos.mult(this.tile.size);
  }
}

import { TileSetObject } from "./TileSetObject.js";
import { Vec } from "./Vec.js";

export class TileSet {
  /** @type {string} */
  assetsPath;
  /** @type {string} */
  tsFile;
  /** @type {TileSetObject[]} */
  tiles = [];
  /** @type {Vec} */
  size;

  /**
   * @param {string} assetsPath
   * @param {string} tsFile
   */
  constructor(assetsPath, tsFile) {
    this.tsFile = tsFile;
    this.assetsPath = assetsPath;
  }

  /** @returns {Promise<void>} */
  async load() {
    let data = await (await fetch(`${this.assetsPath}/${this.tsFile}`)).json();
    this.size = new Vec(data.tileheight, data.tilewidth);
    await Promise.all(
      (this.tiles = data.tiles.map(
        (t) =>
          new TileSetObject({ ...t, image: `${this.assetsPath}/${t.image}` })
      )).map((s) => s.load())
    );
  }

  /** @param {number} id
   * @return {TileSetObject | null} */
  get(id) {
    return this.tiles.find((t) => t.id === id) ?? null;
  }
}

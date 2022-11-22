import {TileSetObject} from "./TileSetObject.js";
import {Vec} from "./core.js";
// import {Sprite} from "./Sprite";

export class TileSet {
    /** @type {string} */
    assetsPath;
    /** @type {string} */
    tsFile;
    /** @type {TileSetObject[]} */
    tiles = [];
    /** @type {Vec} */
    size

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
        console.log(this.tsFile)
        let data = (await (await fetch(`${this.assetsPath}/${this.tsFile}`)).json());
        this.size = new Vec(data.tileheight, data.tilewidth);
        for (let tile of data.tiles) {
            tile.sprite = `${this.assetsPath}/${tile.sprite}`;
            this.tiles.push(new TileSetObject(tile));
        }
        await Promise.all(this.tiles.map(s => s.load()));
    }

    /** @param {number} id
     * @return {TileSetObject | null} */
    get(id) {
        return this.tiles.find(t => t.id === id) ?? null;
    }
}
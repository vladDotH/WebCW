import {Sprite} from "./Sprite.js";

export const GIDMask = 0xf000_0000;

export class SpriteManager {
    /** @type {TileSet} */
    ts;
    /** @type {Sprite[]} */
    sprites = [];

    /** @param {TileSet} ts */
    constructor(ts) {
        this.ts = ts;
    }

    /** @returns {Promise<void>} */
    async load() {
        return Promise.all(
            (
                this.sprites = this.ts.tiles.map(
                    obj => new Sprite(obj.id, `${this.ts.assetsPath}/` + obj.imagePath, obj.width, obj.height)
                )
            ).map(s => s.load())
        );
    }

    /**
     * @param {number} id
     * @returns {Sprite | null}
     * */
    get(id) {
        id = id & (~GIDMask);
        return this.sprites.find(s => s.id === id) ?? null;
    }
}
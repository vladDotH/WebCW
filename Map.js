import {Vec} from "./core.js";

export class Tile {
    /** @type {string} */
    passable;
    /** @type {TileSetObject} */
    tile;

    /** @param {TileSetObject} tile */
    constructor(tile) {
        this.tile = tile;
        this.passable = tile.props.passable;
    }
}

/** @type {string} map
 * @returns {Promise<[any, any]>} [field, objects] */
export async function parseMap(mapFile) {
    let data = (await (await fetch(`${mapFile}`)).json());
    return [data?.layers?.find(e => e.name === "field"), data?.layers?.find(e => e.name === "objects")]
}

export class Map {
    /** @type {Tile[][]} */
    field;
    /** @type {SpriteManager} */
    ts;
    /** @type {Vec} */
    size;

    /** @param {TileSet} ts
     * @param {any} field */
    constructor(ts, field) {
        this.size = new Vec(field.width, field.height);
        this.ts = ts;
        this.field = [];
        for (let i = 0; i < this.size.y; i++) {
            this.field.push([])
            for (let j = 0; j < this.size.x; j++) {
                let id = field.data[i * this.size.x + j] - 1;
                this.field[i].push(
                    new Tile(ts.get(id), ts.get(id))
                )
            }
        }
    }

    /** @param {Vec} v
     * @param {boolean} indexes
     * @returns {Tile | null} */
    get(v, indexes = false) {
        return v.x < 0 || v.y < 0 ? null : (
            indexes ?
                this.field?.at(v.y)?.at(v.x) :
                this.field
                    ?.at(Math.floor(v.y / this.ts.ts.size.y))
                    ?.at(Math.floor(v.x / this.ts.ts.size.x))
        ) ?? null
    }

    /** @param{CanvasRenderingContext2D} ctx*/
    draw(ctx) {
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                ctx.drawImage(
                    this.get(new Vec(x, y), true).sprite.image,
                    x * this.ts.ts.size.x,
                    y * this.ts.ts.size.y
                )
            }
        }
    }
}
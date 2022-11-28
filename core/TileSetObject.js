import { Vec } from "./Vec.js";

export class TileSetObject {
  /** @type {number} */
  id;
  /** @type {string} */
  tclass;
  /** @type {string} */
  imagePath;
  /** @type {any} */
  props;
  /** @type {Vec} */
  size;
  /** @type {HTMLImageElement} */
  sprite;

  /** @param {any} obj */
  constructor(obj) {
    let props = {};
    for (let prop of obj.properties) {
      props[prop.name] = prop.value;
    }
    [this.id, this.tclass, this.imagePath, this.size, this.props] = [
      obj.id,
      obj.class,
      obj.image,
      new Vec(obj.imagewidth, obj.imageheight),
      props,
    ];
    this.sprite = new Image(...this.size.flat());
  }

  /** @returns {Promise<void>} */
  async load() {
    return new Promise((resolve) => {
      this.sprite.src = this.imagePath;
      this.sprite.onload = () => {
        resolve();
      };
    });
  }
}

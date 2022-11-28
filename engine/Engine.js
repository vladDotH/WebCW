export class Engine {
  /** @type {GameMap}*/
  map;
  /** @type {GameObject[]}*/
  objects;
  /** @type {GameObject[]} */
  solid;
  /** @type {GameObject[]} */
  nonSolid;

  constructor(map, objects, ctx) {
    this.map = map;
    this.objects = objects;
    this.ctx = ctx;
    this.solid = objects.filter((o) => o.props.solid === true);
    this.nonSolid = objects.filter((o) => o.props.solid === false);
  }

  /** @param {GameObject} obj
   * @param {number} range
   * @returns {GameObject[]} */
  getNear(obj, range) {
    return this.objects.filter((o) => obj.isNear(o.pos, range) && o !== obj);
  }

  update() {
    this.objects.forEach((o) => {
      o.update(this.getNear(o, 200), this.map);
    });
  }
}

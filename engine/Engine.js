import { SoundManager } from "./SoundManager.js";

export class Engine {
  /** @type {GameMap}*/
  map;
  /** @type {GameObject[]}*/
  objects;
  /** @type {GameObject[]} */
  solid;
  /** @type {GameObject[]} */
  nonSolid;
  /** @type {typeof SoundManager} */
  sm = SoundManager;
  /** @type {Entity} */
  player;

  /** @param {GameMap} map
   * @param {GameObject[]} objects */
  constructor(map, objects) {
    this.map = map;
    this.objects = objects;
    this.calcSolids();
    this.player = objects.find((o) => o.props.entity === "player");
  }

  /** @param {Sound} sound
   * @param {Vec} pos
   * @returns {Promise<void>} */
  async playSound(sound, pos) {
    await sound.play(
      Math.min(
        1,
        Math.max(
          0.3,
          1 -
            (2 * this.player.pos.diff(pos).len2()) /
              this.map.getRealSize().len2()
        )
      )
    );
  }

  calcSolids() {
    this.solid = this.objects.filter((o) => o.props.solid === true);
    this.nonSolid = this.objects.filter((o) => o.props.solid === false);
  }

  /** @param {GameObject} obj */
  destroy(obj) {
    this.objects.splice(this.objects.indexOf(obj), 1);
    this.calcSolids();
  }

  /** @param {GameObject} obj */
  add(obj) {
    this.objects.push(obj);
    this.calcSolids();
  }

  update() {
    this.objects.forEach((o) => {
      o.update(this);
    });
  }
}

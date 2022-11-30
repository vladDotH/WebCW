import { rad, Vec } from "../../core";

export class GameObject {
  /** @type {Vec} */
  pos;
  /** @type {Vec} */
  rot;
  /** @type {Vec} */
  size;
  /** @type {ObjectTypes} */
  type;
  /** @type {TileSetObject} */
  tsObj;
  /** @type {any} */
  props;
  /** @type {Vec} */
  velocity = new Vec();
  /** @type {Shape} */
  shape;
  /** @type {boolean} */
  solid;

  /** @param {TileSetObject} tsObj
   * @param {any} obj */
  constructor(obj, tsObj) {
    this.size = new Vec(obj.width, obj.height);
    this.rot = Vec.fromAngle(rad(obj.rotation));
    this.pos = new Vec(obj.x, obj.y).add(
      this.size.mult(0.5).rot(rad(obj.rotation - 90))
    );
    this.tsObj = tsObj;
    this.props = { ...tsObj.props };
    this.type = this.props.type;
    this.solid = this.props.solid;
  }

  /** @param{CanvasRenderingContext2D} ctx */
  draw(ctx) {
    ctx.save();
    ctx.transform(
      ...this.rot.flat(),
      -this.rot.y,
      this.rot.x,
      ...this.pos.flat()
    );
    ctx.drawImage(
      this.tsObj.sprite,
      ...this.size.mult(-0.5).flat(),
      ...this.size.flat()
    );
    ctx.restore();
  }

  /** @param {Vec} dot
   * @param {number} range
   * @returns {boolean} */
  isNear(dot, range) {
    return this.pos.range(dot) < range;
  }

  /** @param {Vec} velocity */
  move(velocity) {
    this.velocity = velocity;
  }

  /** @param {Vec} rot */
  rotate(rot) {
    this.rot = rot;
  }

  /** @param {Engine} engine */
  update(engine) {
    if (this.solid && this.props.hp !== undefined && this.props.hp <= 0)
      engine.destroy(this);

    this.pos = this.pos.add(this.velocity);
  }

  /** @param {Engine} engine
   * @param {number} value */
  receiveDamage(engine, value) {
    if (this.props?.hp) {
      this.props.hp -= value;
      engine.playSound(engine.sm.sounds.punch, this.pos);
    }
  }
}

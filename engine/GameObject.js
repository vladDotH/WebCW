import { Vec, rad } from "../core";

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

    this.drawBorders(ctx);
  }

  /** @deprecated */
  drawBorders(ctx) {
    // TODO убрать тест границ
    ctx.save();
    if (this.props.shape === "circle") {
      ctx.beginPath();
      ctx.arc(...this.pos.flat(), this.props.radius, 0, 2 * Math.PI, false);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#003300";
      ctx.stroke();
    }
    if (this.props.shape === "rect") {
      ctx.beginPath();
      ctx.transform(
        ...this.rot.flat(),
        -this.rot.y,
        this.rot.x,
        ...this.pos.flat()
      );

      ctx.rect(
        ...new Vec(this.props.width, this.props.height).mult(-0.5).flat(),
        ...new Vec(this.props.width, this.props.height).flat()
      );
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#003300";
      ctx.stroke();
    }
    ctx.restore();
  }

  /** @param {Vec} dot
   * @param {number} range
   * @returns {boolean} */
  isNear(dot, range) {
    return this.pos.diff(dot).len() < range;
  }

  /** @param {Vec} velocity */
  move(velocity) {
    this.velocity = velocity;
  }

  /** @param {Vec} rot */
  rotate(rot) {
    this.rot = rot;
  }

  /** @param {GameObject[]} objects
   * @param {GameMap} map */
  update(objects, map) {
    this.pos = this.pos.add(this.velocity);
  }
}

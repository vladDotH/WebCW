import { rad, Vec } from "../core";

/** @enum {string} */
export const ShapeTypes = {
  RECT: "rect",
  CIRCLE: "circle",
};

export class Shape {
  /** @type {GameObject} */
  obj;

  /** @param {GameObject} obj */
  constructor(obj) {
    this.obj = obj;
  }

  /** @param {Vec} dot
   * @returns {boolean}
   * @abstract */
  inside(dot) {
    return false;
  }

  /** @param {Vec} vec
   * @returns {Vec}
   * @abstract */
  getBorderDot(vec) {
    return new Vec();
  }
}

export class Circle extends Shape {
  /** @override */
  inside(dot) {
    return this.obj.pos.diff(dot).len() <= this.obj.props.radius;
  }

  /** @override */
  getBorderDot(vec) {
    return vec.norm().mult(this.obj.props.radius);
  }
}

export class Rect extends Shape {
  /** @override */
  inside(dot) {
    let v = this.obj.pos.diff(dot);
    return (
      Math.abs(this.obj.rot.proj(v)) <= this.obj.props.width / 2 &&
      Math.abs(this.obj.rot.rot(rad(90)).proj(v)) <= this.obj.props.height / 2
    );
  }

  getBorderDot(vec) {
    let nvec = vec
      .norm()
      .mult((this.obj.props.width ** 2 + this.obj.props.height ** 2) ** (1 / 2))
      .abs();
    return vec
      .sign()
      .mult(
        new Vec(
          Math.min(this.obj.rot.proj(nvec), this.obj.props.width / 2),
          Math.min(
            this.obj.rot.rot(rad(90)).proj(nvec),
            this.obj.props.height / 2
          )
        ).rot(this.obj.rot)
      );
  }
}

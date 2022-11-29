export class Vec {
  /** @type {number} */
  x;
  /** @type {number} */
  y;

  /** @param {number} x
   * @param {number} y */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /** @param {number} a
   * @return {Vec} */
  static fromAngle(a) {
    return new Vec(Math.cos(a), Math.sin(a));
  }

  /** @return{Vec} */
  sign() {
    return new Vec(...this.flat().map(Math.sign));
  }

  /** @return{Vec} */
  abs() {
    return new Vec(...this.flat().map(Math.abs));
  }

  /** @return{[number, number]} */
  flat() {
    return [this.x, this.y];
  }

  /** @return {Vec} */
  neg() {
    return new Vec(-this.x, -this.y);
  }

  /** @param {Vec} v
   * @return {Vec} */
  add(v) {
    return new Vec(this.x + v.x, this.y + v.y);
  }

  /** @param {Vec} v
   * @return {Vec} */
  diff(v) {
    return this.add(v.neg());
  }

  /** @param {number | Vec} k
   * @return {Vec} */
  mult(k) {
    return typeof k === "number"
      ? new Vec(this.x * k, this.y * k)
      : new Vec(this.x * k.x, this.y * k.y);
  }

  /** @param {Vec} v
   * @return {number} */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /** @return {number} */
  len2() {
    return this.x ** 2 + this.y ** 2;
  }

  /** @return {number} */
  len() {
    return this.len2() ** (1 / 2);
  }

  /** @return {Vec} */
  norm() {
    let len = this.len();
    return len !== 0 ? new Vec(this.x, this.y).mult(1 / len) : new Vec();
  }

  /** @param {Vec|number} v
   * @return {Vec} */
  rot(v) {
    if (typeof v === "number") {
      return this.rot(Vec.fromAngle(v));
    } else {
      v = v.norm();
      return new Vec(this.x * v.x - this.y * v.y, this.x * v.y + this.y * v.x);
    }
  }

  /** @param {Vec} v
   * @return {number} */
  proj(v) {
    return this.dot(v) / this.len();
  }

  /** @param {Vec} v
   * @return {Vec} */
  vecProj(v) {
    return this.norm().mult(this.proj(v));
  }

  /** @param {Vec} v
   * @return {Vec} */
  compare(v) {
    return new this.diff(v).sign();
  }

  /** @param {Vec} v
   * @return {number} */
  range(v) {
    return this.diff(v).len();
  }
}

export const axisX = new Vec(1, 0);
export const axisY = new Vec(0, 1);

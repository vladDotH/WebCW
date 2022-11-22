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

    /** @returns{[number, number]} */
    flat() {
        return [this.x, this.y];
    }

    /** @param {number} a
     * @returns {Vec} */
    static fromAngle(a) {
        return new Vec(Math.cos(a), Math.sin(a));
    }

    /** @returns {Vec} */
    neg() {
        return new Vec(-this.x, -this.y);
    }

    /** @param {Vec} v
     * @returns {Vec} */
    add(v) {
        return new Vec(this.x + v.x, this.y + v.y);
    }

    /** @param {Vec} v
     * @returns {Vec} */
    diff(v) {
        return this.add(v.neg());
    }

    /** @param {number} k
     * @returns {Vec} */
    mult(k) {
        return new Vec(this.x * k, this.y * k);
    }

    /** @param {Vec} v
     * @returns {number} */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    /** @returns {number} */
    len2() {
        return this.x ** 2 + this.y ** 2;
    }

    /** @returns {number} */
    len() {
        return this.len2() ** (1 / 2)
    }

    /** @returns {Vec} */
    norm() {
        let len = this.len();
        return new Vec(this.x / len, this.y / len);
    }

    /** @param {Vec|number} v
     * @param {boolean} deg
     * @returns {Vec} */
    rot(v, deg = false) {
        if (typeof (v) === "number") {
            return this.rot(Vec.fromAngle(deg ? Math.PI * v / 180 : v));
        } else {
            v = v.norm();
            return new Vec(
                this.x * v.x - this.y * v.y,
                this.x * v.y + this.y * v.x
            );
        }
    }
}

export class GameObject {
    /** @type {Vec} */
    pos;
    /** @type {Vec} */
    rot;
    /** @type {Vec} */
    size;

    /**
     * @param {Vec} pos
     * @param {Vec} rot
     * */
    constructor(pos, rot) {
        this.pos = pos;
        this.rot = rot;
    }
}
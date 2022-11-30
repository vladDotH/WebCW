import { GameObject } from "./GameObject.js";
import { ObjectTypes } from "../index.js";
import { rad } from "../../core";
import { Projectile } from "./Projectile.js";

export const WEAPON_ANGLE = rad(45);
export const WEAPON_TRANSLATION = 20;

/** @enum {string} */
export const WeaponTypes = {
  MELEE: "melee",
  RANGE: "range",
};

export class Weapon extends GameObject {
  /** @type {Entity} */
  owner = null;

  /** @override */
  update(engine) {
    super.update(engine);

    let receiver = engine.objects
      .filter((o) => o.type === ObjectTypes.ENTITY)
      .filter((o) => o.shape.inside(this.pos))
      .at(0);

    if (!this.owner && receiver && !receiver?.weapon) {
      this.owner = receiver;
      receiver.weapon = this;
      engine.playSound(engine.sm.sounds.grab, this.pos);
    }

    // console.log(this.owner?.attackAnim);
    if (this.owner) {
      this.pos = this.owner.pos.add(
        this.owner.rot.rot(WEAPON_ANGLE).norm().mult(WEAPON_TRANSLATION)
      );
      this.rotate(this.owner.rot);
    }
  }

  draw(ctx) {
    if (!this.owner) super.draw(ctx);
  }

  /** @param {CanvasRenderingContext2D} ctx */
  drawWithOwner(ctx) {
    super.draw(ctx);
  }

  /** @param {Engine} engine */
  attack(engine) {
    switch (this.props.range) {
      case WeaponTypes.RANGE:
        engine.playSound(engine.sm.sounds.bow_shoot, this.pos);
        engine.add(Projectile.createProjectile(engine, this));
        break;
      case WeaponTypes.MELEE:
        engine.playSound(engine.sm.sounds.hit, this.pos);
        engine.objects
          .filter(
            (o) =>
              o !== this.owner &&
              o.pos.range(this.owner.pos) <=
                this.props.dist + this.owner.size.len()
          )
          .filter(
            (o) =>
              this.owner.rot.dot(o.pos.diff(this.owner.pos).norm()) >=
              Math.cos(rad(this.props.angle))
          )
          .forEach((o) => {
            o.receiveDamage(engine, this.props.damage);
          });
        break;
    }
  }
}

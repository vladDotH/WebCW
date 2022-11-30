import { GameObject } from "./GameObject.js";
import { axisX, axisY, Vec } from "../../core";
import { solidCollisionsUpdate, WeaponTypes } from "../index.js";

export const MAX_DROP_RANGE = 96;
export const BASE_ATTACK_DELAY = 700;
export const ATTACK_ANIM_DELAY = 75;
export const MELEE_ATTACKING_ANGLE = 0.2;
export const MELEE_ATTACKING_ROT = Vec.fromAngle(-MELEE_ATTACKING_ANGLE);
export const MELEE_ATTACKING_ROT_INV = Vec.fromAngle(MELEE_ATTACKING_ANGLE);

export class Entity extends GameObject {
  /** @type {Weapon} */
  weapon = null;
  /** @type {boolean} */
  attacking = false;
  /** @type {number} */
  attackAnim = 0;
  /** @type {Vec} */
  attackingRot = Vec.fromAngle(0);

  /** @override */
  update(engine) {
    solidCollisionsUpdate(
      this,
      engine.solid.filter(
        (o) => o.pos.diff(this.pos).len2() <= this.size.add(o.size).len2()
      )
    );

    if (!engine.map.get(this.pos.add(axisX.vecProj(this.velocity)))?.passable)
      this.velocity.x = 0;
    if (!engine.map.get(this.pos.add(axisY.vecProj(this.velocity)))?.passable)
      this.velocity.y = 0;

    if (this.weapon?.props?.range === WeaponTypes.MELEE && this.attacking) {
      this.attackingRot =
        this.attackAnim === 0
          ? Vec.fromAngle(0)
          : this.attackingRot.rot(
              this.attackAnim === 1
                ? MELEE_ATTACKING_ROT
                : MELEE_ATTACKING_ROT_INV
            );
      this.rotate(this.rot);
    }

    super.update(engine);
    if (this.props?.hp <= 0) {
      this.dropWeapon(engine, this.pos);
    }
  }

  /** @override */
  rotate(rot) {
    rot = rot.rot(this.attackingRot);
    super.rotate(rot);
  }

  /** @override */
  move(velocity) {
    if (velocity.len() > this.props.speed)
      velocity = velocity.norm().mult(this.props.speed);
    super.move(velocity);
  }

  /** @override */
  draw(ctx) {
    super.draw(ctx);
    ctx.fillText(
      this.props.hp + "hp",
      ...this.pos.diff(this.size.mult(1 / 2)).flat()
    );

    this.weapon?.drawWithOwner(ctx);
  }

  /** @param {Engine} engine */
  attack(engine) {
    if (!this.attacking) {
      this.attackAnim = +(this.attacking = true);
      this?.weapon?.attack(engine);
      setTimeout(() => (this.attacking = false), BASE_ATTACK_DELAY);
      setTimeout(() => {
        this.attackAnim = -1;
        setTimeout(() => (this.attackAnim = 0), ATTACK_ANIM_DELAY);
      }, ATTACK_ANIM_DELAY);
    }
  }

  /** @param {Engine} engine
   *  @param {Vec} pos */
  dropWeapon(engine, pos) {
    if (this.weapon) {
      engine.playSound(engine.sm.sounds.drop, this.pos);
      this.weapon.owner = null;
      this.weapon.pos =
        pos.range(this.pos) <= MAX_DROP_RANGE
          ? pos
          : this.pos.add(pos.diff(this.pos).norm().mult(MAX_DROP_RANGE));
      this.weapon = null;
    }
  }
}

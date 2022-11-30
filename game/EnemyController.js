import { ObjectTypes, WeaponTypes } from "../engine";
import { Vec } from "../core";

export const VISIBILITY_RANGE = 600;
export const WEAPON_FIND_RANGE = 400;
export const RANGE_ATTACK = 500;
export const MELEE_ATTACK = 90;
export const RUN_RANGE = 200;
export const BYPASS_RANGE = 150;
export const MIN_BYPASS_SPEED = 0.3;
export const ATTACK_DELAY = 500;

export class EnemyController {
  /** @type {Engine} */
  engine;
  /** @type {Entity} */
  entity;
  /** @type {boolean} */
  attackDelay = false;

  /** @param {Engine} engine
   * @param {Entity} entity */
  constructor(engine, entity) {
    this.engine = engine;
    this.entity = entity;
  }

  /** @returns {boolean} */
  findWeapon() {
    let weapon = this.engine.objects
      .filter((o) => o.type === ObjectTypes.WEAPON && !o.owner)
      .filter((o) => o.pos.range(this.entity.pos) <= WEAPON_FIND_RANGE)
      .sort(
        (a, b) => a.pos.range(this.entity.pos) - b.pos.range(this.entity.pos)
      )
      .at(0);
    if (weapon) {
      this.entity.velocity = weapon.pos
        .diff(this.entity.pos)
        .norm()
        .mult(this.entity.props.speed);
      return true;
    } else return false;
  }

  runAway() {
    this.entity.move(this.entity.pos.diff(this.engine.player.pos));
  }

  attack() {
    this.entity.rotate(this.engine.player.pos.diff(this.entity.pos).norm());
    if (!this.attackDelay) {
      setTimeout(() => {
        this.entity.attack(this.engine);
        this.attackDelay = false;
      }, ATTACK_DELAY);
      this.attackDelay = true;
    }
  }

  /** @param {number} range */
  shoot(range) {
    if (range <= RANGE_ATTACK) {
      this.attack();
    } else
      this.entity.move(
        this.engine.player.pos
          .diff(this.entity.pos)
          .norm()
          .mult(this.entity.props.speed)
      );
  }

  /** @param {number} range */
  hit(range) {
    if (range >= MELEE_ATTACK)
      this.entity.move(
        this.engine.player.pos
          .diff(this.entity.pos)
          .norm()
          .mult(range / MELEE_ATTACK)
      );
    else this.attack();
  }

  bypass() {
    this.engine.solid.forEach((o) => {
      let range = o.pos.diff(this.entity.pos).len();
      if (range <= BYPASS_RANGE && range > 0 && o !== this.entity)
        this.entity.move(
          this.entity.velocity.add(
            this.entity.pos
              .diff(o.pos)
              .norm()
              .mult(Math.min(this.entity.size.len() / range, MIN_BYPASS_SPEED))
          )
        );
    });
  }

  update() {
    this.entity.velocity = new Vec();
    let range = this.engine.player.pos.range(this.entity.pos);

    if (!this.entity.weapon) {
      if (!this.findWeapon() && range <= RUN_RANGE) this.runAway();
    } else {
      if (range <= VISIBILITY_RANGE) {
        if (this.entity.weapon?.props?.range === WeaponTypes.RANGE)
          this.shoot(range);
        else this.hit(range);
      }
    }
    this.bypass();

    if (range < VISIBILITY_RANGE)
      this.entity.rotate(this.engine.player.pos.diff(this.entity.pos).norm());
    else if (this.entity.velocity.len2())
      this.entity.rotate(this.entity.velocity.norm());
  }
}

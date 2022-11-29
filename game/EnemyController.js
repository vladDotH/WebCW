import { ObjectTypes, WeaponTypes } from "../engine";
import { Vec } from "../core";

export const VISIBILITY_RANGE = 600;
export const WEAPON_FIND_RANGE = 400;
export const RANGE_ATTACK = 500;
export const MELEE_ATTACK = 100;

export class EnemyController {
  /** @type {Engine} */
  engine;
  /** @type {Entity} */
  entity;

  /** @param {Engine} engine
   * @param {Entity} entity */
  constructor(engine, entity) {
    this.engine = engine;
    this.entity = entity;
  }

  update() {
    this.entity.velocity = new Vec();
    // Поиск оружия
    if (!this.entity.weapon) {
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
      }
    } else {
      let range = this.engine.player.pos.range(this.entity.pos);
      // Если игрок в радиусе видимости
      if (range <= VISIBILITY_RANGE) {
        // Если есть дальнее оружие
        if (this.entity.weapon?.props?.range === WeaponTypes.RANGE) {
          if (range <= RANGE_ATTACK) {
            this.entity.rot = this.engine.player.pos
              .diff(this.entity.pos)
              .norm();
            this.entity.attack(this.engine);
          } else
            this.entity.velocity = this.engine.player.pos
              .diff(this.entity.pos)
              .norm()
              .mult(this.entity.props.speed);
        } else {
          if (range >= MELEE_ATTACK)
            this.entity.velocity = this.engine.player.pos
              .diff(this.entity.pos)
              .norm()
              .mult(this.entity.props.speed);
          else {
            this.entity.rot = this.engine.player.pos
              .diff(this.entity.pos)
              .norm();
            this.entity.attack(this.engine);
          }
        }
      }
    }

    if (this.entity.velocity.len2())
      this.entity.rot = this.entity.velocity.norm();
  }
}

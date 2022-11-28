import { axisX, axisY } from "../core";
import { Circle, Rect, Shape, ShapeTypes } from "./shapes.js";
import { GameObject } from "./GameObject.js";

/** @enum {string} */
export const ObjectTypes = {
  OBJECT: "object",
  EXIT: "exit",
  ENTITY: "entity",
  BONUS: "bonus",
  WEAPON: "weapon",
  PROJECTILE: "projectile",
};

/** @param {GameObject} obj
 * @param {GameObject[]} objects
 * @param {GameMap} map */
function solidCollisionsUpdate(obj, objects, map) {
  if (obj.solid && Math.abs(obj.velocity.len2()) > 0)
    objects
      .filter((n) => n.props.solid)
      .forEach((n) => {
        let borderDot = obj.shape.getBorderDot(n.pos.diff(obj.pos));
        if (n.shape.inside(obj.pos.add(obj.velocity).add(borderDot)))
          obj.velocity = obj.velocity.add(
            obj.pos.add(borderDot).diff(n.pos).norm().mult(obj.velocity.len())
          );
      });
}

export class Exit extends GameObject {
  /** @param {Entity} player
   * @returns {boolean} */
  isPlayerStepped(player) {
    return player.shape.inside(this.pos);
  }
}

export class Entity extends GameObject {
  attack() {}

  /** @override */
  update(objects, map) {
    if (this.solid && Math.abs(this.velocity.len2()) > 0)
      solidCollisionsUpdate(this, objects, map);
    if (!map.get(this.pos.add(axisX.vecProj(this.velocity)))?.passable)
      this.velocity.x = 0;
    if (!map.get(this.pos.add(axisY.vecProj(this.velocity)))?.passable)
      this.velocity.y = 0;
    super.update(objects, map);
  }
}

export class Bonus extends GameObject {
  update(objects, map) {
    super.update(objects, map);
  }
}

export class Weapon extends GameObject {
  update(objects, map) {
    super.update(objects, map);
  }
}

export class Projectile extends GameObject {
  update(objects, map) {
    super.update(objects, map);
  }
}

/** @param {any} obj
 * @param {TileSet} ts */
export function createGameObject(obj, ts) {
  let tsObj = ts.get(obj.gid - 1);
  let o = new [GameObject, Exit, Entity, Bonus, Weapon, Projectile][
    [
      ObjectTypes.OBJECT,
      ObjectTypes.EXIT,
      ObjectTypes.ENTITY,
      ObjectTypes.BONUS,
      ObjectTypes.WEAPON,
      ObjectTypes.PROJECTILE,
    ].indexOf(tsObj.props.type)
  ](obj, tsObj);
  o.shape = new ([Rect, Circle][
    [ShapeTypes.RECT, ShapeTypes.CIRCLE].indexOf(tsObj.props.shape)
  ] ?? Shape)(o);
  return o;
}

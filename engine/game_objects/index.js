import { GameObject } from "./GameObject.js";
import { Exit } from "./Exit.js";
import { Entity } from "./Entity.js";
import { Bonus } from "./Bonus.js";
import { Weapon } from "./Weapon.js";
import { Projectile } from "./Projectile.js";
import { Circle, Rect, Shape, ShapeTypes } from "../shapes.js";

export * from "./GameObject.js";
export * from "./Exit.js";
export * from "./Bonus.js";
export * from "./Weapon.js";
export * from "./Projectile.js";
export * from "./Entity.js";

/** @param {GameObject} obj
 * @param {GameObject[]} objects */
export function solidCollisionsUpdate(obj, objects) {
  if (obj.solid && Math.abs(obj.velocity.len2()) > 0)
    objects.forEach((n) => {
      let borderDot = obj.shape.getBorderDot(n.pos.diff(obj.pos));
      if (n.shape.inside(obj.pos.add(obj.velocity).add(borderDot)))
        obj.velocity = obj.velocity.add(
          obj.pos.add(borderDot).diff(n.pos).norm().mult(obj.velocity.len())
        );
    });
}

/** @enum {string} */
export const ObjectTypes = {
  OBJECT: "object",
  EXIT: "exit",
  ENTITY: "entity",
  BONUS: "bonus",
  WEAPON: "weapon",
  PROJECTILE: "projectile",
};

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
      // ObjectTypes.PROJECTILE,
    ].indexOf(tsObj.props.type)
  ](obj, tsObj);
  o.shape = new ([Rect, Circle][
    [ShapeTypes.RECT, ShapeTypes.CIRCLE].indexOf(tsObj.props.shape)
  ] ?? Shape)(o);
  return o;
}

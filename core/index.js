export * from "./Vec.js";
export * from "./TileSetObject.js";
export * from "./TileSet.js";

const radCoef = Math.PI / 180;

/** @param {number} angle
 * @returns {number} */
export function rad(angle) {
  return angle * radCoef;
}

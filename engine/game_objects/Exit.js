import { GameObject } from "./GameObject.js";

export class Exit extends GameObject {
  /** @param {Entity} player
   * @returns {boolean} */
  isPlayerStepped(player) {
    return player.shape.inside(this.pos);
  }
}

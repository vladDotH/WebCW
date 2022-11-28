import { Vec } from "../core";

/** @enum {number} */
export const KeyEvents = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
  SPACE: 4,
};

/** @param {KeyboardEvent} ev
 * @returns {KeyEvents} */
export function getKeyEvent(ev) {
  return [
    KeyEvents.UP,
    KeyEvents.LEFT,
    KeyEvents.DOWN,
    KeyEvents.RIGHT,
    KeyEvents.SPACE,
  ][["w", "a", "s", "d", " "].indexOf(ev.key)];
}

export class InputState {
  /** @type {Vec} */
  mousePos = new Vec();
  /** @type {boolean} */
  mouseClick = false;
  /** @type {Set<KeyEvents>} */
  moves = new Set();
}

export class EventManager {
  /** type {InputState} */
  state = new InputState();

  /** @param {CanvasRenderingContext2D} ctx */
  constructor(ctx) {
    ctx.canvas.addEventListener("mousemove", (ev) => {
      let rect = ctx.canvas.getBoundingClientRect();
      this.state.mousePos = new Vec(
        ev.clientX - rect.left,
        ev.clientY - rect.top
      );
    });
    ctx.canvas.addEventListener("mousedown", (ev) => {
      this.state.mouseClick = true;
    });
    ctx.canvas.addEventListener("mouseup", (ev) => {
      this.state.mouseClick = false;
    });
    window.addEventListener("keydown", (ev) => {
      this.state.moves.add(getKeyEvent(ev));
    });
    window.addEventListener("keyup", (ev) => {
      this.state.moves.delete(getKeyEvent(ev));
    });
  }
}

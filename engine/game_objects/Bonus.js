import { GameObject } from "./GameObject.js";
import { ObjectTypes } from "./index.js";

/** @enum {number} */
export const BonusEffects = {
  HEAL: "heal",
};

export class Bonus extends GameObject {
  /** @override */
  update(engine) {
    super.update(engine);

    let receiver = engine.objects
      .filter((o) => o.type === ObjectTypes.ENTITY)
      .filter((o) => o.shape.inside(this.pos))
      .at(0);

    if (receiver) {
      engine.playSound(engine.sm.sounds.drink, this.pos);
      switch (this.props.effect) {
        case BonusEffects.HEAL:
          receiver.props.hp += this.props.value;
          engine.destroy(this);
          break;
      }
    }
  }
}

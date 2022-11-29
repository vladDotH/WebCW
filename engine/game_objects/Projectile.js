import { GameObject } from "./GameObject.js";

export class Projectile extends GameObject {
  /** @type {Weapon} */
  source;

  /** @param {Engine} engine
   * @param {Weapon} source
   * @returns {Projectile} */
  static createProjectile(engine, source) {
    let tsObj = engine.map.ts.get(source.props.ammoId);
    let projectile = new Projectile(
      { width: tsObj.size.x, height: tsObj.size.y },
      tsObj
    );
    projectile.pos = source.pos;
    projectile.rot = source.owner.rot;
    projectile.velocity = source.owner.rot.mult(projectile.props.speed);
    projectile.source = source;
    return projectile;
  }

  /** @override */
  update(engine) {
    super.update(engine);

    if (
      this.pos.x < 0 ||
      this.pos.y < 0 ||
      this.pos.x > engine.map.getRealSize().x ||
      this.pos.y > engine.map.getRealSize().y
    )
      engine.destroy(this);

    let receiver = engine.objects
      .filter((o) => o.solid)
      .filter((o) => o.shape.inside(this.pos))
      .at(0);

    if (receiver) {
      engine.destroy(this);
      receiver.receiveDamage(engine, this.source.props.damage);
      engine.playSound(engine.sm.sounds.arrow_impact, this.pos);
    }
  }
}

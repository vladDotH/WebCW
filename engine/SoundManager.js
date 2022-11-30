import { Sound } from "./Sound.js";

export const SoundManager = {
  /** @type {AudioContext} */
  ctx: new AudioContext(),

  /** @enum {string} */
  soundsPaths: {
    step: "step.wav",
    grab: "grab.wav",
    drop: "drop.wav",
    hit: "hit.wav",
    punch: "punch.wav",
    bow_shoot: "bow_shoot.wav",
    arrow_impact: "arrow_impact.wav",
    drink: "drink.wav",
    dead: "dead.mp3",
    win: "win.wav",
  },

  sounds: {},

  /** @param {string} path */
  async load(path) {
    this.sounds = {
      step: new Sound(this.ctx, `${path}/${this.soundsPaths.step}`),
      grab: new Sound(this.ctx, `${path}/${this.soundsPaths.grab}`),
      drop: new Sound(this.ctx, `${path}/${this.soundsPaths.drop}`),
      hit: new Sound(this.ctx, `${path}/${this.soundsPaths.hit}`),
      punch: new Sound(this.ctx, `${path}/${this.soundsPaths.punch}`),
      bow_shoot: new Sound(this.ctx, `${path}/${this.soundsPaths.bow_shoot}`),
      arrow_impact: new Sound(
        this.ctx,
        `${path}/${this.soundsPaths.arrow_impact}`
      ),
      drink: new Sound(this.ctx, `${path}/${this.soundsPaths.drink}`),
      dead: new Sound(this.ctx, `${path}/${this.soundsPaths.dead}`),
      win: new Sound(this.ctx, `${path}/${this.soundsPaths.win}`),
    };
    await Promise.all(Object.values(this.sounds).map((s) => s.load(this.ctx)));
  },
};

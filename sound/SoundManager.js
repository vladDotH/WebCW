export class Sound {
  /** @type {string} */
  path;
  /** @type {AudioBuffer} */
  audio;

  /** @param {string} path */
  constructor(path) {
    this.path = path;
  }

  /** @param {AudioContext} ctx
   *  @returns {Promise<void>} */
  async load(ctx) {
    this.audio = await ctx.decodeAudioData(
      await (await fetch(this.path)).arrayBuffer()
    );
  }

  /** @param {number} volume
   * @param {AudioContext} ctx */
  async play(ctx, volume) {
    return new Promise((resolve) => {
      let s = ctx.createBufferSource(),
        g = ctx.createGain();
      g.gain.value = volume;
      s.buffer = this.audio;
      s.connect(g).connect(ctx.destination);
      s.start();
      s.onended = function () {
        resolve();
      };
    });
  }
}

// export class SoundManager {
//   /** @type {AudioContext} */
//   ctx;
// }

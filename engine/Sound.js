export class Sound {
  /** @type {string} */
  path;
  /** @type {AudioBuffer} */
  audio;
  /** @type {AudioContext} */
  ctx;

  /** @param {string} path
   * @param {AudioContext} ctx */
  constructor(ctx, path) {
    this.path = path;
    this.ctx = ctx;
  }

  /** @returns {Promise<void>} */
  async load() {
    this.audio = await this.ctx.decodeAudioData(
      await (await fetch(this.path)).arrayBuffer()
    );
  }

  /** @param {number} volume
   * @returns {Promise<void>} */
  async play(volume) {
    return new Promise((resolve) => {
      let s = this.ctx.createBufferSource(),
        g = this.ctx.createGain();
      g.gain.value = volume;
      s.buffer = this.audio;
      s.connect(g).connect(this.ctx.destination);
      s.start();
      s.onended = function () {
        resolve();
      };
    });
  }
}

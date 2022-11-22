export class Sprite {
    /** @type {number} */
    id;
    /** @type {HTMLImageElement} */
    image;
    /** @type {string} */
    path;

    constructor(id, path, width, height) {
        this.id = id;
        this.path = path;
        this.image = new Image(width, height);
    }

    /** @returns {Promise<void>} */
    async load() {
        return new Promise(resolve => {
            this.image.onload = () => {
                resolve();
            };
            this.image.src = this.path;
        });
    }
}
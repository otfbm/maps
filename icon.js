import canvas from "canvas";

const { Image } = canvas;

const icons = new Map([
  ["$D", "./icons/doorway.svg"],
  ["$D!", "./icons/doorway.png"],
]);

export default class Icon {
  constructor({ name } = {}) {
    this.name = name;
  }

  icon() {
    return icons.get(this.name);
  }

  draw() {
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(
        img,
        (this.position[0] - 1) * this.gridsize + 15,
        (this.position[1] - 1) * this.gridsize + 15,
        this.gridsize,
        this.gridsize
      );
    };
    img.onerror = (err) => {
      throw err;
    };
    img.src = this.icon;
  }
}

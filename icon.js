import canvas from "canvas";
const { Image } = canvas;

export default class Icon {
  constructor({ icon } = {}) {
    this.icon = icon;
  }

  get type() {
    return 'icon';
  }

  draw(ctx, x, y, gridsize) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(
        img,
        (x - 1) * gridsize + 15,
        (y - 1) * gridsize + 15,
        gridsize,
        gridsize,
      );
    };
    img.onerror = (err) => {
      throw err;
    };
    img.src = this.icon;
  }
}

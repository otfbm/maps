import canvas from "canvas";
const { Image } = canvas;

export default class SVGRenderer {
  constructor(ctx, options) {
    this.ctx = ctx;
    this.options = options;
    this.gridsize = options.gridsize;
    this.padding = options.padding;
  }

  render({ renderer, item, x, y }) {
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(
        img,
        (x - 1) * this.gridsize,
        (y - 1) * this.gridsize
      );
    };
    img.onerror = (err) => {
      throw err;
    };
    img.src = new renderer(this.options).render(item);
  }

  renderCell(cell, renderer) {
    const img = new Image();
    img.onload = () => {
      this.ctx.save();
      this.ctx.translate(cell.center[0], cell.center[1]);
      this.ctx.rotate(cell.rotation);
      this.ctx.drawImage(
        img,
        0 - cell.overlay.width / 2,
        0 - cell.overlay.height / 2,
      );
      this.ctx.restore();
    };
    img.onerror = (err) => {
      throw err;
    };
    img.src = new renderer(this.options).render(cell);
  }
}

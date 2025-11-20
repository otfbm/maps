import canvas from "canvas";
const { Image } = canvas;

export default class SVGRenderer {
  constructor(ctx, options) {
    this.ctx = ctx;
    this.options = options;
  }

  render({ renderer, item, x, y }) {
    const cellSize = options.cellSizePx;
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, (x - 1) * cellSize, (y - 1) * cellSize);
    };
    img.onerror = (err) => {
      throw new Error('Failed to render SVG image');
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
        0 - cell.overlay.height / 2
      );
      this.ctx.restore();
    };
    img.onerror = (err) => {
      throw new Error('Failed to render svg image into cell');
    };
    img.src = new renderer(this.options).render(cell);
  }
}

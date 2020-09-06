module.exports = class CanvasRenderer {
  constructor(ctx, options) {
    this.ctx = ctx;
    this.options = options;
  }

  render({ renderer, item, x, y }) {
    const cellSize = options.cellSizePx;;
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, (x - 1) * cellSize, (y - 1) * cellSize);
    };
    img.onerror = (err) => {
      throw new Error('Failed to render image');
    };
    img.src = new renderer(this.options).render(item);
  }

  renderCell(cell, renderer) {
    this.ctx.save();
    this.ctx.translate(cell.x1, cell.y1);
    this.ctx.rotate(cell.rotation);
    new renderer(this.options).render(cell, this.ctx);
    this.ctx.restore();
  }
}

module.exports = class CanvasRenderer {
    constructor(ctx, options) {
        this.ctx = ctx;
        this.options = options;
        this.gridsize = options.gridsize;
        this.padding = options.padding;
    }

    render({ renderer, item, x, y }) {
        const img = new Image();
        img.onload = () => {
          this.ctx.drawImage(img, (x - 1) * this.gridsize, (y - 1) * this.gridsize);
        };
        img.onerror = (err) => {
          throw err;
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
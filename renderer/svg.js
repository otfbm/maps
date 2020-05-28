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
              (x - 1) * this.gridsize + this.padding,
              (y - 1) * this.gridsize + this.padding,
            );
          };
          img.onerror = (err) => {
            throw err;
          };
          img.src = new renderer(this.options).render(item);
    }
}
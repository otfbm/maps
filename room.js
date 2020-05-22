export default class Room {
  constructor({
    width,
    height,
    ctx,
    gridsize,
    padding,
    strokeStyle = "black",
    coordinates = [],
  }) {
    this.width = width;
    this.height = height;
    this.coordinates = coordinates;
    this.strokeStyle = strokeStyle;
    this.ctx = ctx;
    this.gridsize = gridsize;
    this.padding = padding;
  }

  drawBySize() {
    this.ctx.beginPath();

    const tl = [this.gridsize + this.padding, this.gridsize + this.padding];
    const br = [this.gridsize * this.width, this.gridsize * this.height];
    this.ctx.rect(tl[0], tl[1], br[0], br[1]);
    this.ctx.strokeStyle = this.strokeStyle;

    this.ctx.stroke();
    this.ctx.strokeStyle = "";
  }

  drawByCoordinates() {
    this.ctx.beginPath();

    for (const [x, y] of this.coordinates) {
      this.ctx.moveTo;
    }

    this.ctx.stroke();
  }

  draw() {
    if (this.width && this.height) {
      this.drawBySize();
    } else if (this.coordinates.length) {
      this.drawByCoordinates();
    }
  }
}

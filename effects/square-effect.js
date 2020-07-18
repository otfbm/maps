export default class SquareEffect {
  constructor({ width, length, colour, startPt, endPt, anchorTopLeft }) {
    this.colour = colour;
    this.width = width;
    this.length = length;
    this.startPt = startPt;
    this.endPt = endPt;
    this.anchorTopLeft = anchorTopLeft;
  }

  draw(ctx, gridSize) {
    let unit = gridSize / 5;    
    ctx.save();

    if (this.anchorTopLeft) {
      ctx.translate((this.startPt.x - 1) * gridSize, (this.startPt.y - 1) * gridSize);
      ctx.beginPath();
      ctx.lineTo(0, this.width * unit);
      ctx.lineTo(this.length * unit, this.width * unit);
      ctx.lineTo(this.length * unit, 0);
      ctx.lineTo(0, 0);
    } else {
      let halfGrid = gridSize / 2;
      ctx.translate((this.startPt.x * gridSize) - halfGrid, (this.startPt.y * gridSize) - halfGrid);
      let angle = Math.atan2(this.endPt.y - this.startPt.y, this.endPt.x - this.startPt.x)   
      ctx.rotate(angle);
      ctx.translate(halfGrid, 0);
      ctx.beginPath();
      ctx.lineTo(0, this.width / 2 * unit);
      ctx.lineTo(this.length * unit, this.width / 2 * unit);
      ctx.lineTo(this.length * unit, this.width / -2 * unit);
      ctx.lineTo(0, this.width / -2 * unit);
    }

    ctx.globalAlpha = 0.4;
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.restore();
  }
}

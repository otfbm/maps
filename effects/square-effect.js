export default class SquareEffect {
    constructor({ width, length, colour, startPt, endPt }) {
      this.colour = colour;
      this.width = width;
      this.length = length;
      this.startPt = startPt;
      this.endPt = endPt;
    }
  
    draw(ctx, gridSize) {
      let angle = Math.atan2(this.endPt.y - this.startPt.y, this.endPt.x - this.startPt.x)
      let halfGrid = gridSize / 2;
      let unit = gridSize / 5;
      ctx.save();
      ctx.translate((this.startPt.x * gridSize) - halfGrid, (this.startPt.y * gridSize) - halfGrid);
      ctx.rotate(angle);
      ctx.translate(halfGrid, 0)  
      
      ctx.beginPath();
      ctx.lineTo(0, this.width / 2 * unit);
      ctx.lineTo(this.length * unit, this.width / 2 * unit);
      ctx.lineTo(this.length * unit, this.width / -2 * unit); 
      ctx.lineTo(0, this.width / -2 * unit); 
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = this.colour;
      ctx.fill();
      ctx.restore();
    }
  }
  
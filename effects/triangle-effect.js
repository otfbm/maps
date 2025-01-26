export default class TriangleEffect {
  constructor({ size, colour, startPt, endPt }) {
    this.colour = colour;
    this.width = size;
    this.startPt = startPt;
    this.endPt = endPt;
  }

  draw(ctx, gridSize) {
    let angle = Math.atan2(this.endPt.y - this.startPt.y, this.endPt.x - this.startPt.x)
    let length = this.width / 5;
    let halfGrid = gridSize / 2;
    ctx.save();
    ctx.translate((this.startPt.x * gridSize) - halfGrid, (this.startPt.y * gridSize) - halfGrid);
    ctx.rotate(angle);
    ctx.translate(halfGrid, 0);
      
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(length * gridSize, length / 2 * gridSize );
    ctx.lineTo(length * gridSize, length / -2 * gridSize ); 
    ctx.lineTo(0, 0); 

    ctx.strokeStyle = this.colour;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = this.colour + "88";
    ctx.fill();
    ctx.restore();
  }
};

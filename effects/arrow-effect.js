import Line from "../line.js";

export default class ArrowEffect {
    constructor({ colour, startPt, endPt }) {
      this.colour = colour;
      this.startPt = startPt;
      this.endPt = endPt;
    }
  
    draw(ctx, gridSize) {
      let angle = Math.atan2(this.endPt.y - this.startPt.y, this.endPt.x - this.startPt.x)
      let halfGrid = gridSize / 2;
      let unit = gridSize / 5;

      let adjustedStartPt = {x: (this.startPt.x * gridSize) - halfGrid, y: (this.startPt.y * gridSize) - halfGrid};
      let adjustedEndPt = {x: (this.endPt.x * gridSize) - halfGrid, y: (this.endPt.y * gridSize) - halfGrid};
      let distance = Math.sqrt(Math.pow((adjustedEndPt.x - adjustedStartPt.x), 2) + Math.pow((adjustedEndPt.y - adjustedStartPt.y), 2));
      let arrowPt = Line.pointOnLine(adjustedStartPt, adjustedEndPt, (distance - halfGrid) / distance);

      ctx.beginPath()
      ctx.moveTo(adjustedStartPt.x, adjustedStartPt.y);
      ctx.lineTo(arrowPt.x, arrowPt.y);

      ctx.save();
      ctx.translate(arrowPt.x, arrowPt.y);
      ctx.rotate(angle);

      ctx.moveTo(-1 * unit, -0.5 * unit);
      ctx.lineTo(0, 0);
      ctx.lineTo(-1 * unit, 0.5 * unit); 

      ctx.lineCap = "square";
      ctx.lineJoin = "bevel";
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.colour;
      ctx.stroke();
      ctx.fillStyle = this.colour;
      ctx.fill();

      ctx.restore();
    }
  }
  
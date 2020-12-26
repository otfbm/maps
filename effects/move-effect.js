const Colour = require("../colour.js");
const Line = require("../line.js");

module.exports = class MoveEffect {
  constructor({ colour, startPt, endPt }) {
    this.colour = colour;
    this.startPt = startPt;
    this.endPt = endPt;
    this.startSize = 1;
    this.endSize = 1;
  }

  draw(ctx, gridSize, font) {
    let notAdjacent = !this.isAdjacent();
    let angle = Math.atan2(this.endPt.y - this.startPt.y, this.endPt.x - this.startPt.x)
    let halfGrid = gridSize / 2;
    let unit = gridSize / 5;

    let startBox = this.getBox(this.startPt, gridSize);
    let endBox = this.getBox(this.endPt, gridSize);

    // TODO get the center point for bigger squares
    let adjustedStartPt = { x: (this.startPt.x * gridSize) - halfGrid, y: (this.startPt.y * gridSize) - halfGrid };
    let adjustedEndPt = { x: (this.endPt.x * gridSize) - halfGrid, y: (this.endPt.y * gridSize) - halfGrid };

    let distance = Math.sqrt(Math.pow((adjustedEndPt.x - adjustedStartPt.x), 2) + Math.pow((adjustedEndPt.y - adjustedStartPt.y), 2));

    ctx.lineWidth = unit / 4;
    ctx.strokeStyle = this.colour;
    ctx.fillStyle = this.colour;

    ctx.beginPath();
    this.drawBox(ctx, startBox);
    this.drawBox(ctx, endBox);
    ctx.stroke();

    if (notAdjacent) {
      // line
      if (Math.abs(angle) < 0.785398163397448) {
        // east
        adjustedStartPt = Line.lineIntersection(adjustedStartPt, adjustedEndPt, startBox[1], startBox[2]);
        adjustedEndPt = Line.lineIntersection(adjustedStartPt, adjustedEndPt, endBox[3], endBox[0]);
      } else if (Math.abs(angle) > 2.356194490192345) {
        // west
        adjustedStartPt = Line.lineIntersection(adjustedStartPt, adjustedEndPt, startBox[3], startBox[0]);
        adjustedEndPt = Line.lineIntersection(adjustedStartPt, adjustedEndPt, endBox[1], endBox[2]);
      } else {
        if (angle > 0) {
          // south
          adjustedStartPt = Line.lineIntersection(adjustedStartPt, adjustedEndPt, startBox[2], startBox[3]);
          adjustedEndPt = Line.lineIntersection(adjustedStartPt, adjustedEndPt, endBox[0], endBox[1]);
        } else {
          // north
          adjustedStartPt = Line.lineIntersection(adjustedStartPt, adjustedEndPt, startBox[0], startBox[1]);
          adjustedEndPt = Line.lineIntersection(adjustedStartPt, adjustedEndPt, endBox[2], endBox[3]);
        }
      }

      ctx.beginPath();
      ctx.moveTo(adjustedStartPt.x, adjustedStartPt.y);
      ctx.lineTo(adjustedEndPt.x, adjustedEndPt.y);
      ctx.stroke();

      // arrow head
      ctx.save();
      ctx.beginPath();
      ctx.translate(adjustedEndPt.x, adjustedEndPt.y);
      ctx.rotate(angle);

      ctx.moveTo(-1 * unit, -0.5 * unit);
      ctx.lineTo(0, 0);
      ctx.lineTo(-1 * unit, 0.5 * unit);

      ctx.lineCap = "square";
      ctx.lineJoin = "bevel";
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }

    // distance label
    let labelPt = notAdjacent ? Line.pointOnLine(adjustedStartPt, adjustedEndPt, 0.5) : adjustedEndPt;
    let feet = Math.floor(distance / unit);
    let inches = Math.round((distance % unit) * (12 / unit));
    let label = `${feet}'`;
    if (inches > 0)
      label += `${inches}"`;
    this.drawLabel(ctx, labelPt, label, font, unit);
  }

  isAdjacent() {
    return Math.abs(this.startPt.x - this.endPt.x) <= 1 && Math.abs(this.startPt.y - this.endPt.y) <= 1;
  }

  getBox(pt, gridSize) {
    let x = (pt.x - 1) * gridSize;
    let y = (pt.y - 1) * gridSize;
    return [
      { x: x, y: y },
      { x: x + gridSize, y: y },
      { x: x + gridSize, y: y + gridSize },
      { x: x, y: y + gridSize }
    ];
  }

  drawBox(ctx, pts) {
    ctx.moveTo(pts[3].x, pts[3].y);
    pts.map(pt => ctx.lineTo(pt.x, pt.y));
  }

  drawLabel(ctx, pt, label, font, unit) {
    let fontSize = (unit >= 8) ? unit * 1.5 : 12;

    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSize}px ${font}`;

    let width = ctx.measureText(label).width;

    ctx.rect(pt.x - width / 2 - 2, pt.y - fontSize / 2 - 1, width + 4, fontSize + 2);
    ctx.fillStyle = this.colour;
    ctx.fill();

    ctx.fillStyle = Colour.pickTextColor(this.colour);
    ctx.fillText(label, pt.x, pt.y);
  }
}

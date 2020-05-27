export default class Line {
  constructor(line, foregroundColour, backgroundColour) {
    this.line = line;
    this.fg = foregroundColour;
    this.bg = backgroundColour;
  }

  draw(ctx, gridsize, padding, zoom) {
    let icons = [];
    let unit = gridsize / 5;

    let l = this.line;

    ctx.beginPath();
    let startPt = l.shift();
    ctx.moveTo(startPt.x * gridsize + padding, startPt.y * gridsize + padding);

    while (l.length) {
      let pt = l.shift();

      if (pt.icon !== "") {
        this.drawOpenDoor(ctx, startPt, pt, 0.3, gridsize, padding);
        icons.push({
          angle: Math.atan2(startPt.y - pt.y, startPt.x - pt.x),
          x: (startPt.x + pt.x) / 2,
          y: (startPt.y + pt.y) / 2,
          type: pt.icon
        });
      } else {
        ctx.lineTo(pt.x * gridsize + padding, pt.y * gridsize + padding);
      }
      startPt = pt;
    }

    ctx.lineCap = "square";
    ctx.lineJoin = "bevel";
    ctx.lineWidth = 3 * zoom;
    ctx.strokeStyle = this.fg;
    ctx.stroke();

    for (const icon of icons) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(icon.x * gridsize + padding, icon.y * gridsize + padding);
      ctx.rotate(icon.angle);
      if (icon.type === "secret-door") {
        ctx.moveTo(unit * -2, 0);
        ctx.lineTo(unit * 2, 0);
        ctx.font = `${zoom * 15}px impact`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.rotate(1.57079632679);
        ctx.fillText("S", 0, zoom);
      } else if (icon.type === "door") {
        ctx.rect(unit * -1.5, unit * -0.5, unit * 3, unit);
      } else if (icon.type === "double-door") {
        ctx.rect(unit * -2, unit * -0.5, unit * 2, unit);
        ctx.rect(0, unit * -0.5, unit * 2, unit);
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = this.fg;
      ctx.fillStyle = this.bg;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  drawOpenDoor(ctx, a, b, gapSize, gridsize, padding) {
    let distance = Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
    let c = this.pointOnLine(a, b, (distance / 2.0 - gapSize) / distance);
    let d = this.pointOnLine(a, b, (distance / 2.0 + gapSize) / distance);
    ctx.lineTo(c.x * gridsize + padding, c.y * gridsize + padding);
    ctx.moveTo(d.x * gridsize + padding, d.y * gridsize + padding);
    ctx.lineTo(b.x * gridsize + padding, b.y * gridsize + padding);
    return { c, d };
  }

  /**
   * @typedef {Object} Point
   * @property {number} x
   * @property {number} y 
   */

  /**
   * Find a point between a and b.
   * @param {Point} a - Start point.
   * @param {Point} b - End point.
   * @param {number} t - distance from a as a fraction.
   * @return {Point} the point.
   */
  pointOnLine(a, b, t) {
    return {
      x: (1 - t) * a.x + t * b.x,
      y: (1 - t) * a.y + t * b.y
    }
  }


}

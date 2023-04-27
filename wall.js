const Line = require("./line.js");

module.exports = class Wall {
  static fg;
  static bg;

  constructor(line) {
    this.line = line;
  }

  get type() {
    return 'line';
  }

  draw(ctx, gridsize, zoom) {
    let icons = [];
    let unit = gridsize / 5;

    let l = this.line;

    ctx.beginPath();
    let startPt = l.shift();
    ctx.moveTo(startPt.x * gridsize, startPt.y * gridsize);

    if (startPt.colour)
      Wall.fg = startPt.colour;

    while (l.length) {
      let pt = l.shift();

      if (pt.icon !== "") {
        this.drawOpenDoor(ctx, startPt, pt, 0.3, gridsize);
        icons.push({
          angle: Math.atan2(startPt.y - pt.y, startPt.x - pt.x),
          x: (startPt.x + pt.x) / 2,
          y: (startPt.y + pt.y) / 2,
          type: pt.icon
        });
      } else {
        ctx.lineTo(pt.x * gridsize, pt.y * gridsize);
      }
      startPt = pt;
    }

    ctx.lineCap = "square";
    ctx.lineJoin = "bevel";
    ctx.lineWidth = 3 * zoom;
    ctx.strokeStyle = Wall.fg;
    ctx.stroke();

    for (const icon of icons) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(icon.x * gridsize, icon.y * gridsize);
      ctx.rotate(icon.angle);
      if (icon.type === "secret-door") {
        ctx.moveTo(unit * -2, 0);
        ctx.lineTo(unit * 2, 0);
        ctx.font = `${zoom * 15}px "Azo Sans Bold"`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.rotate(1.57079632679);
        ctx.fillStyle = Wall.fg;
        ctx.fillText("S", 0, zoom);
      } else if (icon.type === "door") {
        ctx.rect(unit * -1.5, unit * -0.5, unit * 3, unit);
      } else if (icon.type === "double-door") {
        ctx.rect(unit * -2, unit * -0.5, unit * 2, unit);
        ctx.rect(0, unit * -0.5, unit * 2, unit);
      }

      ctx.lineWidth = 1;
      ctx.fillStyle = this.bg;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  drawOpenDoor(ctx, a, b, gapSize, gridsize) {
    let distance = Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
    let c = Line.pointOnLine(a, b, (distance / 2.0 - gapSize) / distance);
    let d = Line.pointOnLine(a, b, (distance / 2.0 + gapSize) / distance);
    ctx.lineTo(c.x * gridsize, c.y * gridsize);
    ctx.moveTo(d.x * gridsize, d.y * gridsize);
    ctx.lineTo(b.x * gridsize, b.y * gridsize);
    return { c, d };
  }
}

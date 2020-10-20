module.exports = class FogEffect {
  constructor({ startPt, endPt }) {
    this.startPt = startPt;
    this.endPt = endPt;
  }

  draw(ctx, gridSize) {
    ctx.save();

    let x1 = (this.startPt.x - 1) * gridSize;
    let y1 = (this.startPt.y - 1) * gridSize;
    let x2 = (this.endPt.x) * gridSize;
    let y2 = (this.endPt.y) * gridSize;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    ctx.closePath();

    let edgeEffectSize = gridSize / 20;

    ctx.strokeStyle = "#ffffff44";
    ctx.lineWidth = edgeEffectSize * 3;
    ctx.stroke();
    ctx.lineWidth = edgeEffectSize * 2;
    ctx.stroke();
    ctx.lineWidth = edgeEffectSize;
    ctx.stroke();
    ctx.fillStyle = "#FFFFFFFF";
    ctx.fill();
    ctx.restore();
  }
}

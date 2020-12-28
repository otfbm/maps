module.exports = class CircleEffect {
  constructor({ size, innerRadius, colour, anchorPt, anchorType }) {
    this.colour = colour;
    this.size = size;
    this.anchorPt = anchorPt;
    this.anchorType = anchorType;
    this.innerRadius = innerRadius;
  }

  draw(ctx, gridSize) {
    let radius = this.size / 5;
    let halfGrid = gridSize / 2;
    ctx.save();
    if (this.anchorType === 'T')
      ctx.translate((this.anchorPt.x - 1) * gridSize + radius * gridSize, (this.anchorPt.y - 1) * gridSize + radius * gridSize);
    else if (this.anchorType === 'O')
      ctx.translate((this.anchorPt.x - 1) * gridSize, (this.anchorPt.y - 1) * gridSize);
    else
      ctx.translate((this.anchorPt.x * gridSize) - halfGrid, (this.anchorPt.y * gridSize) - halfGrid);

    ctx.beginPath();
    ctx.arc(0, 0, radius * gridSize, 0, Math.PI * 2, false);
    ctx.closePath();
    if (this.innerRadius != null) {
      let radius2 = this.innerRadius / 5;
      ctx.moveTo(radius2 * gridSize, 0)
      ctx.arc(0, 0, radius2 * gridSize, 0, Math.PI * 2, true);
      ctx.closePath();
    }
    ctx.strokeStyle = this.colour;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = this.colour + "88";
    ctx.fill('evenodd');
    ctx.restore();
  }
}

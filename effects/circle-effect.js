module.exports = class CircleEffect {
  constructor({ size, colour, anchorPt, offset, anchorType, alpha }) {
    this.colour = colour;
    this.size = size;
    this.anchorPt = anchorPt;
    this.anchorType = anchorType;
    this.alpha = alpha;
  }

  draw(ctx, gridSize) {
    let radius = this.size / 5;
    let halfGrid = gridSize / 2;
    ctx.save();
    if (this.anchorType === "T")
      ctx.translate(
        (this.anchorPt.x - 1) * gridSize + radius * gridSize,
        (this.anchorPt.y - 1) * gridSize + radius * gridSize
      );
    else if (this.anchorType === "O")
      ctx.translate(
        (this.anchorPt.x - 1) * gridSize,
        (this.anchorPt.y - 1) * gridSize
      );
    else
      ctx.translate(
        this.anchorPt.x * gridSize - halfGrid,
        this.anchorPt.y * gridSize - halfGrid
      );

    ctx.beginPath();
    ctx.arc(0, 0, radius * gridSize, 0, Math.PI * 2);
    ctx.strokeStyle = this.colour;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.colour + "88";
    ctx.fill();
    ctx.restore();
  }
};

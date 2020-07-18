export default class CircleEffect {
  constructor({ size, colour, anchorPt, offset, anchorAtCenter }) {
    this.colour = colour;
    this.size = size;
    this.anchorPt = anchorPt;
    this.anchorAtCenter = anchorAtCenter;
  }

  draw(ctx, gridSize) {
    let radius = this.size / 5;
    let halfGrid = gridSize / 2;
    ctx.save();
    if (this.anchorAtCenter)
      ctx.translate((this.anchorPt.x * gridSize) - halfGrid, (this.anchorPt.y * gridSize) - halfGrid);
    else
      ctx.translate((this.anchorPt.x - 1) * gridSize + radius * gridSize, (this.anchorPt.y - 1) * gridSize + radius * gridSize);

    ctx.beginPath();
    ctx.arc(0, 0, radius * gridSize, 0, Math.PI * 2);
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.restore();
  }
}

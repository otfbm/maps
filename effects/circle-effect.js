export default class CircleEffect {
  constructor({ size, colour, anchorPt, offset, anchorAtCenter }) {
    this.colour = colour;
    this.width = size;
    this.anchorPt = anchorPt;
    this.offset = offset;
    this.anchorAtCenter = anchorAtCenter;
  }

  draw(ctx, gridSize) {
    let length = this.width / 5;
    let halfGrid = gridSize / 2;
    let unit = gridSize / 5;
    ctx.save();
    if (this.anchorAtCenter)
      ctx.translate((this.anchorPt.x * gridSize) - halfGrid, (this.anchorPt.y * gridSize) - halfGrid);
    else
      ctx.translate(
        (this.anchorPt.x - 1) * gridSize + this.offset * unit + length * halfGrid,
        (this.anchorPt.y - 1) * gridSize + this.offset * unit + length * halfGrid);

    ctx.beginPath();
    ctx.arc(0, 0, length * halfGrid, 0, Math.PI * 2);
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.restore();
  }
}

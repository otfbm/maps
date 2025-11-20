export default class FogEffect {
  constructor({ startPt, endPt }) {
    this.startPt = startPt;
    this.endPt = endPt;
  }

  draw(ctx, gridSize) {
    let x1 = (this.startPt.x - 1) * gridSize;
    let y1 = (this.startPt.y - 1) * gridSize;
    let x2 = (this.endPt.x) * gridSize;
    let y2 = (this.endPt.y) * gridSize;
    let width = x2 - x1
    let height = y2 - y1
    ctx.clearRect(x1, y1, width, height)
    ctx.save()
  }
};

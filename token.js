const sizes = new Map([
  ["tiny", { offset: 0.5, size: 0.25 }],
  ["small", { offset: 0.5, size: 0.5 }],
  ["medium", { offset: 0.5, size: 0.5 }],
  ["large", { offset: 1, size: 1 }],
  ["huge", { offset: 1.5, size: 1.5 }],
  ["gargantuan", { offset: 2, size: 2 }],
]);

export default class Token {
  constructor({ name, color, size }) {
    this.name = name;
    this.color = color || "black";
    this.size = sizes.get(size).size;
    this.offset = sizes.get(size).offset;
  }

  // icon(ctx, ) {
  //     return
  // }

  draw(ctx, x, y, gridsize, padding, zoom) {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(
      padding + gridsize * this.offset + (x - 1) * gridsize,
      padding + gridsize * this.offset + (y - 1) * gridsize,
      gridsize * this.size * 0.92, // radius is half the gridsize
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      padding + gridsize * this.offset + (x - 1) * gridsize,
      padding + gridsize * this.offset + (y - 1) * gridsize,
      gridsize * this.size * 0.92 - 2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.beginPath();
    ctx.font = `${zoom * 12}px impact`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      this.name,
      padding + gridsize * this.offset + (x - 1) * gridsize,
      padding + gridsize * this.offset + (y - 1) * gridsize
    );
    ctx.stroke();
  }
}

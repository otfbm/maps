const template = require("./template.js");

module.exports = class StoneThroneOverlay {
  constructor(options) {
    this.options = options;
  }

  get name() {
    return "stone-throne";
  }

  render(cell) {
    const { width, height, color } = cell.overlay;

    const svg = template({
      height,
      width,
      color,
    });
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
}

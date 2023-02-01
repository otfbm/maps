const template = require("./template.js");

module.exports = class ExplosionOverlay {
  constructor(options) {
    this.options = options;
  }

  get name() {
    return "explosion";
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

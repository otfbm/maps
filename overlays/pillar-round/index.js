const template = require("./template.js");

module.exports = class PillarRoundOverlay {
  constructor(options) {
    this.options = options;
  }

  get name() {
    return "pillar-round";
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

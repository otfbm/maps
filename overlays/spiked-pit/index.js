const template = require("./template.js");

module.exports = class SpikedPitOverlay {
  constructor(options) {
    this.options = options;
  }

  get name() {
    return "spiked-pit";
  }

  render(cell) {
    const width = cell.overlay.width;
    const height = cell.overlay.height;

    const svg = template({
      height,
      width,
    });
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
}

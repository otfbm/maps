import template from "./template.js";

export default class LightningOverlay {
  constructor(options) {
    this.options = options;
  }

  get name() {
    return "lightning";
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

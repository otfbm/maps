import template from "./template.js";

export default class PillarRoundOverlay {
  constructor(options) {
    this.options = options;
  }

  get name() {
    return "pillar-round";
  }

  render(cell) {
    const svg = template({
      height: cell.overlay.height,
      width: cell.overlay.width,
    });
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
}

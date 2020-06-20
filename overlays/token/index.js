import template from "./template.js";

export default class TokenOverlay {
  constructor(options) {
    this.options = options;
  }
  get name() {
    return "token";
  }

  tiny(item) {
    const { label, color, width, height } = item;
    const { zoom } = this.options;

    return {
      color,
      label: `${label.substr(0, 1)}${label.substr(-1)}`,
      height,
      width,
      radius: (width / 4) * 0.85,
      strokeWidth: 1 * zoom,
      fontsize: 10 * zoom,
    };
  }

  medium(item) {
    const { label, color, width, height } = item;
    const { zoom } = this.options;

    return {
      height,
      width,
      radius: (width / 2) * 0.85,
      color,
      strokeWidth: 2 * zoom,
      fontsize: 12 * zoom,
      label: label.substr(0, 4),
    };
  }

  large(item) {
    const { label, color, width, height } = item;
    const { zoom } = this.options;

    return {
      height: height * 2,
      width: width * 2,
      radius: width * 0.9,
      color,
      strokeWidth: 3 * zoom,
      fontsize: 14 * zoom,
      label: label.substr(0, 9),
    };
  }

  huge(item) {
    const { label, color, width, height } = item;
    const { zoom } = this.options;

    return {
      height: height * 3,
      width: width * 3,
      radius: width * 1.5 * 0.92,
      color,
      strokeWidth: 4 * zoom,
      fontsize: 14 * zoom,
      label: label.substr(0, 14),
    };
  }

  gargantuan(item) {
    const { label, color, width, height } = item;
    const { zoom } = this.options;

    return {
      height: height * 4,
      width: width * 4,
      radius: width * 2 * 0.95,
      color,
      strokeWidth: 5 * zoom,
      fontsize: 16 * zoom,
      label: label.substr(0, 18),
    };
  }

  render(item) {
    let opts = {};

    switch (item.overlay.size) {
      case "tiny":
        opts = this.tiny(item.overlay);
        break;
      case "small":
        opts = this.medium(item.overlay);
        break;
      case "medium":
        opts = this.medium(item.overlay);
        break;
      case "large":
        opts = this.large(item.overlay);
        break;
      case "huge":
        opts = this.huge(item.overlay);
        break;
      case "gargantuan":
        opts = this.gargantuan(item.overlay);
        break;
    }
    const svg = template(opts);
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
}

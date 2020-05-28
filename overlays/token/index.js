import template from "./template.js";

export default class TokenOverlay {
  constructor(options) {
    this.options = options;
  }
  get name() {
    return "token";
  }

  tiny(item) {
    const { label, color } = item;
    const { zoom, gridsize } = this.options;

    return {
      color,
      label: `${label.substr(0, 1)}${label.substr(-1)}`,
      height: gridsize,
      width: gridsize,
      radius: (gridsize / 4) * 0.85,
      strokeWidth: 1 * zoom,
      fontsize: 10 * zoom,
    };
  }

  medium(item) {
    const { label, color } = item;
    const { zoom, gridsize } = this.options;

    return {
      height: gridsize,
      width: gridsize,
      radius: (gridsize / 2) * 0.85,
      color,
      strokeWidth: 2 * zoom,
      fontsize: 12 * zoom,
      label: label.substr(0, 4),
    };
  }

  large(item) {
    const { label, color } = item;
    const { zoom, gridsize } = this.options;

    return {
      height: gridsize,
      width: gridsize,
      radius: gridsize * 0.9,
      color,
      strokeWidth: 3 * zoom,
      fontsize: 14 * zoom,
      label: label.substr(0, 9),
    };
  }

  huge(item) {
    const { label, color } = item;
    const { zoom, gridsize } = this.options;

    return {
      height: gridsize * 1.5,
      width: gridsize * 1.5,
      radius: gridsize * 1.5 * 0.92,
      color,
      strokeWidth: 4 * zoom,
      fontsize: 14 * zoom,
      label: label.substr(0, 14),
    };
  }

  gargantuan(item) {
    const { label, color } = item;
    const { zoom, gridsize } = this.options;

    return {
      height: gridsize * 2,
      width: gridsize * 2,
      radius: gridsize * 2 * 0.95,
      color,
      strokeWidth: 5 * zoom,
      fontsize: 16 * zoom,
      label: label.substr(0, 18),
    };
  }

  render(item) {
    let opts = {};

    switch (item.size) {
      case "tiny":
        opts = this.tiny(item);
        break;
      case "small":
        opts = this.medium(item);
        break;
      case "medium":
        opts = this.medium(item);
        break;
      case "large":
        opts = this.large(item);
        break;
      case "huge":
        opts = this.huge(item);
        break;
      case "gargantuan":
        opts = this.gargantuan(item);
        break;
    }

    const svg = template(opts);
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
}

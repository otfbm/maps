const template = require("./template.js");

module.exports = class TokenOverlay {
  constructor(options) {
    this.options = options;
  }
  get name() {
    return "token";
  }

  tiny(item) {
    const { label, color, width, height } = item;

    return {
      color,
      label: `${label.substr(0, 1)}${label.substr(-1)}`,
      size: width / 2
    };
  }

  medium(item) {
    const { label, color, width, height } = item;

    return {
      size: width,
      color,
      label: label.substr(0, 4)
    };
  }

  large(item) {
    const { label, color, width, height } = item;

    return {
      size: width * 2,
      color,
      label: label.substr(0, 9)
    };
  }

  huge(item) {
    const { label, color, width, height } = item;

    return {
      size: width * 3,
      color,
      label: label.substr(0, 14)
    };
  }

  gargantuan(item) {
    const { label, color, width, height } = item;

    return {
      size: width * 4,
      color,
      label: label.substr(0, 18)
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

    opts.fontsize = opts.size * ( 8 / (opts.label.length + 4)) * 0.30;

    const svg = template(opts);
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
}

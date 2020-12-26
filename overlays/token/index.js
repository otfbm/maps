const template = require("./template.js");
const Colour = require("../../colour.js");

module.exports = class TokenOverlay {
  constructor(options) {
    this.options = options;
  }
  get name() {
    return "token";
  }

  tiny(item) {
    const { label, color, width, image } = item;

    return {
      color,
      label: `${label.substr(0, 1)}${label.substr(-1)}`,
      size: width / 1.5,
      image,
    };
  }

  medium(item) {
    const { label, color, width, image } = item;

    return {
      size: width,
      color,
      label: label.substr(0, 4),
      image,
    };
  }

  large(item) {
    const { label, color, width, image } = item;

    return {
      size: width * 2,
      color,
      label: label.substr(0, 9),
      image,
    };
  }

  huge(item) {
    const { label, color, width, image } = item;

    return {
      size: width * 3,
      color,
      label: label.substr(0, 14),
      image,
    };
  }

  gargantuan(item) {
    const { label, color, width, image } = item;

    return {
      size: width * 4,
      color,
      label: label.substr(0, 18),
      image,
    };
  }

  render(item, ctx) {
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

    opts.fontsize = opts.size * (8 / (opts.label.length + 4)) * 0.30;
    opts.fontcolor = Colour.pickTextColor(opts.color);
    opts.gridsize = this.options.cellSizePx;
    opts.font = this.options.font;
    
    let match = item.overlay.label.match(/[0-9]+$/);
    if (match)
      opts.subLabel = match[0].toUpperCase();

    template(opts, ctx);
  }
}

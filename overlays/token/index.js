const template = require("./template.js");

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
    opts.fontcolor = this.pickTextColor(opts.color);
    opts.gridsize = this.options.gridsize,
    
    template(opts, ctx);
  }

  /**
   * choose a text colour to contrast with the background
   * @param {*} bgColor background color, must be in format: "#ffffff" or "#fff"
   */
  pickTextColor(bgColor) {
    let r = parseInt(bgColor.substring(1, 3), 16);
    let g = parseInt(bgColor.substring(3, 5), 16);
    let b = parseInt(bgColor.substring(5, 7), 16);

    let L1 = 0.9236;
    let L2 = this.luminanace(r, g, b);
    if (L1 < L2) return "#07031a";
    let contrastRatio = (L1 + 0.05) / (L2 + 0.05);
    return contrastRatio < 3 ? "#07031a" : "#f4f6ff";
  }

  luminanace(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
}

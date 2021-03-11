module.exports = class Colour {
  /**
   * choose a text colour to contrast with the background
   * @param {*} bgColor background color, must be in format: "#ffffff"
   */
  static pickTextColor(bgColor) {
    let r = parseInt(bgColor.substring(1, 3), 16);
    let g = parseInt(bgColor.substring(3, 5), 16);
    let b = parseInt(bgColor.substring(5, 7), 16);

    let L1 = 0.9236;
    let L2 = this.luminanace(r, g, b);
    if (L1 < L2) return "#07031a";
    let contrastRatio = (L1 + 0.05) / (L2 + 0.05);
    return contrastRatio < 3 ? "#07031a" : "#f4f6ff";
  }

  static luminanace(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
}
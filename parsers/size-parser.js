
const sizes = new Map([
    ["T", "tiny"],
    ["S", "small"],
    ["M", "medium"],
    ["L", "large"],
    ["H", "huge"],
    ["G", "gargantuan"],
  ]);

export default class SizeParser {
  static parse(str) {
    if (str) {
      var upper = str.toUpperCase();
      return sizes.get(upper) || 'medium';
    }
    return "medium";
  }
};

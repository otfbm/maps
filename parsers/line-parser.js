const CoordParser = require("./coord-parser.js");
const ColourParser = require("./colour-parser.js");

module.exports = class LineParser {
  parse(str) {
    let trimmed = str;
    if (trimmed.charAt(0) !== '_')
      return false;

    let result = [];

    for (const lineStr of trimmed.substr(1).split("_")) {
      let coords = this.parseCoords(lineStr)
      if (coords.length)
        result.push(coords);
    }

    if (result.length)
      return result;
    return false;
  }

  icons = new Map([
    ['D', "door"],
    ['B', "double-door"],
    ['O', "open-door"],
    ['S', "secret-door"]
  ])

  parseCoords(str) {
    const reg = /(\-[A-Z])?(\$(PK|PU|BK|GY|BN|[WKEARGBYPCNOI]|~[0-9A-F]{6}|~[0-9A-F]{3}))?([A-Z]{1,2}[0-9]{1,2})/gi;
    let result = [];
    let matches = str.matchAll(reg) || [];
    for (let match of matches) {
      let coords = CoordParser.parse(match[4]);

      let icon = "";
      if (match[1])
        icon = this.icons.get(match[1].charAt(1).toUpperCase()) || "";

      let colour = "";
      if (match[3])
        colour = ColourParser.parse(match[3]);

      result.push({
        x: coords.x - 1,
        y: coords.y - 1,
        icon,
        colour
      });
    }

    return result;
  }
}

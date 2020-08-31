const CoordParser = require("./coord-parser.js");

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
    const reg = /(\-[A-Z])?[A-Z]{1,2}[0-9]{1,2}/gi;
    let result = [];
    let coords = str.match(reg) || [];
    for (let pt of coords) {
      let icon = "";
      if (pt.charAt(0) === '-') {
        icon = this.icons.get(pt.charAt(1).toUpperCase()) || "";
        pt = pt.substr(2)
      }

      let coords = CoordParser.parse(pt);

      result.push({
        x: coords.x - 1,
        y: coords.y - 1,
        icon
      });
    }

    return result;
  }
}

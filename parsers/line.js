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
    [']', "door"],
    ['[', "double-door"],
    ['-', "open-door"],
    ['$', "secret-door"]
  ])

  parseCoords(str) {
    const reg = /[\-\[\]\$]?[a-zA-Z][a-zA-Z]?[0-9][0-9]?/g;
    let result = [];
    let coords = str.match(reg) || [];
    for (let pt of coords) {
      let icon = "";
      if (this.icons.has(pt.charAt(0))) {
        icon = this.icons.get(pt.charAt(0));
        pt = pt.substr(1)
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

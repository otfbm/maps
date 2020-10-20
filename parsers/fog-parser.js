const CoordParser = require("./coord-parser.js");
const FogEffect = require("../effects/fog-effect.js");

module.exports = class FogParser {
  parse(str) {
    let trimmed = str.toUpperCase();
    if (trimmed.charAt(0) !== '*')
      return false;

    const reg = /\*F(([A-Z]{1,2}[0-9]{1,2})+)/;
    if (!reg.test(trimmed))
      return false;

    const matches = trimmed.match(reg);
    let coords = CoordParser.parseSet(matches[1]);

    return new FogEffect({ startPt: coords[0], endPt: coords[1] });
  }
}

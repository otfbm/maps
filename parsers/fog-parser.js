const CoordParser = require("./coord-parser.js");
const FogEffect = require("../effects/fog-effect.js");

module.exports = class FogParser {
  parse(str) {
    const reg = /\*F(([A-Z]{1,2}[0-9]{1,2})+)/i;
    const matches = str.match(reg);
    if (matches) {
      let coords = CoordParser.parseSet(matches[1]);
      return new FogEffect({ startPt: coords[0], endPt: coords.length == 1 ? coords[0] : coords[1] });
    }
    return false;
  }
}

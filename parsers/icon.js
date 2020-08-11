const CoordParser = require("./coord-parser.js");

const icons = new Map([
  ["$D", "./icons/doorway.svg"],
  ["$G", "./icons/goblin.png"],
  ["$T", "./icons/trap.svg"],
  ["$P", "./icons/pillar-round.svg"],
  ["$p", "./icons/pillar-square.svg"],
  ["$S", "./icons/statue.svg"],
  ["$F", "./icons/fireplace.svg"],
  ["$O", "./icons/open-pit.svg"],
  ["$o", "./icons/covered-pit.svg"],
]);

module.exports = class IconParser {
  parse(str) {
    if (str.length < 4) return false;

    // a string matching a token definition eg. D3rp-asdsa
    const reg = /^([A-Za-z][A-Za-z]?[0-9][0-9]?)(\$[A-Za-z])$/;
    if (reg.test(str)) {
      const matches = str.match(reg);
      const coords = CoordParser.parse(matches[1]);
      const icon = icons.get(matches[2]);

      return {
        x: coords.x,
        y: coords.y,
        icon,
      };
    }

    return false;
  }
}

import CoordParser from "./coord-parser.js";

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

export default class IconParser {
  parse(str) {
    let trimmed = str.trim();
    if (trimmed[0] === "/") trimmed = trimmed.substr(1);
    if (trimmed[trimmed.length - 1] === "/")
      trimmed = trimmed.substr(0, trimmed.length - 1);

    if (str.length < 4) return false;

    // a string matching a token definition eg. D3rp-asdsa
    const reg = /^([A-Za-z][A-Za-z]?[0-9][0-9]?)(\$[A-Za-z])$/;
    if (reg.test(trimmed)) {
      const matches = trimmed.match(reg);
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

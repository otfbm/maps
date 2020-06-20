import CoordParser from "./coord-parser.js";
import Overlay from "../overlay.js";

const flagLookups = new Map([
  ["g", "forestgreen"],
  ["r", "firebrick"],
  ["b", "cornflowerblue"],
  ["y", "gold"],
  ["p", "darkviolet"],
  ["c", "deepskyblue"],
  ["d", "darkgoldenrod"],
  ["T", "tiny"],
  ["S", "small"],
  ["M", "medium"],
  ["L", "large"],
  ["H", "huge"],
  ["G", "gargantuan"],
]);

const sizes = ['T', 'S', 'M', 'L', 'H', 'G'];
const colors = ['g', 'r', 'b', 'y', 'p', 'c', 'd'];

export default class TokenParser {
  parse(str) {
    let trimmed = str.trim();
    if (trimmed[0] === "/") trimmed = trimmed.substr(1);
    if (trimmed[trimmed.length - 1] === "/")
      trimmed = trimmed.substr(0, length - 1);
    if (str.length < 2) return false;

    // a string matching a token definition eg. D3rp-asdsa
    const reg = /^([A-Za-z][A-Za-z]?[0-9][0-9]?)([grbypcdTSMLHG]?[grbypcdTSMLHG]?)(-([A-Za-z0-9_-\s]*))?$/;
    if (reg.test(trimmed)) {
      const matches = trimmed.match(reg);

      let coords = CoordParser.parse(matches[1]);

      let color = 'black';
      let size = 'medium';
      for (const char of matches[2] || "") {
        if (colors.includes(char)) color = flagLookups.get(char);
        if (sizes.includes(char)) size = flagLookups.get(char);
      }

      return new Overlay({
        cell: matches[1],
        color,
        size,
        type: 'token',
        label: matches[4] || "",
      });
    }

    return false;
  }
}

import Overlay from "../overlay.js";
import ColourParser from "./colour-parser.js";

const sizeLookups = new Map([
  ["T", "tiny"],
  ["S", "small"],
  ["M", "medium"],
  ["L", "large"],
  ["H", "huge"],
  ["G", "gargantuan"]
]);

const sizes = ['T', 'S', 'M', 'L', 'H', 'G'];

export default class TokenParser {
  parse(str) {
    let trimmed = str.trim();
    if (trimmed[0] === "/") trimmed = trimmed.substr(1);
    if (trimmed[trimmed.length - 1] === "/")
      trimmed = trimmed.substr(0, length - 1);
    if (str.length < 2) return false;

    // a string matching a token definition eg. D3rp-asdsa
    const reg = /^([A-Z]{1,2}[0-9]{1,2})([TSMLHG]*?)(BK|GY|BN|[WKEARGBYPCNO]|~[0-9A-f]{6}|~[0-9A-f]{3})?(-([\w-\s]*))?$/i;
    if (reg.test(trimmed)) {
      const matches = trimmed.match(reg);

      let color = ColourParser.parse(matches[3]);

      let size = 'medium';
      for (const char of matches[2] || "") {
        let upperChar = char.toUpperCase();
        if (sizes.includes(upperChar)) 
          size = sizeLookups.get(upperChar);
      }

      return new Overlay({
        cell: matches[1],
        color,
        size,
        type: 'token',
        label: matches[5] || "",
      });
    }

    return false;
  }
}

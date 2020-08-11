const Overlay = require("../overlay.js");
const ColourParser = require("./colour-parser.js");

const sizeLookups = new Map([
  ["T", "tiny"],
  ["S", "small"],
  ["M", "medium"],
  ["L", "large"],
  ["H", "huge"],
  ["G", "gargantuan"],
]);

const sizes = ["T", "S", "M", "L", "H", "G"];

module.exports = class TokenParser {
  parse(str) {
    if (str.length < 2) return false;

    // a string matching a token definition eg. D3rp-asdsa
    const reg = /^([A-Z]{1,2}[0-9]{1,2})([TSMLHG]*?)(BK|GY|BN|[WKEARGBYPCNO]|~[0-9A-f]{6}|~[0-9A-f]{3})?(-(.+))?$/i;
    if (reg.test(str)) {
      const matches = str.match(reg);

      // special case: garguantuan yellow
      if (
        matches[2] === "" &&
        matches[3] !== undefined &&
        matches[3].match(/gy/i)
      ) {
        matches[2] = "g";
        matches[3] = "y";
      }

      let color = ColourParser.parse(matches[3]);

      let size = "medium";
      for (const char of matches[2] || "") {
        let upperChar = char.toUpperCase();
        if (sizes.includes(upperChar)) size = sizeLookups.get(upperChar);
      }

      // handle uri encoded strings
      let label = matches[5];
      try {
        if (label) label = decodeURI(label);
      } catch (err) {
        // noop
      }

      return new Overlay({
        cell: matches[1],
        color,
        size,
        type: "token",
        label: label || "",
      });
    }

    return false;
  }
};

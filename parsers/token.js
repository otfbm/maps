const Overlay = require("../overlay.js");
const ColourParser = require("./colour-parser.js");
const SizeParser = require("./size-parser.js");

module.exports = class TokenParser {
  async parse(str, tokenImages) {
    if (str.length < 2) return false;

    // a string matching a token definition eg. D3rp-asdsa
    const reg = /^([A-Z]{1,2}[0-9]{1,2})([TSMLHG]*?)(PK|PU|BK|GY|BN|[WKEARGBYPCNOI]|~[0-9A-f]{6}|~[0-9A-f]{3})?(-([^~]+))?(~([a-z0-9]+~?))?$/i;
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

      const color = ColourParser.parse(matches[3]);
      const size = SizeParser.parse(matches[2]);

      // handle uri encoded strings
      let label = matches[5];
      try {
        if (label) label = decodeURI(label);
      } catch (err) {
        // noop
      }

      const imageCode = matches[7] || null;

      let imageURL;
      if (!imageCode) imageURL = this.imageForLabel(tokenImages, label);

      return new Overlay({
        cell: matches[1],
        color,
        size,
        type: "token",
        label: label || "",
        imageURL,
        imageCode,
      });
    }

    return false;
  }

  imageForLabel(tokenImages, label) {
    if (!tokenImages) return null;
    for (const [pattern, url] of Object.entries(tokenImages)) {
      const regex = new RegExp(pattern.toLowerCase().replace('#', '[0-9]*'));
      if (regex.test(label.toLowerCase())) return url;
    }
  }
};

const overlays = new Map([
  ["$T", "trap"],
  ["$P", "pillar-round"],
  ["$p", "pillar-square"],
  ["$S", "statue-star"],
  ["$F", "fireplace"],
  ["$O", "open-pit"],
  ["$o", "covered-pit"],
]);

const Overlay = require("../overlay.js");

module.exports = class OverlayParser {
  parse(str) {
    if (str.length < 4) return false;
    const reg = /^([A-Za-z][A-Za-z]?[0-9][0-9]?)([A-Za-z][A-Za-z]?[0-9][0-9]?)?(\$[A-Za-z])$/;

    if (reg.test(str)) {
      const matches = str.match(reg);
      const tl = matches[1];
      const br = matches[2];
      const type = overlays.get(matches[3]);
      return new Overlay({ cells: [tl, br], type });
    }

    return false;
  }
}

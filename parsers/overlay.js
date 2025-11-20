import ColorParser from "./colour-parser.js";

const overlays = new Map([
  ["tr", "trap"],
  ["pr", "pillar-round"],
  ["ps", "pillar-square"],
  ["ss", "statue-star"],
  ["po", "open-pit"],
  ["pc", "covered-pit"],
  ["la", "ladder"],
  ["gs", "gargoyle-statue"],
  ["mp", "magic-portal"],
  ["sp", "spiked-pit"],
  ["fi", "fire"],
  ["cr", "crystals"],
  ["bw", "brick-wall"],
  ["st", "stairs"],
  ["li", "lightning"],
  ["th", "stone-throne"],
  ["tw", "trip-wire"],
  ["pe", "person"],
  ["ow", "crowd"],
  ["wn", "wind"],
  ["we", "web"],
  ["pa", "palisade"],
  ["un", "spiked-trunk"],
  ["sd", "secret-door"],
  ["or", "thorns"],
  ["co", "column"],
  ["ex", "explosion"],
  ["ch", "chair"],
  ["ta", "table"],
  ["ne", "net"],
  ["pu", "puddle"],
  ["es", "chest"]
]);

import Overlay from "../overlay.js";

export default class OverlayParser {
  parse(str) {
    if (str.length < 4) return false;
    const reg = /^([A-Za-z][A-Za-z]?[0-9][0-9]?)([A-Za-z][A-Za-z]?[0-9][0-9]?)?(PK|PU|BK|GY|BN|[WKEARGBYPCNOI]|~[0-9A-F]{6}|~[0-9A-F]{3})?\$([A-Za-z]{2})?$/i;

    if (reg.test(str)) {
      const matches = str.match(reg);
      const tl = matches[1];
      const br = matches[2];
      let color = "#000000";
      if (matches[3]) color = ColorParser.parse(matches[3]);

      const type = overlays.get(matches[4].toLowerCase());

      return new Overlay({
        color,
        cells: [tl, br],
        type
      });
    }

    return false;
  }
}

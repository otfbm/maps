const CoordParser = require("./coord-parser.js");
const TriangleEffect = require("../effects/triangle-effect.js");
const CircleEffect = require("../effects/circle-effect.js");
const SquareEffect = require("../effects/square-effect.js");
const ArrowEffect = require("../effects/arrow-effect.js");
const ColourParser = require("./colour-parser.js");

const effectShapes = new Map([
  ["T", "triangle"], // aka cone
  ["C", "circle"],
  ["L", "line"],
  ["S", "square"],
  ["R", "rectangle"],
  ["A", "arrow"],
]);

const decorateUnder = (obj, under) => {
  obj.under = !!under;
  return obj;
}

module.exports = class EffectParser {
  parse(str) {
    let trimmed = str.toUpperCase();
    if (trimmed.charAt(0) !== "*") return false;

    const reg = /\*([TLSRCA])([OT]?)([0-9]*)(\,[0-9]*)?(PK|PU|GY|BK|BN|[WKEARGBYPCNOI]|~[0-9A-F]{6}|~[0-9A-F]{3})?(([A-Z]{1,2}[0-9]{1,2})+)(_)?/;
    if (!reg.test(trimmed)) return false;

    const matches = trimmed.match(reg);
    let shape = effectShapes.get(matches[1]);
    let anchorType = matches[2];
    let size = matches[3];
    let colour = ColourParser.parse(matches[5]);
    let coords = CoordParser.parseSet(matches[6]);
    const renderUnder = matches[8];

    switch (shape) {
      case "triangle":
        return decorateUnder(
          new TriangleEffect({
            size,
            colour,
            startPt: coords[0],
            endPt: coords[1],
          }),
          renderUnder
        );
      case "circle":
        return decorateUnder(
          new CircleEffect({ size, colour, anchorPt: coords[0], anchorType }),
          renderUnder
        );
      case "square":
        if (anchorType !== "T" && coords.length >= 2)
          return decorateUnder(
            new SquareEffect({
              width: size,
              length: size,
              colour,
              startPt: coords[0],
              endPt: coords[1],
              anchorTopLeft: false,
            }),
            renderUnder
          );
        return decorateUnder(
          new SquareEffect({
            width: size,
            length: size,
            colour,
            startPt: coords[0],
            endPt: null,
            anchorTopLeft: true,
          }),
          renderUnder
        );
      case "rectangle":
      case "line":
        let size2 = matches[4] ? matches[4].substr(1) : 5;
        return decorateUnder(
          new SquareEffect({
            width: size2,
            length: size,
            colour,
            startPt: coords[0],
            endPt: coords[1],
            anchorTopLeft: false,
          }),
          renderUnder
        );
      case "arrow":
        if (coords.length === 2)
          return decorateUnder(
            new ArrowEffect({ colour, startPt: coords[0], endPt: coords[1] }),
            renderUnder
          );
        break;
    }
    return false;
  }
};

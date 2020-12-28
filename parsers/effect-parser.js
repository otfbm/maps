const CoordParser = require("./coord-parser.js");
const TriangleEffect = require("../effects/triangle-effect.js");
const CircleEffect = require("../effects/circle-effect.js");
const SquareEffect = require("../effects/square-effect.js");
const ArrowEffect = require("../effects/arrow-effect.js");
const MoveEffect = require("../effects/move-effect.js");
const ColourParser = require("./colour-parser.js");

const effectShapes = new Map([
  ["T", "triangle"], // aka cone
  ["C", "circle"],
  ["CT", "circle-top"],
  ["CO", "circle-offset"],
  ["L", "line"],
  ["S", "square"],
  ["ST", "square-top"],
  ["R", "rectangle"],
  ["M", "move"], // aka fancy arrow
  ["A", "arrow"]
]);

module.exports = class EffectParser {
  parse(str) {
    let trimmed = str.toUpperCase();
    if (trimmed.charAt(0) !== '*')
      return false;

    const reg = /\*(CT|CO|ST|[TLSRCA])([0-9]*)(\,[0-9]*)?(PK|PU|GY|BK|BN|[WKEARGBYPCNOI]|~[0-9A-F]{6}|~[0-9A-F]{3})?(([A-Z]{1,2}[0-9]{1,2})+)/;
    if (!reg.test(trimmed))
      return false;

    const matches = trimmed.match(reg);
    let shape = effectShapes.get(matches[1]);
    let size = matches[2];
    let colour = ColourParser.parse(matches[4]);
    let coords = CoordParser.parseSet(matches[5]);

    switch (shape) {
      case "triangle":
        return new TriangleEffect({ size, colour, startPt: coords[0], endPt: coords[1] });
      case "circle":
        return new CircleEffect({ size, colour, anchorPt: coords[0], anchorType: null });
      case "circle-top":
        return new CircleEffect({ size, colour, anchorPt: coords[0], anchorType: 'T' });
      case "circle-offset":
        return new CircleEffect({ size, colour, anchorPt: coords[0], anchorType: 'O' });
      case "square":
        if (coords.length >= 2)
          return new SquareEffect({ width: size, length: size, colour, startPt: coords[0], endPt: coords[1], anchorTopLeft: false });
        return new SquareEffect({ width: size, length: size, colour, startPt: coords[0], endPt: null, anchorTopLeft: true });
      case "square-top":
        return new SquareEffect({ width: size, length: size, colour, startPt: coords[0], endPt: null, anchorTopLeft: true });
      case "rectangle":
      case "line":
        let size2 = matches[3] ? matches[3].substr(1) : 5;
        return new SquareEffect({ width: size2, length: size, colour, startPt: coords[0], endPt: coords[1], anchorTopLeft: false });
      case "arrow":
        if (coords.length === 2)
          return new ArrowEffect({ colour, startPt: coords[0], endPt: coords[1] });
        break;
      case "move":
        if (coords.length === 2)
          return new MoveEffect({ colour, startPt: coords[0], endPt: coords[1] });
        break;
    }
    return false;
  }
}

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

const decorateUnder = (obj, under) => {
  obj.under = !!under;
  return obj;
};

module.exports = class EffectParser {
  parse(str) {
    let trimmed = str.toUpperCase();
    if (trimmed.charAt(0) !== "*") return false;

    const reg = /\*(U)?(CT|CO|ST|[TLSRCAM])([0-9]*)(\,[0-9]*)?(PK|PU|GY|BK|BN|[WKEARGBYPCNOI]|~[0-9A-F]{6}|~[0-9A-F]{3})?(([A-Z]{1,2}[0-9]{1,2})+)/;
    if (!reg.test(trimmed)) return false;

    const matches = trimmed.match(reg);
    const renderUnder = matches[1];
    let shape = effectShapes.get(matches[2]);
    let size = matches[3];
    let size2 = matches[4] ? matches[4].substr(1) : null;
    let colour = ColourParser.parse(matches[5]);
    let coords = CoordParser.parseSet(matches[6]);

    let overlay;
    switch (shape) {
      case "triangle":
        overlay = new TriangleEffect({
          size,
          colour,
          startPt: coords[0],
          endPt: coords[1],
        });
        break;
      case "circle":
        overlay = new CircleEffect({
          size,
          innerRadius: size2,
          colour,
          anchorPt: coords[0],
          anchorType: null
        });
        break;
      case "circle-top":
        overlay = new CircleEffect({
          size,
          innerRadius: size2,
          colour,
          anchorPt: coords[0],
          anchorType: 'T'
        });
        break;
      case "circle-offset":
        overlay = new CircleEffect({
          size,
          innerRadius: size2,
          colour,
          anchorPt: coords[0],
          anchorType: 'O'
        });
        break;
      case "square":
        if (coords.length >= 2) {
          overlay = new SquareEffect({
            width: size,
            length: size,
            colour,
            startPt: coords[0],
            endPt: coords[1],
            anchorTopLeft: false
          });
          break;
        }
        overlay = new SquareEffect({
          width: size,
          length: size,
          colour,
          startPt: coords[0],
          endPt: null,
          anchorTopLeft: true
        });
        break;
      case "square-top":
        overlay = new SquareEffect({
          width: size,
          length: size,
          colour,
          startPt: coords[0],
          endPt: null,
          anchorTopLeft: true
        });
        break;
      case "rectangle":
      case "line":
        overlay = new SquareEffect({
          width: size2 != null ? size2 : 5,
          length: size,
          colour,
          startPt: coords[0],
          endPt: coords[1],
          anchorTopLeft: false
        });
        break;
      case "arrow":
        if (coords.length === 2) {
          overlay = new ArrowEffect({
            colour,
            startPt: coords[0],
            endPt: coords[1],
          });
        }
        break;
      case "move":
        if (coords.length === 2)
          overlay = new MoveEffect({ colour, startPt: coords[0], endPt: coords[1] });
        break;
    }
    if (!overlay) return false;

    return decorateUnder(overlay, renderUnder);
  }
};

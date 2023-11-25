import CoordParser from "./coord-parser.js";
import TriangleEffect from "../effects/triangle-effect.js";
import CircleEffect from "../effects/circle-effect.js";
import SquareEffect from "../effects/square-effect.js";
import ArrowEffect from "../effects/arrow-effect.js";
import ColourParser from "./colour-parser.js";

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
};

export default class EffectParser {
  parse(str) {
    let trimmed = str.toUpperCase();
    if (trimmed.charAt(0) !== "*") return false;

    const reg =
      /\*(U)?([TLSRCA])([OT]?)([0-9]*)(\,[0-9]*)?(PK|PU|GY|BK|BN|[WKEARGBYPCNOI]|~[0-9A-F]{6}|~[0-9A-F]{3})?(([A-Z]{1,2}[0-9]{1,2})+)/;
    if (!reg.test(trimmed)) return false;

    const matches = trimmed.match(reg);
    const renderUnder = matches[1];
    let shape = effectShapes.get(matches[2]);
    let anchorType = matches[3];
    let size = matches[4];
    let colour = ColourParser.parse(matches[6]);
    let coords = CoordParser.parseSet(matches[7]);

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
          colour,
          anchorPt: coords[0],
          anchorType,
        });
        break;
      case "square":
        if (anchorType !== "T" && coords.length >= 2) {
          overlay = new SquareEffect({
            width: size,
            length: size,
            colour,
            startPt: coords[0],
            endPt: coords[1],
            anchorTopLeft: false,
          });
          break;
        }
        overlay = new SquareEffect({
          width: size,
          length: size,
          colour,
          startPt: coords[0],
          endPt: null,
          anchorTopLeft: true,
        });
        break;
      case "rectangle":
      case "line":
        let size2 = matches[5] ? matches[5].substring(1) : 5;
        overlay = new SquareEffect({
          width: size2,
          length: size,
          colour,
          startPt: coords[0],
          endPt: coords[1],
          anchorTopLeft: false,
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
    }
    if (!overlay) return false;

    return decorateUnder(overlay, renderUnder);
  }
}

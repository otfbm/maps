import CoordParser from "./coord-parser.js";
import TriangleEffect from "../effects/triangle-effect.js";
import CircleEffect from "../effects/circle-effect.js";
import SquareEffect from "../effects/square-effect.js";
import ArrowEffect from "../effects/arrow-effect.js";

const effectShapes = new Map([
  ['T', "triangle"], // aka cone
  ['C', "circle"],
  ['L', "line"],
  ['S', "square"],
  ['R', "rectangle"],
  ["A", "arrow"]
]);

const effectColours = new Map([
  ['W', "white"],
  ['L', "black"],
  ["G", "forestgreen"],
  ["R", "firebrick"],
  ["B", "cornflowerblue"],
  ["Y", "gold"],
  ["P", "darkviolet"],
  ["C", "deepskyblue"],
  ["D", "darkgoldenrod"]
]);

export default class EffectParser {
  parse(str) {
    let trimmed = str.trim().toUpperCase();
    if (trimmed.charAt(0) !== '*')
      return false;

    const reg = /\*([TLSRCA])([0-9]*)(\,[0-9]*)?([A-Z])?(([A-Z][A-Z]?[0-9][0-9]?)+)/;
    if (!reg.test(trimmed))
      return false;

    const matches = trimmed.match(reg);
    let shape = effectShapes.get(matches[1]);
    let size = matches[2];
    let size2 = 0;
    let colour = effectColours.get(matches[4]) || "black";
    let coords = CoordParser.parseSet(matches[5]);

    switch (shape) {
      case "triangle":
        return new TriangleEffect({ size, colour, startPt: coords[0], endPt: coords[1] });
      case "circle":
        let anchorAtCenter = matches[3] ? false : true;
        size2 = matches[3] ? matches[3].substr(1) : 0;
        return new CircleEffect({ size, colour, anchorPt: coords[0], offset: size2, anchorAtCenter });
      case "square":
        return new SquareEffect({ width: size, length: size, colour, startPt: coords[0], endPt: coords[1] });
      case "line":
      case "rectangle":
          size2 = matches[3] ? matches[3].substr(1) : 5;
          return new SquareEffect({ width: size2, length: size, colour, startPt: coords[0], endPt: coords[1] });
        break;
      case "arrow":
        if (coords.length === 2)
          return new ArrowEffect({ colour, startPt: coords[0], endPt: coords[1] });
        break;
    }
    return false;
  }
}

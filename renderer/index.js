import canvas from "canvas";
import SVGRenderer from "./svg.js";
import CanvasRenderer from "./canvas.js";

// overlays
import assert from "assert";
import Options from "../options.js";
import Stairs from "../overlays/stairs/index.js";
import Token from "../overlays/token/index.js";

const { createCanvas, loadImage } = canvas;

export default class Renderer {
  constructor(options) {
    assert(
      options instanceof Options,
      "Renderer expects options to be instance of Options"
    );

    // const canv = createCanvas(width + 2 * PADDING, height + 2 * PADDING);
    this.canv = createCanvas(options.width + 2 * options.padding, options.height + 2 * options.padding);
    this.ctx = this.canv.getContext("2d");

    this.canvas = new CanvasRenderer(this.ctx, options);
    this.svg = new SVGRenderer(this.ctx, options);
  }

  render({ x, y, item } = {}) {
    if (item.type === "overlay") {
      switch (item.name) {
        case "stairs":
          this.svg.render({ renderer: Stairs, item, x, y });
          break;
        case "token":
          this.svg.render({ renderer: Token, item, x, y });
          break;
        // TODO: add cases here
      }
    }
  }
}

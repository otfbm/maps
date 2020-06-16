import canvas from "canvas";
import SVGRenderer from "./svg.js";
import CanvasRenderer from "./canvas.js";

// overlays
import assert from "assert";
import Options from "../options.js";
import Stairs from "../overlays/stairs/index.js";
import Token from "../overlays/token/index.js";
import Trap from "../overlays/trap/index.js";
import PillarRound from "../overlays/pillar-round/index.js";
import PillarSquare from "../overlays/pillar-square/index.js";
import StatueStar from "../overlays/statue-star/index.js";
import CoveredPit from "../overlays/covered-pit/index.js";
import OpenPit from "../overlays/open-pit/index.js";

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

  renderOverlay(cell) {
    console.log(cell.overlay.type);
    switch (cell.overlay.type) {
      case "token":
        this.svg.renderCell(cell, Token);
        break;
      case "trap":
        this.svg.renderCell(cell, Trap);
        break;
      case "pillar-round":
        this.svg.renderCell(cell, PillarRound);
        break;
      case "pillar-square":
        this.svg.renderCell(cell, PillarSquare);
        break;
      case "statue-star":
        this.svg.renderCell(cell, StatueStar);
        break;
      case "covered-pit":
        this.svg.renderCell(cell, CoveredPit);
        break;
      case "open-pit":
        this.svg.renderCell(cell, OpenPit);
        break;
      // TODO: add cases here
    }
  }
}

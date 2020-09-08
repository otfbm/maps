const canvas = require("canvas");
const SVGRenderer = require("./svg.js");
const CanvasRenderer = require("./canvas.js");

// overlays
const assert = require("assert");
const Options = require("../options.js");
const Stairs = require("../overlays/stairs/index.js");
const Token = require("../overlays/token/index.js");
const Trap = require("../overlays/trap/index.js");
const PillarRound = require("../overlays/pillar-round/index.js");
const PillarSquare = require("../overlays/pillar-square/index.js");
const StatueStar = require("../overlays/statue-star/index.js");
const CoveredPit = require("../overlays/covered-pit/index.js");
const OpenPit = require("../overlays/open-pit/index.js");

const { createCanvas, registerFont } = canvas;

registerFont('./fonts/Azo-Sans-Regular.otf', { 
  family: 'AzoSans',
  weight: 'normal',
  style: 'normal',
});
registerFont('./fonts/Azo-Sans-Italic.otf', { 
  family: 'AzoSansItalic',
  weight: 'normal',
  style: 'italic',
});
registerFont('./fonts/Azo-Sans-Bold.otf', {
  family: 'AzoSansBold',
  weight: 'bold',
  style: 'normal',
});
registerFont('./fonts/Azo-Sans-Bold-Italic.otf', {
  family: 'AzoSansBoldItalic',
  weight: 'bold',
  style: 'italic',
});
registerFont('./fonts/Fleisch-Wurst.otf', {
  family: 'FleischWurst',
  weight: 'normal',
  style: 'normal',
});

module.exports = class Renderer {
  constructor(options) {
    assert(
      options instanceof Options,
      "Renderer expects options to be instance of Options"
    );

    // const canv = createCanvas(width + 2 * PADDING, height + 2 * PADDING);
    this.canv = createCanvas(options.widthPx + 2 * options.cellSizePx, options.heightPx + 2 * options.cellSizePx);
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
    switch (cell.overlay.type) {
      case "token":
        this.canvas.renderCell(cell, Token);
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

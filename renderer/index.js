const canvas = require("canvas");
const SVGRenderer = require("./svg.js");
const CanvasRenderer = require("./canvas.js");

// overlays
const assert = require("assert");
const Options = require("../options.js");
const Stairs = require("../overlays/stairs/index.js");
const Token = require("../overlays/token/index.js");
const MultiToken = require("../overlays/token/index.js");
const Trap = require("../overlays/trap/index.js");
const PillarRound = require("../overlays/pillar-round/index.js");
const PillarSquare = require("../overlays/pillar-square/index.js");
const StatueStar = require("../overlays/statue-star/index.js");
const CoveredPit = require("../overlays/covered-pit/index.js");
const OpenPit = require("../overlays/open-pit/index.js");
const Ladder = require("../overlays/ladder/index.js");
const MagicPortal = require("../overlays/magic-portal/index.js")
const GargoyleStatue = require("../overlays/gargoyle-statue/index.js")
const SpikedPit = require("../overlays/spiked-pit/index.js")
const Fire = require("../overlays/fire/index.js")
const Crystals = require("../overlays//crystals/index.js")
const BrickWall = require("../overlays/brick-wall/index.js")
const Lightning = require("../overlays/lightning/index.js")
const StoneThrone = require("../overlays/stone-throne/index.js")
const TripWire = require("../overlays/trip-wire/index.js")
const Person = require("../overlays/person/index.js")
const Crowd = require("../overlays/crowd/index.js")
const Wind = require("../overlays/wind/index.js")
const Web = require("../overlays/web/index.js")
const Palisade = require("../overlays/palisade/index.js")
const SpikedTrunk = require("../overlays/spiked-trunk/index.js")
const SecretDoor = require("../overlays/secret-door/index.js")
const Thorns = require("../overlays/thorns/index.js")
const Column = require("../overlays/column/index.js")
const Explosion = require("../overlays/explosion/index.js")
const Chair = require("../overlays/chair/index.js")
const Table = require("../overlays/table/index.js")
const Net = require("../overlays/net/index.js")
const Puddle = require("../overlays/puddle/index.js")
const Chest = require("../overlays/chest/index.js")

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

    this.canv = createCanvas(options.canvasWidth, options.canvasHeight);
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
      case "multitoken":
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
      case "ladder":
        this.svg.renderCell(cell, Ladder);
        break;
      case "magic-portal":
        this.svg.renderCell(cell, MagicPortal);
        break;
      case "gargoyle-statue":
        this.svg.renderCell(cell, GargoyleStatue);
        break;
      case "spiked-pit":
        this.svg.renderCell(cell, SpikedPit);
        break;
      case "fire":
        this.svg.renderCell(cell, Fire);
        break;
      case "crystals":
        this.svg.renderCell(cell, Crystals);
        break;
      case "brick-wall":
        this.svg.renderCell(cell, BrickWall);
        break;
      case "stairs":
        this.svg.renderCell(cell, Stairs);
        break;
      case "lightning":
        this.svg.renderCell(cell, Lightning);
        break;
      case "stone-throne":
        this.svg.renderCell(cell, StoneThrone);
        break;
      case "trip-wire":
        this.svg.renderCell(cell, TripWire);
        break;
      case "person":
        this.svg.renderCell(cell, Person);
        break;
      case "crowd":
        this.svg.renderCell(cell, Crowd);
        break;
      case "wind":
        this.svg.renderCell(cell, Wind);
        break;
      case "web":
        this.svg.renderCell(cell, Web);
        break;
      case "palisade":
        this.svg.renderCell(cell, Palisade);
        break;
      case "spiked-trunk":
        this.svg.renderCell(cell, SpikedTrunk);
        break;
      case "secret-door":
        this.svg.renderCell(cell, SecretDoor);
        break;
      case "thorns":
        this.svg.renderCell(cell, Thorns);
        break;
      case "column":
        this.svg.renderCell(cell, Column);
        break;
      case "explosion":
        this.svg.renderCell(cell, Explosion);
        break;
      case "chair":
        this.svg.renderCell(cell, Chair);
        break;
      case "table":
        this.svg.renderCell(cell, Table);
        break;
      case "net":
        this.svg.renderCell(cell, Net);
        break;
      case "puddle":
        this.svg.renderCell(cell, Puddle);
        break;
      case "chest":
        this.svg.renderCell(cell, Chest);
        break;
      // TODO: add cases here
    }
  }
}

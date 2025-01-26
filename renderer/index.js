import canvas from "canvas";
import SVGRenderer from "./svg.js";
import CanvasRenderer from "./canvas.js";
import assert from "assert";
import Options from "../options.js";
import Stairs from "../overlays/stairs/index.js";
import Token from "../overlays/token/index.js";
import MultiToken from "../overlays/token/index.js";
import Trap from "../overlays/trap/index.js";
import PillarRound from "../overlays/pillar-round/index.js";
import PillarSquare from "../overlays/pillar-square/index.js";
import StatueStar from "../overlays/statue-star/index.js";
import CoveredPit from "../overlays/covered-pit/index.js";
import OpenPit from "../overlays/open-pit/index.js";
import Ladder from "../overlays/ladder/index.js";
import MagicPortal from "../overlays/magic-portal/index.js";
import GargoyleStatue from "../overlays/gargoyle-statue/index.js";
import SpikedPit from "../overlays/spiked-pit/index.js";
import Fire from "../overlays/fire/index.js";
import Crystals from "../overlays//crystals/index.js";
import BrickWall from "../overlays/brick-wall/index.js";
import Lightning from "../overlays/lightning/index.js";
import StoneThrone from "../overlays/stone-throne/index.js";
import TripWire from "../overlays/trip-wire/index.js";
import Person from "../overlays/person/index.js";
import Crowd from "../overlays/crowd/index.js";
import Wind from "../overlays/wind/index.js";
import Web from "../overlays/web/index.js";
import Palisade from "../overlays/palisade/index.js";
import SpikedTrunk from "../overlays/spiked-trunk/index.js";
import SecretDoor from "../overlays/secret-door/index.js";
import Thorns from "../overlays/thorns/index.js";
import Column from "../overlays/column/index.js";
import Explosion from "../overlays/explosion/index.js";
import Chair from "../overlays/chair/index.js";
import Table from "../overlays/table/index.js";
import Net from "../overlays/net/index.js";
import Puddle from "../overlays/puddle/index.js";
import Chest from "../overlays/chest/index.js";

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

export default class Renderer {
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

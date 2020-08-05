const BoardParser = require("./parsers/board.js");
const TokenParser = require("./parsers/token.js");
const IconParser = require("./parsers/icon.js");
const OverlayParser = require("./parsers/overlay.js");
const ZoomParser = require("./parsers/zoom.js");
const BackgroundParser = require("./parsers/background.js");
const LineParser = require("./parsers/line.js");
const DarkModeParser = require("./parsers/dark-mode.js");
const GridOpacityParser = require("./parsers/grid-opacity.js");
const Icon = require("./icon.js");
const EffectParser = require("./parsers/effect-parser.js");
const PanParser = require('./parsers/pan.js');
const GridsizeParser = require('./parsers/gridsize.js');

module.exports = class InputParser {
  constructor() {
    this.board = { width: 10, height: 10 };
    this.lines = [];
    this.tokens = [];
    this.effects = [];
    this.icons = [];
    this.overlays = [];
    this.options = [];
    this.zoom = 1;
    this.darkMode = false;
    this.gridOpacity = 1;
    this.background = null;
    this.panX = 0;
    this.panY = 0;
    this.gridsize = 40;

    this.panParser = new PanParser();
    this.backgroundParser = new BackgroundParser();
    this.boardParser = new BoardParser();
    this.tokenParser = new TokenParser();
    this.iconParser = new IconParser();
    this.overlayParser = new OverlayParser();
    this.zoomParser = new ZoomParser();
    this.lineParser = new LineParser();
    this.darkModeParser = new DarkModeParser();
    this.gridOpacityParser = new GridOpacityParser();
    this.effectParser = new EffectParser();
    this.gridsizeParser = new GridsizeParser();
  }

  async parse(pathname = "", query = {}) {
    let parts = [];
    // trim off leading /
    if (pathname[0] === "/") parts = pathname.substr(1);
    // trim of trailing /
    if (pathname[pathname.length - 1] === "/")
      pathname.substr(0, pathname.length - 1);
    parts = pathname.split("/");

    this.background = await this.backgroundParser.parse(query);

    for (const part of parts) {
      let parsed = this.boardParser.parse(part);
      if (parsed) {
        this.board = parsed;
        continue;
      }

      parsed = this.tokenParser.parse(part);
      if (parsed) {
        this.tokens.push(parsed);
        continue;
      }

      parsed = this.overlayParser.parse(part);
      if (parsed) {
        this.overlays.push(parsed);
        continue;
      }

      parsed = this.iconParser.parse(part);
      if (parsed) {
        this.icons.push({ x: parsed.x, y: parsed.y, item: new Icon(parsed) });
        continue;
      }

      parsed = this.lineParser.parse(part);
      if (parsed) {
        this.lines = this.lines.concat(parsed);
        continue;
      }

      parsed = this.effectParser.parse(part);
      if (parsed) {
        this.effects.push(parsed);
        continue;
      }

      parsed = this.panParser.parse(part);
      if (parsed) {
        this.panX = parsed.x;
        this.panY = parsed.y;
        continue;
      }

      parsed = this.gridsizeParser.parse(part);
      if (parsed) {
        this.gridsize = parsed.size;
        continue;
      }

      /* Because all of the options here can be grouped, we need to parse them
         together and not skip after a successful parse  */

      parsed = this.zoomParser.parse(part);
      if (parsed) {
        this.zoom = parsed;
      }

      parsed = this.darkModeParser.parse(part);
      if (parsed) {
        this.darkMode = parsed;
      }

      parsed = this.gridOpacityParser.parse(part);
      if (null !== parsed) {
        /* This check is like this because one of the valid returns is 0.0 */
        this.gridOpacity = parsed;
      }

      // Extend by adding more parsers here
    }

    // ensure that width and pan don't exceed 100
    if ((this.board.width + this.panX) > 100) {
      this.panX = 100 - this.board.width;
    }
    if ((this.board.height + this.panY) > 100){
      this.panY = 100 - this.board.height;
    }
  }
};

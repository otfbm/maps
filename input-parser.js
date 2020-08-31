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
const GridsizeParser = require('./parsers/gridsize.js');
const BackgroundOffsetParser = require('./parsers/background-offset.js');
const BackgroundZoomParser = require('./parsers/background-zoom.js');
const OpaqueEdgeParser = require('./parsers/opaque-edge.js');

module.exports = class InputParser {
  constructor() {
    this.board = { width: 10, height: 10, panX: 0, panY: 0 };
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
    this.gridsize = 40;
    this.backgroundOffsetX = 0;
    this.backgroundOffsetY = 0;
    this.backgroundZoom = 1;
    this.edgeOpacity = 0.6;

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
    this.backgroundOffsetParser = new BackgroundOffsetParser();
    this.backgroundZoomParser = new BackgroundZoomParser();
    this.opaqueEdgeParser = new OpaqueEdgeParser();
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

    for (let part of parts) {
      part = part.trim();
      if (part[0] === '/') part = part.substr(1);
      if (part[part.length-1] === '/') part = part.substr(0, part.length - 1);

      let parsed = this.boardParser.parse(part);
      if (parsed) {
        this.board = parsed;
        continue;
      }

      parsed = await this.tokenParser.parse(part);
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

      /* Because all of the options here can be grouped, we need to parse them
         together and not skip after a successful parse  */

      parsed = this.darkModeParser.parse(part);
      if (parsed) {
        this.darkMode = parsed;
      }

      parsed = this.gridOpacityParser.parse(part);
      if (null !== parsed) {
        /* This check is like this because one of the valid returns is 0.0 */
        this.gridOpacity = parsed;
      }

      parsed = this.opaqueEdgeParser.parse(part);
      if (parsed) {
        this.edgeOpacity = parsed;
      }

      let p = {str: part};

      parsed = this.gridsizeParser.parse(p);
      if (parsed) {
        this.gridsize = parsed.size;
      }

      parsed = this.backgroundOffsetParser.parse(p);
      if (parsed) {
        this.backgroundOffsetX = parsed.x;
        this.backgroundOffsetY = parsed.y;
      }

      parsed = this.backgroundZoomParser.parse(p);
      if (parsed) {
        this.backgroundZoom = parsed;
      }

      parsed = this.zoomParser.parse(p);
      if (parsed) {
        this.zoom = parsed;
      }

      // Extend by adding more parsers here
    }

    // ensure that width and pan don't exceed 100
    if ((this.board.width + this.board.panX) > 100) {
      this.board.panX = 100 - this.board.width;
    }
    if ((this.board.height + this.board.panY) > 100){
      this.board.panY = 100 - this.board.height;
    }
  }
};

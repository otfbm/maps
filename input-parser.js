const BoardParser = require("./parsers/board.js");
const TokenParser = require("./parsers/token.js");
const IconParser = require("./parsers/icon.js");
const OverlayParser = require("./parsers/overlay.js");
const BackgroundParser = require("./parsers/background.js");
const LineParser = require("./parsers/line.js");
const Icon = require("./icon.js");
const EffectParser = require("./parsers/effect-parser.js");

module.exports = class InputParser {
  constructor() {
    this.lines = [];
    this.tokens = [];
    this.effects = [];
    this.icons = [];
    this.overlays = [];
  
    this.backgroundParser = new BackgroundParser();
    this.boardParser = new BoardParser();
    this.tokenParser = new TokenParser();
    this.iconParser = new IconParser();
    this.overlayParser = new OverlayParser();
    this.lineParser = new LineParser();
    this.effectParser = new EffectParser();
  }

  async parse(options, pathname = "", query = {}) {
    let parts = [];
    // trim off leading /
    if (pathname[0] === "/") parts = pathname.substr(1);
    // trim of trailing /
    if (pathname[pathname.length - 1] === "/")
      pathname.substr(0, pathname.length - 1);
    parts = pathname.split("/");

    options.background.image = await this.backgroundParser.parse(query);

    for (let part of parts) {
      part = part.trim();
      if (part[0] === '/') part = part.substr(1);
      if (part[part.length-1] === '/') part = part.substr(0, part.length - 1);

      let parsed = this.boardParser.parse(part);
      if (parsed) {
        options.setView(parsed);
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

      // Extend by adding more parsers here

      parsed = options.parseOptions(part);
    }
  }
};

const ViewParser = require("./parsers/view-parser.js");
const TokenParser = require("./parsers/token.js");
const IconParser = require("./parsers/icon.js");
const OverlayParser = require("./parsers/overlay.js");
const BackgroundParser = require("./parsers/background.js");
const LineParser = require("./parsers/line-parser.js");
const Icon = require("./icon.js");
const EffectParser = require("./parsers/effect-parser.js");
const FogParser = require("./parsers/fog-parser.js");
const ConfigParser = require('./parsers/config.js');

module.exports = class InputParser {
  constructor() {
    this.lines = [];
    this.tokens = [];
    this.effects = [];
    this.fog = [];
    this.icons = [];
    this.overlays = [];
    this.tokenImages = {};
  
    this.configParser = new ConfigParser();
    this.backgroundParser = new BackgroundParser();
    this.viewParser = new ViewParser();
    this.tokenParser = new TokenParser();
    this.iconParser = new IconParser();
    this.overlayParser = new OverlayParser();
    this.lineParser = new LineParser();
    this.effectParser = new EffectParser();
    this.fogParser = new FogParser();
  }

  async parse(options, pathname = "", query = {}) {
    if (query.load) {
      const config = await this.configParser.parse(query);
      if (query.bg) {
        config.background = query.bg;
      }
      await this.parseConfig(config, options);
    } else {
      if (query.bg) {
        options.background.image = await this.backgroundParser.parse(query);
      }
    }

    let parts = [];
    // trim off leading /
    if (pathname[0] === "/") parts = pathname.substr(1);
    // trim of trailing /
    if (pathname[pathname.length - 1] === "/")
      pathname.substr(0, pathname.length - 1);
    parts = pathname.split("/");

    for (let part of parts) {
      part = part.trim();
      if (part[0] === '/') part = part.substr(1);
      if (part[part.length-1] === '/') part = part.substr(0, part.length - 1);

      let parsed = this.viewParser.parse(part);
      if (parsed) {
        options.view = parsed;
        continue;
      }

      parsed = await this.tokenParser.parse(part, this.tokenImages);
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

      parsed = this.fogParser.parse(part);
      if (parsed) {
        this.fog.push(parsed);
        continue;
      }

      // Extend by adding more parsers here

      parsed = options.parseOptions(part);
    }
  }

  async parseConfig(c, options) {
    if (c.background) {
      options.background.image = await this.backgroundParser.parse({ bg: c.background });
    }

    if (c.tokenImages) {
      this.tokenImages = c.tokenImages;
    }

    if (c.view) {
      const parsed = this.viewParser.parse(c.view);
      if (parsed) options.view = parsed;
    }

    if (c.tokens) {
      for (const token of c.tokens) {
        const parsed = await this.tokenParser.parse(token, this.tokenImages);
        if (parsed) this.tokens.push(parsed);
      }
    }

    if (c.objects) {
      for (const overlay of c.overlays) {
        const parsed = this.overlayParser.parse(overlay);
        if (parsed) this.overlays.push(parsed);
      }
    }

    if (c.walls) {
      for (const wall of c.walls) {
        const parsed = this.lineParser.parse(wall);
        if (parsed) this.lines = this.lines.concat(parsed);
      }
    }

    if (c.overlays) {
      for (const overlay of c.overlays) {
        const parsed = this.effectParser.parse(overlay);
        if (parsed) {
          this.effects.push(parsed);
          continue;
        }
      }
    }

    if (c.options) {
      options.parseOptions(c.options);
    }
  }
};

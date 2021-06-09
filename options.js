const ColourParser = require("./parsers/colour-parser.js");

const lightColour = "#f4f6ff"; // Powdered Sugar
const darkColour = "#07031a"; // Midnight Blue

module.exports = class Options {

  constructor() {
    this._view = { width: 10, height: 10, panX: 0, panY: 0 };
    this._zoom = 1;
    this._cellSize = 40;
    this._darkMode = false;
    this._gridOpacity = 0.5;
    this._gridColour = "#f4f6ff"; // Powdered Sugar
    this._isGridUserColour = false;
    this._edgeOpacity = 0.6;
    this._background = { image: null, offsetX: 0, offsetY: 0, zoom: 1 };
    this._font = 'AzoSans';
  }

  set view(value) {
    this._view = value;

    // ensure that width and pan don't exceed 100
    if ((this._view.width + this._view.panX) > 100) {
      this._view.panX = 100 - this._view.width;
    }
    if ((this._view.height + this._view.panY) > 100) {
      this._view.panY = 100 - this._view.height;
    }
  }

  parseOptions(str) {
    if (str.charAt(0) !== '@')
      return false;

    let parsed = this.parseZoom(str);

    let matches = str.match(/(G(PK|PU|BK|GY|BN|[WKEARGBYPCNOI]|~[0-9A-F]{6}|~[0-9A-F]{3}))|[DEFN]|H[0-9]*|C[0-9]{2,3}(\.[0-9])?|[BZ][0-9\.]*|[O][0-9]+:[0-9]+/ig);

    if (!matches)
      return parsed;

    for (const match of matches) {
      switch (match.charAt(0)) {

        case 'b':
          const bgZoom = parseFloat(match.substring(1), 10);
          if (!Number.isNaN(bgZoom))
            this._background.zoom = bgZoom;
          break;

        case 'c':
          let size = parseFloat(match.substring(1));
          if (size < 20) size = 20;
          if (size > 200) size = 200;
          this._cellSize = size;
          break;

        case 'd':
          this._darkMode = true;
          break;

        case 'e':
          this._edgeOpacity = 1;
          break;

        case 'f':
          this._font = 'FleischWurst';
          break;

        case 'g':
          this._gridColour = ColourParser.parse(match.substring(1));
          this._isGridUserColour = true;
          this._gridOpacity = 100;
          break;

        case 'h':
          if (match.length > 1) {
            const opacity = Number(match.substring(1), 10);
            this._gridOpacity = opacity <= 100 ? opacity / 100 : 1;
          }
          else
            this._gridOpacity = 0.25;
          break;

        case 'n':
          this._gridOpacity = 0;
          break;

        case 'o':
          const offset = match.substring(1).split(':');
          this._background.offsetX = parseInt(offset[0]);
          this._background.offsetY = parseInt(offset[1]);
          break;

        case 'z':
          const zoom = parseFloat(match.substring(1), 10);
          if (!Number.isNaN(zoom))
            this._zoom = zoom;
          break;
      }
    }

    return true;
  }

  parseZoom(str) {
    let match = str.match(/^@([0-9](\.[0-9]{1,3})?|\.[0-9]{1,3})/);
    if (match) {
      let zoom = Number(match[1]);
      this._zoom = zoom <= 3 ? zoom : 3;
      return true;
    }
    return false;
  }

  // derived properties
  get cellSizePx() {
    return this._cellSize * this._zoom;
  }

  get widthPx() {
    return this._view.width * this.cellSizePx;
  }

  get heightPx() {
    return this._view.height * this.cellSizePx;
  }

  get canvasWidth() {
    return this.widthPx + 2 * this.cellSizePx;
  }

  get canvasHeight() {
    return this.heightPx + 2 * this.cellSizePx;
  }

  get fg() {
    if (this.isGridUserColour)
      return this.gridColour;

    return this.darkMode ? lightColour : darkColour;
  }

  get bg() {
    return this.darkMode ? darkColour : lightColour;
  }

  // basic properties
  get view() {
    return this._view;
  }

  get zoom() {
    return this._zoom;
  }

  get darkMode() {
    return this._darkMode;
  }

  get gridOpacity() {
    return this._gridOpacity;
  }

  get gridColour() {
    return this._gridColour;
  }

  get isGridUserColour() {
    return this._isGridUserColour;
  }

  get edgeOpacity() {
    return this._edgeOpacity;
  }

  get background() {
    return this._background;
  }

  get font() {
    return this._font;
  }
}

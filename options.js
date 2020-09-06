module.exports = class Options {

  constructor() {
    this.view = { width: 10, height: 10, panX: 0, panY: 0 };
    this.zoom = 1;
    this.cellSize = 40;
    this.darkMode = false;
    this.gridOpacity = 0.5;
    this.edgeOpacity = 0.6;
    this.background = { image: null, offsetX: 0, offsetY: 0, zoom: 1 };
    this.tokenFont = 'AzoSans';
  }

  setView(value) {
    this.view = value;

    // ensure that width and pan don't exceed 100
    if ((this.view.width + this.view.panX) > 100) {
      this.view.panX = 100 - this.view.width;
    }
    if ((this.view.height + this.view.panY) > 100) {
      this.view.panY = 100 - this.view.height;
    }
  }

  parseOptions(str) {
    if (str.charAt(0) !== '@')
      return false;

    this.parseZoom(str);

    let matches = str.match(/[DEF]|[CH][0-9]*|[BZ][0-9\.]*|[O][0-9]+:[0-9]+/ig);

    for (const match of matches) {
      switch (match.charAt(0)) {

        case 'b':
          const bgZoom = parseFloat(match.substring(1), 10);
          if (!Number.isNaN(bgZoom))
            this.background.zoom = bgZoom;
          break;
          
        case 'c':
          let size = parseInt(match.substring(1), 10);
          if (size < 20) size = 20;
          if (size > 100) size = 100;
          this.cellSize = size;
          break;

        case 'd':
          this.darkMode = true;
          break;

        case 'e':
          this.edgeOpacity = 1;
          break;

        case 'f':
          this.tokenFont = 'FleischWurst';
          break;

        case 'h':
          if (match.length > 1) {
            const opacity = Number(match.substring(1), 10);
            this.gridOpacity = opacity <= 100 ? opacity / 100 : 1;
          }
          else
            this.gridOpacity = 0.25;
          break;

        case 'o':
          const offset = match.substring(1).split(':');
          this.background.offsetX = parseInt(offset[0]);
          this.background.offsetY = parseInt(offset[1]);
          break;

        case 'z':
          const zoom = parseFloat(match.substring(1), 10);
          if (!Number.isNaN(zoom))
            this.zoom = zoom;
          break;
      }
    }

    return true;
  }

  parseZoom(str) {
    let match = str.match(/^@([0-9](\.[0-9]{1,3})?|\.[0-9]{1,3})/);
    if (match) {
      let zoom = Number(match[1]);
      this.zoom = zoom <= 3 ? zoom : 3;
    }
  }

  get cellSizePx() {
    return this.cellSize * this.zoom;
  }

  get widthPx() {
    return this.view.width * this.cellSizePx;
  }

  get heightPx() {
    return this.view.height * this.cellSizePx;
  }
}

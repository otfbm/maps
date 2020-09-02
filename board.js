const Line = require("./line.js");
const canvas = require("canvas");
const { Image } = canvas;

/* Constant definitions for fonts, colors, etc. */
const boardFont = '1em FleischWurst';
const tokenFont = '12px bold AzoSans';

const fillLightMode = "#f4f6ff"; // Powdered Sugar
const fillDarkMode = "#07031a"; // Midnight Blue

const textLightMode = "rgb(7, 3, 26)";
const textDarkMode = "rgb(244, 246, 255)";

const gridLineColour = "#f4f6ff"; // Powdered Sugar
const scaleMarkerColour = "#888888"; // Grey

module.exports = class Board {
  constructor({
    width,
    height,
    gridsize = 40,
    zoom = 1,
    padding,
    ctx,
    strokeStyle = "#CCCCCC",
    darkMode = false,
    gridOpacity = 1.0,
    panX = 0,
    panY = 0,
    backgroundOffsetX = 0,
    backgroundOffsetY = 0,
    backgroundZoom = 1,
    edgeOpacity = 0.6,
  }) {
    this.width = width;
    this.height = height;
    this.gridsize = gridsize;
    this.ctx = ctx;
    this.padding = padding;
    this.strokeStyle = strokeStyle;
    this.state = [];
    this.background = null;
    this.zoom = zoom;
    this.lines = [];
    this.effects = [];
    this.darkMode = darkMode;
    this.gridOpacity = gridOpacity;
    this.panX = Number(panX);
    this.panY = Number(panY);
    this.backgroundOffsetX = backgroundOffsetX;
    this.backgroundOffsetY = backgroundOffsetY;
    this.backgroundZoom = backgroundZoom;
    this.edgeOpacity = edgeOpacity;

    for (let x = 0; x < width; x++) {
      let arr = [];
      for (let y = 0; y < height; y++) {
        arr[y] = null;
      }
      this.state[x] = arr;
    }
  }

  placeItem(x, y, item) {
    this.state[x][y] = item;
  }

  addBackground(background) {
    this.background = background;
  }

  addLines(lines) {
    this.lines = lines;
  }

  addEffects(effects) {
    this.effects = effects;
  }

  get(x, y) {
    return this.state[x][y] || null;
  }

  [Symbol.iterator]() {
    let x = 0;
    let y = 0;
    return {
      next: () => {
        if (x < this.state.length || (y && y < this.state[x].length)) {
          const value = { value: { x, y, item: this.get(x, y) }, done: false };
          if (y < this.state[x].length - 1) y++;
          else {
            x++;
            y = 0;
          }
          return value;
        } else {
          return { done: true };
        }
      },
    };
  }

  drawBorder() {
    // undo padding and any pan before drawing the border
    this.ctx.translate(-this.padding + this.panX * this.gridsize, -this.padding + this.panY * this.gridsize);

    const textDarkModeAlpha = `rgba(244, 246, 255, ${this.edgeOpacity})`;
    const textLightModeAlpha = `rgba(7, 3, 26, ${this.edgeOpacity})`;

    let bg = '';
    let fg = '';
    if (this.darkMode) {
      bg = textLightModeAlpha;
      fg = textDarkMode;
    } else {
      bg = textDarkModeAlpha;
      fg = textLightMode;
    }

    // fill the edges
    this.ctx.beginPath();
    this.ctx.lineCap = "square";
    this.ctx.lineWidth = this.padding;
    this.ctx.strokeStyle = bg;
    // TL -> BL
    this.ctx.moveTo(this.padding * 0.5, 0);
    this.ctx.lineTo(this.padding * 0.5, this.height + this.padding * 2);
    // BL -> BR
    this.ctx.moveTo(this.padding * 1.5, this.height + this.padding * 1.5);
    this.ctx.lineTo(this.width + this.padding * 0.5, this.height + this.padding * 1.5);
    // BR -> TR
    this.ctx.moveTo(this.width + this.padding * 1.5, this.height + this.padding * 2);
    this.ctx.lineTo(this.width + this.padding * 1.5, 0);
    // TR -> TL
    this.ctx.moveTo(this.width + this.padding * 0.5, this.padding * 0.5);
    this.ctx.lineTo(this.padding * 1.5, this.padding * 0.5);
    this.ctx.stroke();

    // outer grid lines
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = fg;

    const imgheight = this.imgheight * this.backgroundZoom * this.zoom;
    const imgwidth = this.imgwidth * this.backgroundZoom * this.zoom;

    const isEdgeOpaque = this.edgeOpacity == 1 || this.background === null;

    const atLeft = isEdgeOpaque || this.panX < 1;
    const atRight = isEdgeOpaque || this.panX * this.gridsize + this.width + this.gridsize - 1 >= imgwidth;
    const atTop = isEdgeOpaque || this.panY < 1;
    const atBottom = isEdgeOpaque || this.panY * this.gridsize + this.height + this.gridsize - 1 >= imgheight;

    const drawGridEdgeLine = (start, end, isSolid) => {
      this.ctx.beginPath();
      if (isSolid)
        this.ctx.setLineDash([]);
      else
        this.ctx.setLineDash([5 * this.zoom - 2, 5 * this.zoom + 2]);
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.stroke();
    }

    drawGridEdgeLine(
      { x: this.padding, y: this.padding },
      { x: this.width + this.padding, y: this.padding },
      atTop
    );

    drawGridEdgeLine(
      { x: this.width + this.padding, y: this.padding },
      { x: this.width + this.padding, y: this.height + this.padding },
      atRight
    );

    drawGridEdgeLine(
      { x: this.padding, y: this.height + this.padding },
      { x: this.width + this.padding, y: this.height + this.padding },
      atBottom
    );

    drawGridEdgeLine(
      { x: this.padding, y: this.padding },
      { x: this.padding, y: this.height + this.padding },
      atLeft
    );

    // Draw dotted lines
    if (!isEdgeOpaque) {    
      this.ctx.strokeStyle = fg;

      const drawDottedLine = (start, end) => {
        drawGridEdgeLine(start, end, false);
      }

      const leftoverHeight = imgheight % this.gridsize
      const height = imgheight - leftoverHeight;
      const drawHeight = height - (this.panY * this.gridsize) + this.padding;
      const leftoverWidth = imgwidth % this.gridsize
      const width = imgwidth - leftoverWidth;
      const drawWidth = width - (this.panX * this.gridsize) + this.padding;
      const startHeight = this.padding + this.height;
      const endHeight = this.padding * 2 + this.height;
      const startWidth = this.padding + this.width;
      const endWidth = this.padding * 2 + this.width;

      if (atLeft) {
        if (!atBottom) {
          drawDottedLine(
            { x: this.padding, y: this.padding + this.height },
            { x: this.padding, y: this.padding * 2 + this.height },
          );
        }
        if (!atTop) {
          drawDottedLine(
            { x: this.padding, y: 0 },
            { x: this.padding, y: this.padding },
          );
        }
      }

      if (atTop) {
        if (!atRight) {
          drawDottedLine(
            { x: this.padding + this.width, y: this.padding },
            { x: this.padding * 2 + this.width, y: this.padding }
          );
        }
        if (!atLeft) {
          drawDottedLine(
            { x: 0, y: this.padding },
            { x: this.padding, y: this.padding },
          );
        }
      }

      if (!atLeft) {
        if (drawHeight < this.padding * 2 + this.height) { // dont draw right on the edge of the canvas, it looks weird
          drawDottedLine(
            { x: 0, y: drawHeight },
            { x: this.padding, y: drawHeight }
          );
        }
      }

      if (!atBottom) {
        if (drawWidth < this.padding * 2 + this.width) { // dont draw right on the edge of the canvas, it looks weird
          if (drawWidth < this.width) { // dont draw over the "5ft" key
            drawDottedLine(
              { x: drawWidth, y: startHeight },
              { x: drawWidth, y: endHeight },
            );
          }
        }
      }

      if (!atTop) {
        if (drawWidth < this.padding * 2 + this.width) { // dont draw right on the edge of the canvas, it looks weird
          drawDottedLine(
            { x: drawWidth, y: 0 },
            { x: drawWidth, y: this.padding },
          );
        }
      }

      if (!atRight) {
        if (drawHeight < this.padding * 2 + this.height) { // dont draw right on the edge of the canvas, it looks weird
          drawDottedLine(
            { x: startWidth, y: drawHeight },
            { x: endWidth, y: drawHeight }
          );
        }
      }
    }
    
    // grid label settings
    this.ctx.fillStyle = fg;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = `${this.gridsize * 0.35}px FleischWurst`;

    // Drawing the Alphabetic coordinate markers
    for (let i = 0; i <= this.width; i += this.gridsize) {
      const num = i / this.gridsize;
      if (num < 1) continue;

      let x = num + this.panX - 1;
      let character = String.fromCharCode(x % 26 + 65);
      if (x >= 26)
        character = String.fromCharCode(Math.floor(x / 26) + 64) + character;

      this.ctx.fillText(
        character,
        this.padding + i - this.gridsize / 2,
        this.padding / 2
      );
    }

    // Drawing the numeral coordinate markers
    for (let i = this.gridsize; i <= this.height; i += this.gridsize) {
      this.ctx.beginPath();
      const num = i / this.gridsize + this.panY;
      if (num < 1) continue;

      this.ctx.fillText(
        String(num),
        this.padding / 2,
        this.padding + i - this.gridsize / 2
      );
    }

    // Drawing the scale marker
    this.ctx.beginPath();
    this.ctx.setLineDash([]);
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "square";
    this.ctx.strokeStyle = atBottom ? scaleMarkerColour : fg;

    this.ctx.moveTo(this.padding + this.width - this.gridsize, this.padding + this.height + (this.gridsize * 0.15));
    this.ctx.lineTo(this.padding + this.width - this.gridsize, this.padding + this.height + (this.gridsize * 0.65));

    this.ctx.moveTo(this.padding + this.width - this.gridsize, this.padding + this.height + (this.gridsize * 0.5));
    this.ctx.lineTo(this.padding + this.width - this.gridsize + (this.gridsize * 0.1), this.padding + this.height + (this.gridsize * 0.5));

    this.ctx.moveTo(this.padding + this.width, this.padding + this.height + (this.gridsize * 0.15));
    this.ctx.lineTo(this.padding + this.width, this.padding + this.height + (this.gridsize * 0.65));

    this.ctx.moveTo(this.padding + this.width, this.padding + this.height + (this.gridsize * 0.5));
    this.ctx.lineTo(this.padding + this.width - (this.gridsize * 0.1), this.padding + this.height + (this.gridsize * 0.5));

    this.ctx.stroke();

    // Scale text
    this.ctx.beginPath();
    this.ctx.fillStyle = atBottom ? scaleMarkerColour : fg;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      "5ft",
      this.padding + this.width - (this.gridsize / 2),
      this.padding + this.height + (this.gridsize / 2),
      this.gridsize,
    );
  }

  drawGridLines() {
    if (this.gridOpacity === 0)
      return;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = gridLineColour;
    this.ctx.globalAlpha = this.gridOpacity;
    this.ctx.globalCompositeOperation = "difference";

    for (let i = this.gridsize; i < this.width; i += this.gridsize) {
      this.ctx.moveTo(0.5 + i + this.padding, this.padding);
      this.ctx.lineTo(0.5 + i + this.padding, this.height + this.padding);
    }

    for (let i = this.gridsize; i < this.height; i += this.gridsize) {
      this.ctx.moveTo(this.padding, 0.5 + i + this.padding);
      this.ctx.lineTo(this.width + this.padding, 0.5 + i + this.padding);
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.darkMode ? fillDarkMode : fillLightMode;
    this.ctx.fillRect(
      0,
      0,
      this.width * this.gridsize,
      this.height * this.gridsize
    );

    if (this.background) {
      const img = new Image();

      img.onload = () => {
        const gridsize = this.gridsize / this.zoom;
        const offsetX = this.backgroundOffsetX / this.zoom;
        const offsetY = this.backgroundOffsetY / this.zoom;
        const scaledOffsetX = this.backgroundOffsetX;
        const scaledOffsetY = this.backgroundOffsetY;
        const offsetTrimX = (img.width * this.backgroundZoom - offsetX) % gridsize;
        const offsetTrimY = (img.height * this.backgroundZoom - offsetY) % gridsize;
        const scaledOffsetTrimX = offsetTrimX * this.zoom;
        const scaledOffsetTrimY = offsetTrimY * this.zoom;

        this.imgwidth = img.width;
        this.imgheight = img.height;

        this.ctx.drawImage(
          img,
          offsetX,
          offsetY,
          img.width - offsetX - offsetTrimX,
          img.height - offsetY - offsetTrimY,
          this.padding - this.panX * this.gridsize,
          this.padding - this.panY * this.gridsize,
          (img.width * this.backgroundZoom * this.zoom) - scaledOffsetX - scaledOffsetTrimX,
          (img.height * this.backgroundZoom * this.zoom) - scaledOffsetY - scaledOffsetTrimY,
        );
      };
      img.onerror = (err) => {
        throw err;
      };
      img.src = this.background;
    }

    this.drawGridLines();

    // move ctx to account for padding and pan
    this.ctx.translate(this.padding - this.panX * this.gridsize, this.padding - this.panY * this.gridsize);

    for (const line of this.lines) {
      let l = new Line(line, this.darkMode ? textDarkMode : textLightMode, this.darkMode ? fillDarkMode : fillLightMode);
      l.draw(this.ctx, this.gridsize, this.zoom);
    }

    /* Keep the light text for tokens */
    this.ctx.font = tokenFont;
    this.ctx.fillStyle = textDarkMode;
    for (const { x, y, item } of this) {
      if (item) {
        if (item.type !== 'token') {
          item.draw(this.ctx, x, y, this.gridsize, this.zoom);
        }
      }
    }
  }

  drawEffects() {
    for (let effect of this.effects)
      effect.draw(this.ctx, this.gridsize);
  }
}

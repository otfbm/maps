const Line = require("./line.js");
const canvas = require("canvas");
const { Image, createCanvas } = canvas;

/* Constant definitions for fonts, colors, etc. */
const gridLineColour = "#f4f6ff"; // Powdered Sugar
const scaleMarkerColour = "#888888"; // Grey

module.exports = class Board {
  constructor({
    ctx,
    options
  }) {
    this.state = [];
    this.lines = [];
    this.effects = [];
    this.fog = [];

    this.ctx = ctx;
    this.options = options;

    this.width = options.widthPx;
    this.height = options.heightPx;
    this.panX = Number(options.view.panX);
    this.panY = Number(options.view.panY);
    this.gridsize = options.cellSizePx;
    this.zoom = options.zoom;
    this.padding = options.cellSizePx;
    this.gridOpacity = options.gridOpacity;
    this.gridColour = options.gridColour;
    this.isGridUserColour = options.isGridUserColour;
    this.background = options.background.image;
    this.backgroundOffsetX = options.background.offsetX * options.zoom;
    this.backgroundOffsetY = options.background.offsetY * options.zoom;
    this.backgroundZoom = options.background.zoom;
    this.edgeOpacity = options.edgeOpacity;

    for (let x = 0; x < options.view.width; x++) {
      let arr = [];
      for (let y = 0; y < options.view.height; y++) {
        arr[y] = null;
      }
      this.state[x] = arr;
    }
  }

  placeItem(x, y, item) {
    this.state[x][y] = item;
  }

  addLines(lines) {
    this.lines = lines;
  }

  addEffects(effects) {
    this.effects = effects;
  }

  addFog(fog) {
    this.fog = fog;
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
    let bgAlpha = this.options.darkMode ? textLightModeAlpha : textDarkModeAlpha;

    const imgheight = this.imgheight * this.backgroundZoom * this.zoom;
    const imgwidth = this.imgwidth * this.backgroundZoom * this.zoom;

    const isEdgeOpaque = this.edgeOpacity == 1 || this.background === null;

    const atLeft = isEdgeOpaque || this.panX < 1;
    const atRight = isEdgeOpaque || this.panX * this.gridsize + this.width + this.gridsize - 1 >= imgwidth;
    const atTop = isEdgeOpaque || this.panY < 1;
    const atBottom = isEdgeOpaque || this.panY * this.gridsize + this.height + this.gridsize - 1 >= imgheight;

    // fill the edges
    this.ctx.lineCap = "square";
    this.ctx.lineWidth = this.padding;

    const fillEdge = (start, end, colour) => {
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.strokeStyle = colour;
      this.ctx.stroke();
    }

    // TL -> BL
    fillEdge(
      { x: this.padding * 0.5, y: 0 },
      { x: this.padding * 0.5, y: this.height + this.padding * 2 },
      atLeft ? this.options.bg : bgAlpha
    );

    // BL -> BR
    if (atBottom) {
      fillEdge(
        { x: this.padding * 0.5, y: this.height + this.padding * 1.5 },
        { x: this.width + this.padding * 1.5, y: this.height + this.padding * 1.5 },
        this.options.bg
      );
    } else {
      fillEdge(
        { x: this.padding * 1.5, y: this.height + this.padding * 1.5 },
        { x: this.width + this.padding * 0.5, y: this.height + this.padding * 1.5 },
        bgAlpha
      );
    }

    // TR -> BR
    fillEdge(
      { x: this.width + this.padding * 1.5, y: 0 },
      { x: this.width + this.padding * 1.5, y: this.height + this.padding * 2 },
      atRight ? this.options.bg : bgAlpha
    );

    // TL -> TR
    if (atTop) {
      fillEdge(
        { x: this.padding * 0.5, y: this.padding * 0.5 },
        { x: this.width + this.padding * 1.5, y: this.padding * 0.5 },
        this.options.bg
      );
    } else {
      fillEdge(
        { x: this.padding * 1.5, y: this.padding * 0.5 },
        { x: this.width + this.padding * 0.5, y: this.padding * 0.5 },
        bgAlpha
      );
    }

    // outer grid lines
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.options.fg;

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
      this.ctx.strokeStyle = this.options.fg;

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

    // axis label settings
    this.ctx.fillStyle = this.options.fg;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = `${this.gridsize * 0.35}px ${this.options.font}`;

    // Drawing x axis alphabetic labels
    let num = this.panX;
    for (let i = this.gridsize; i <= this.width; i += this.gridsize) {
      let character = String.fromCharCode(num % 26 + 65);
      if (num >= 26)
        character = String.fromCharCode(Math.floor(num / 26) + 64) + character;

      this.ctx.fillText(
        character,
        this.padding + i - this.gridsize / 2,
        this.padding / 2
      );

      num += 1;
    }

    // Drawing y axis numeric labels
    num = this.panY;
    for (let i = this.gridsize; i <= this.height; i += this.gridsize) {
      num += 1;

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
    this.ctx.strokeStyle = atBottom ? scaleMarkerColour : this.options.fg;

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
    this.ctx.fillStyle = atBottom ? scaleMarkerColour : this.options.fg;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      "5ft",
      this.padding + this.width - (this.gridsize / 2),
      this.padding + this.height + (this.gridsize / 2),
      this.gridsize,
    );
  }

  drawGridLines(ctx = this.ctx) {
    if (this.gridOpacity === 0)
      return;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.gridColour;
    ctx.globalAlpha = this.gridOpacity;
    if (!this.isGridUserColour)
      ctx.globalCompositeOperation = "difference";

    for (let i = this.gridsize; i < this.width - 1; i += this.gridsize) {
      ctx.moveTo(0.5 + i + this.padding, this.padding);
      ctx.lineTo(0.5 + i + this.padding, this.height + this.padding);
    }

    for (let i = this.gridsize; i < this.height - 1; i += this.gridsize) {
      ctx.moveTo(this.padding, 0.5 + i + this.padding);
      ctx.lineTo(this.width + this.padding, 0.5 + i + this.padding);
    }

    ctx.stroke();
    ctx.restore();
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.options.bg;
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
        throw new Error('Failed to load background image');
      };
      img.src = this.background;
    }

    this.drawGridLines();

    // move ctx to account for padding and pan
    this.ctx.translate(this.padding - this.panX * this.gridsize, this.padding - this.panY * this.gridsize);

    Line.fg = this.options.fg;
    Line.bg = this.options.bg;
    for (const line of this.lines) {
      let l = new Line(line);
      l.draw(this.ctx, this.gridsize, this.zoom);
    }

    for (const { x, y, item } of this) {
      if (item) {
        if (item.type !== 'token') {
          item.draw(this.ctx, x, y, this.gridsize, this.zoom);
        }
      }
    }
  }

  drawEffects({ under = false } = {}) {
    for (let effect of this.effects) {
      if (under === true) {
        if (effect.under) effect.draw(this.ctx, this.gridsize);
      } else {
        if (!effect.under) effect.draw(this.ctx, this.gridsize);
      }
    }
  }

  drawFog() {
    if (this.fog.length == 0)
      return;

    // background (fog zone with grid)
    let bgCanv = createCanvas(this.options.canvasWidth, this.options.canvasHeight);
    let bgCtx = bgCanv.getContext("2d");
    bgCtx.beginPath();
    bgCtx.fillStyle = this.options.bg;
    bgCtx.fillRect(0, 0, this.width * this.gridsize, this.height * this.gridsize);
    this.drawGridLines(bgCtx);

    // fog mask
    let fogCanv = createCanvas(this.options.canvasWidth, this.options.canvasHeight);
    let fogCtx = fogCanv.getContext("2d");
    // move fog ctx to account for padding and pan
    fogCtx.translate(this.padding - this.panX * this.gridsize, this.padding - this.panY * this.gridsize);
    for (let f of this.fog)
      f.draw(fogCtx, this.gridsize);

    this.ctx.save();   
    this.ctx.translate(-this.padding + this.panX * this.gridsize, -this.padding + this.panY * this.gridsize);
    this.ctx.globalCompositeOperation = "destination-in";
    this.ctx.drawImage(fogCanv, 0, 0);  
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.drawImage(bgCanv, 0, 0);
    this.ctx.restore();
  }
}

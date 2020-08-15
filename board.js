const Line = require("./line.js");
const canvas = require("canvas");
const { Image } = canvas;

/* Constant definitions for fonts, colors, etc. */
const boardFont = '1em FleischWurst';
const tokenFont = '12px bold AzoSans';

const fillLightMode = "#f4f6ff"; // Powdered Sugar
const fillDarkMode = "#07031a"; // Midnight Blue

const textLightMode = "rgb(7, 3, 26)";
const textLightModeAlpha = "rgba(7, 3, 26, 0.6)";
const textDarkMode = "rgb(244, 246, 255)";
const textDarkModeAlpha = "rgba(244, 246, 255, 0.6)";

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

    let color = '';
    let solidColor = '';
    if (this.darkMode) {
      solidColor = textLightMode;
      color = textLightModeAlpha;
    } else {
      solidColor = textDarkMode;
      color = textDarkModeAlpha;
    }

    // fill the edges
    // TL -> BL
    this.ctx.beginPath();
    this.ctx.lineCap = "square";
    this.ctx.lineWidth = this.padding;
    this.ctx.moveTo( this.padding * 0.5, 0);
    this.ctx.lineTo( this.padding * 0.5, this.height + this.padding * 2);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();

    // BL -> BR
    this.ctx.beginPath();
    this.ctx.lineCap = "square";
    this.ctx.lineWidth = this.padding;
    this.ctx.moveTo( this.padding * 1.5, this.height + this.padding * 1.5);
    this.ctx.lineTo( this.width + this.padding * 0.5, this.height + this.padding * 1.5);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    
    // BR -> TR
    this.ctx.beginPath();
    this.ctx.lineCap = "square";
    this.ctx.lineWidth = this.padding;
    this.ctx.moveTo( this.width + this.padding * 1.5, this.height + this.padding * 2);
    this.ctx.lineTo( this.width + this.padding * 1.5, 0);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();

    // TR -> TL
    this.ctx.beginPath();
    this.ctx.lineCap = "square";
    this.ctx.lineWidth = this.padding;
    this.ctx.moveTo( this.width + this.padding * 0.5, this.padding * 0.5);
    this.ctx.lineTo( this.padding * 1.5, this.padding * 0.5);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    
    // // TL BOX
    // this.ctx.beginPath();
    // this.ctx.fillStyle = solidColor;
    // this.ctx.fillRect(0, 0, this.padding, this.padding);

    // // BL BOX
    // this.ctx.beginPath();
    // this.ctx.fillStyle = solidColor;
    // this.ctx.fillRect(this.padding + this.width, 0, this.padding, this.padding);

    // // BR BOX
    // this.ctx.beginPath();
    // this.ctx.fillStyle = solidColor;
    // this.ctx.fillRect(0, this.padding + this.height, this.padding, this.padding);

    // // TR BOX
    // this.ctx.beginPath();
    // this.ctx.fillStyle = solidColor;
    // this.ctx.fillRect(this.padding + this.width, this.padding + this.height, this.padding, this.padding);

    // outer grid lines
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(0.5 + this.padding, this.padding);
    this.ctx.lineTo(0.5 + this.padding, this.height + this.padding);
    this.ctx.moveTo(0.5 + this.width + this.padding, this.padding);
    this.ctx.lineTo(0.5 + this.width + this.padding, this.height + this.padding);
    this.ctx.moveTo(this.padding, 0.5 + this.padding);
    this.ctx.lineTo(this.width + this.padding, 0.5 + this.padding);
    this.ctx.moveTo(this.padding, 0.5 + this.height + this.padding);
    this.ctx.lineTo(this.width + this.padding, 0.5 + this.height + this.padding);
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.stroke();

    // grid label settings
    this.ctx.fillStyle = this.darkMode ? textDarkMode : textLightMode;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = `${this.gridsize * 0.35}px FleischWurst`;

    // Drawing the Alphabetic coordinate markers
    for (let i = 0; i <= this.width; i += this.gridsize) {
      const num = i / this.gridsize;
      if (num < 1) continue;

      this.ctx.beginPath();
      let character = String.fromCharCode(num + 64 + this.panX);
      if (num + this.panX > 26) {
        const char = String.fromCharCode(num + 38 + this.panX);
        character = `${char}${char}`;
      }
      if (num + this.panX > 52) {
        const char = String.fromCharCode(num + 12 + this.panX);
        character = `${char}${char}${char}`;
      }
      if (num + this.panX > 78) {
        const char = String.fromCharCode(num - 14 + this.panX);
        character = `${char}${char}${char}${char}`;
      }

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

    this.ctx.beginPath();
    this.ctx.moveTo(this.padding + this.width - this.gridsize, this.padding + this.height + (this.gridsize * 0.15));
    this.ctx.lineTo(this.padding + this.width - this.gridsize, this.padding + this.height + (this.gridsize * 0.65));
    this.ctx.strokeStyle = this.darkMode ? textDarkMode : textLightMode;
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = "square";
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.padding + this.width - this.gridsize, this.padding + this.height + (this.gridsize * 0.5));
    this.ctx.lineTo(this.padding + this.width - this.gridsize + (this.gridsize * 0.1), this.padding + this.height + (this.gridsize * 0.5));
    this.ctx.strokeStyle = this.darkMode ? textDarkMode : textLightMode;
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = "square";
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.padding + this.width, this.padding + this.height + (this.gridsize * 0.15));
    this.ctx.lineTo(this.padding + this.width, this.padding + this.height + (this.gridsize * 0.65));
    this.ctx.strokeStyle = this.darkMode ? textDarkMode : textLightMode;
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = "square";
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.padding + this.width, this.padding + this.height + (this.gridsize * 0.5));
    this.ctx.lineTo(this.padding + this.width - (this.gridsize * 0.1), this.padding + this.height + (this.gridsize * 0.5));
    this.ctx.strokeStyle = this.darkMode ? textDarkMode : textLightMode;
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = "square";
    this.ctx.stroke();

    // Drawing the scale marker
    this.ctx.beginPath();
    this.ctx.fillStyle = '#808080';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      "5ft",
      this.padding + this.width - (this.gridsize / 2),
      this.padding + this.height + (this.gridsize / 2),
      this.gridsize,
    );

    // Draw dotted lines
    const drawDottedLine = (start, end) => {
      this.ctx.beginPath();
      this.ctx.setLineDash([5, 5]);
      this.ctx.lineWidth = 1;
      this.ctx.lineCap = "square";
      this.ctx.strokeStyle = this.darkMode ? textDarkMode : textLightMode;
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.stroke();
    }

    const imgheight = this.imgheight * this.zoom;
    const imgwidth = this.imgwidth * this.zoom;
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

    if (this.panY * this.gridsize + this.height + this.gridsize - 1 < imgheight && this.panX < 1) {
      drawDottedLine(
        { x: this.padding, y: this.padding + this.height },
        { x: this.padding, y: this.padding * 2 + this.height },
      );
    }

    if (this.panX < 1 && this.panY > 0) {
      drawDottedLine(
        { x: this.padding, y: 0 },
        { x: this.padding, y: this.padding },
      );
    }

    if (this.panX * this.gridsize + this.width + this.gridsize - 1 < imgwidth && this.panY < 1) {
      drawDottedLine(
        { x: this.padding + this.width, y: this.padding },
        { x: this.padding * 2 + this.width, y: this.padding }
      );
    }

    if (this.panY < 1 && this.panX > 0) {
      drawDottedLine(
        { x: 0, y: this.padding },
        { x: this.padding, y: this.padding },
      );
    }

    if (this.panX > 0) {
      if (drawHeight < this.padding * 2 + this.height) { // dont draw right on the edge of the canvas, it looks weird
        drawDottedLine(
          { x: 0, y: drawHeight },
          { x: this.padding, y: drawHeight }
        );
      }

      if (this.panY * this.gridsize + this.height + this.gridsize - 1 < imgheight) {
        

        if (drawWidth < this.padding * 2 + this.width) { // dont draw right on the edge of the canvas, it looks weird
          if (drawWidth < this.width) { // dont draw over the "5ft" key
            drawDottedLine(
              { x: drawWidth, y: startHeight },
              { x: drawWidth, y: endHeight },
            );
          }
        }
      }
    }

    if (this.panY > 0) {
      if (drawWidth < this.padding * 2 + this.width) { // dont draw right on the edge of the canvas, it looks weird
        drawDottedLine(
          { x: drawWidth, y: 0 },
          { x: drawWidth, y: this.padding },
        );
      }

      if (this.panX * this.gridsize + this.width + this.gridsize - 1 < imgwidth) {
        if (drawHeight < this.padding * 2 + this.height) { // dont draw right on the edge of the canvas, it looks weird
          drawDottedLine(
            { x: startWidth, y: drawHeight },
            { x: endWidth, y: drawHeight }
          );
        }
      }
    }

    
  }

  drawGridLines() {
    if (this.gridOpacity === 0)
      return;

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.globalAlpha = this.gridOpacity;

    for (let i = this.gridsize; i < this.width; i += this.gridsize) {
      this.ctx.moveTo(0.5 + i + this.padding, this.padding);
      this.ctx.lineTo(0.5 + i + this.padding, this.height + this.padding);    
    }

    for (let i = this.gridsize; i < this.height; i += this.gridsize) {
      this.ctx.moveTo(this.padding, 0.5 + i + this.padding);
      this.ctx.lineTo(this.width + this.padding, 0.5 + i + this.padding);
    }

    this.ctx.stroke();
    this.ctx.globalAlpha = 1.0;
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
        const padding = this.padding / this.zoom;
        const offsetX = this.backgroundOffsetX / this.zoom;
        const offsetY = this.backgroundOffsetY / this.zoom;
        const scaledOffsetX = this.backgroundOffsetX;
        const scaledOffsetY = this.backgroundOffsetY;
        const offsetTrimX = (img.width - offsetX) % gridsize;
        const offsetTrimY = (img.height - offsetY) % gridsize;
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
          padding * this.zoom - this.panX * this.zoom * gridsize,
          padding * this.zoom - this.panY * this.zoom * gridsize,
          img.width * this.zoom - scaledOffsetX - scaledOffsetTrimX,
          img.height * this.zoom - scaledOffsetY - scaledOffsetTrimY,

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
        if (item.type === 'token') {
          // const img = new Image();
          // img.onload = () => {
          //   this.ctx.drawImage(
          //     img, 
          //     (x - 1) * this.gridsize + this.padding,
          //     (y - 1) * this.gridsize + this.padding,
          //   );
          // };
          // img.onerror = (err) => {
          //   throw err;
          // };
          // img.src = item.svg(this.gridsize, this.zoom);
        } else {
          item.draw(this.ctx, x, y, this.gridsize, this.zoom);
        }
      }
    }
  }

  drawEffects() {
    for(let effect of this.effects)
      effect.draw(this.ctx, this.gridsize);
  }
}

const Line = require("./line.js");
const canvas = require("canvas");
const { Image } = canvas;

/* Constant definitions for fonts, colors, etc. */
const boardFont = '14px FleischWurst';
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
    this.ctx.font = boardFont;

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
        const sourceX = this.panX * this.gridsize;
        const sourceY = this.panY * this.gridsize;
        const destWidth = img.width * this.backgroundZoom - this.backgroundOffsetX;
        const destHeight = img.height * this.backgroundZoom - this.backgroundOffsetY;

        const destWidthLeftover = destWidth % this.gridsize;
        const destHeightLeftover = destHeight % this.gridsize;

        console.log(destWidthLeftover, destHeightLeftover);

        this.ctx.drawImage(
          img,
          this.backgroundOffsetX,
          this.backgroundOffsetY,
          img.width - this.backgroundOffsetX - destWidthLeftover,
          img.height - this.backgroundOffsetY - destHeightLeftover,
          this.padding - sourceX,
          this.padding - sourceY,
          destWidth - destWidthLeftover,
          destHeight - destHeightLeftover,
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

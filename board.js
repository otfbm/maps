const Line = require("./line.js");
const canvas = require("canvas");
const { Image } = canvas;

/* Constant definitions for fonts, colors, etc. */
const boardFont = "14px impact";
const tokenFont = "12px impact";

const fillLightMode = "#ffffff";
const fillDarkMode = "#000000";
const textLightMode = "#000000";
const textDarkMode = "#ffffff";

module.exports = class Board {
  constructor({
    width,
    height,
    gridsize,
    zoom,
    padding,
    ctx,
    strokeStyle = "#CCCCCC",
    darkMode = false,
    gridOpacity = 1.0,
    panX = 0,
    panY = 0,
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

    // undo padding and any pan to draw the border
    this.ctx.translate(-this.padding + this.panX * this.gridsize, -this.padding + this.panY * this.gridsize);

    this.ctx.fillStyle = this.darkMode ? textDarkMode : textLightMode;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = boardFont;

    // fill the edges
    this.ctx.beginPath();
    this.ctx.moveTo( this.padding * 0.5, this.padding * 0.5);
    this.ctx.lineTo( this.padding * 0.5, this.height + this.padding * 1.5);
    this.ctx.lineTo( this.width + this.padding * 1.5, this.height + this.padding * 1.5);
    this.ctx.lineTo( this.width + this.padding * 1.5, this.padding * 0.5);
    this.ctx.lineTo( this.padding * 0.5, this.padding * 0.5);
    this.ctx.strokeStyle = this.darkMode ? textLightMode : textDarkMode;
    this.ctx.lineWidth = this.padding;
    this.ctx.lineCap = "square";
    this.ctx.stroke();

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
        this.padding - 7
      );
    }

    // Drawing the numeral coordinate markers
    for (let i = 0; i <= this.height; i += this.gridsize) {
      this.ctx.beginPath();
      const num = i / this.gridsize + this.panY;
      if (num < 1) continue;

      this.ctx.fillText(
        String(num),
        this.padding - 8,
        this.padding + i - this.gridsize / 2
      );
    }

    // Drawing the scale marker
    this.ctx.beginPath();
    this.ctx.fillText(
      "1 square = 5ft",
      this.width - this.padding - 10,
      this.height + this.padding + 8
    );
  }

  drawGridLines() {
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

        // if the we try to clip from the bg image outside its size things don't work
        // don't draw a bg if thats the case
        if (sourceX > img.width || sourceY > img.height) return;
        /* We don't want to scale images because we're assuming that any 
           default maps or user-provided maps meet the specifications we 
           outlined in the README.
           Instead of scaling, trim provided image to the map */
        this.ctx.drawImage(
          img,
          sourceX,
          sourceY,
          this.width,
          this.height,
          this.padding,
          this.padding,
          this.width,
          this.height,
        );
      };
      img.onerror = (err) => {
        throw err;
      };
      img.src = this.background;
    }

    this.drawGridLines(); 

    // move ctx to account for padding and pan
    this.ctx.save();
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

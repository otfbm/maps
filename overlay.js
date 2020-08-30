module.exports = class Overlay {
  constructor({ cells = [], cell = "", type, label, color, size, imageCode, image } = {}) {
    this._cells = cells;
    this._cell = cell;
    this._type = type;
    this._label = label;
    this._color = color;
    this._size = size;
    this._imageCode = imageCode;
    this._image = image;
    this._width;
    this._height;
  }

  get tl() {
    if (this._cell) return this._cell;
    if (this._cells.length) return this._cells[0];
  }

  get br() {
    if (this._cell) return this._cell;
    return this._cells[1] || this._cells[0];
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set width(width) {
    this._width = width;
  }

  set height(height) {
    this._height = height;
  }

  get type() {
    return this._type;
  }

  set type(type) {
    this._type = type;
  }

  get label() {
    return this._label;
  }

  set label(label) {
    this._label = label;
  }

  get color() {
    return this._color;
  }

  set color(color) {
    this._color = color;
  }

  get size() {
    return this._size;
  }

  set size(size) {
    this._size = size;
  }

  get imageCode() {
    return this._imageCode;
  }

  set imageCode(imageCode) {
    this._imageCode = imageCode;
  }

  get image() {
    return this._image;
  }

  set image(image) {
    this._image = image;
  }

  toJSON() {
    return {
      tl: this.tl,
      br: this.br,
      width: this.width,
      height: this.height,
      type: this.type,
      label: this.label,
      color: this.color,
      size: this.size,
      image: this.image,
      imageCode: this.imageCode,
    } 
  }
}

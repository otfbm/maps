export default class Overlay {
  constructor({ cells = [], cell = "", type, label } = {}) {
    this._cells = cells;
    this._cell = cell;
    this._type = type;
    this._label = label;
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
}

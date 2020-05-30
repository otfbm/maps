export default class Overlay {
  constructor({ cells = [], cell = '' } = {}) {
      this._cells = cells;
      this._cell = cell;
  }

  get cells() {
      if (this._cell) return [this._cell];
      return this._cells;
  }
}

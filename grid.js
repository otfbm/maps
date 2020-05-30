import assert from "assert";
import Options from "./options.js";
import Overlay from "./overlay.js";

export default class Grid {
  constructor(options) {
    assert(
      options instanceof Options,
      "Grid expects options to be instance of Options"
    );

    this.options = options;
    this._cells = [];

    for (let x = 0; x < options.width; x++) {
      let arr = [];
      for (let y = 0; y < options.height; y++) {
        arr[y] = new Map();
      }
      this._cells[x] = arr;
    }
  }

  add(overlay) {
    assert(
      overlay instanceof Overlay,
      "Grid.add expects overlay to be instance of Overlay"
    );
    // TODO validate that coords are within grid

    let insertLevel = 0;
    // determine if anything exists in any of the cells already
    for (const cell of overlay.cells) {
      const { x, y } = this.convertCellNameToXY(cell);
      const z = this._cells[x][y];

      let level = 0;
      for (let i = 0; i < this.options.depth; i++) {
        if (z.has(i)) level++;
      }
      if (level > insertLevel) insertLevel = level;
    }

    // insert the overlay at the determined insert level
    for (const cell of overlay.cells) {
      const { x, y } = this.convertCellNameToXY(cell);
      const z = this._cells[x][y];
      z.set(insertLevel, {
        overlay,
        x, // calculate from x + padding
        y, // calculate from y + padding
        // width, // calculate from gridsize * zoom * width
        // height, // calculate from gridsize * zoom * height
      });
    }
  }

  convertCellNameToXY(cellName) {
    let str = cellName;
    const characters = [];
    let y;

    while (str.length) {
      if (Number.isNaN(parseInt(str[0], 10))) {
        characters.push(str[0]);
        str = str.substr(1);
      } else {
        y = parseInt(str, 10) - 1;
        str = "";
      }
    }

    let start = 0;
    if (characters.length > 1) {
      start = 26;
    }

    const code = characters[0].toUpperCase().charCodeAt(0);
    const x = code - 64 + start - 1;

    return { x, y };
  }

  levels() {
    let level = 0;
    const depth = this.options.depth;
    return {
      [Symbol.iterator]() {
        return {
          next () {
            if (level < depth) {
              return { value: level++, done: false };
            } else {
              return { done: true };
            }
          },
        };
      },
    };
  }

  cells(level) {
    let x = 0;
    let y = 0;
    const cells = this._cells;
    return {
      [Symbol.iterator]() {
        return {
          next: () => {
            if (x < cells.length || (y && y < cells[x].length)) {
              const value = { value: cells[x][y].get(level), done: false };
              if (y < cells[x].length - 1) y++;
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
      },
    };
  }

  *[Symbol.iterator]() {
    for (const level of this.levels()) {
        for (const cell of this.cells(level)) {
            if (cell) {
                yield cell;
            }
        }
    }
  }
}

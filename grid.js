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

    const bbox = this.bbox(overlay.tl, overlay.br);
    const atl = this.actualTopLeft(bbox);
    const abr = this.actualBottomRight(bbox);
    const rotation = this.rotation(bbox);
    const { width, height } = this.dimensions(bbox);

    overlay.width = width * this.options.gridsize;
    overlay.height = height * this.options.gridsize;

    const tlpx = this.tlpx(atl);
    const brpx = this.brpx(abr);

    const data = {
      x1: tlpx.x,
      y1: tlpx.y,
      x2: brpx.x,
      y2: brpx.y,
      rotation,
      overlay,
    };

    let insertLevel = 0;
    // determine if anything exists in any of the cells already
    for (const level of this.levels()) {
      let found = false;
      for (const cell of this.cells(level)) {
        if (!cell) continue;
        if (this.overlaps(data, cell) || this.same(data, cell)) {
          found = true;
        }
      }
      if (found) insertLevel = level + 1;
    }

    const { x, y } = this.convertCellNameToXY(overlay.tl);
    const z = this._cells[x][y];
    z.set(insertLevel, data);
  }

  overlaps(a, b) {
    // no horizontal overlap
    if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;

    // no vertical overlap
    if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;

    return true;
  }

  same(a, b) {
    if (a.x1 === b.x1 && a.y1 === b.y1 && a.x2 === b.x2 && a.y2 === b.y2)
      return true;
    return false;
  }

  tlpx({ x, y } = {}) {
    const { gridsize, padding } = this.options;
    return {
      x: x * gridsize + padding,
      y: y * gridsize + padding,
    };
  }

  brpx({ x, y } = {}) {
    const { gridsize, padding } = this.options;
    return {
      x: x * gridsize + padding + gridsize,
      y: y * gridsize + padding + gridsize,
    };
  }

  bbox(tlcell, brcell) {
    const tl = this.convertCellNameToXY(tlcell);
    const br = this.convertCellNameToXY(brcell || tlcell);

    const a = 90;

    const tr = {
      x: br.y,
      y: tl.x,
    };

    const bl = {
      x: tl.y,
      y: br.x,
    };

    return [tl, tr, br, bl];
  }

  actualTopLeft(bbox) {
    return bbox.sort((a, b) => {
      if (a.x < b.x) return -1;
      if (a.x > b.x) return 1;
      if (a.y < b.y) return -1;
      if (a.y > b.y) return 1;
    })[0];
  }

  actualBottomRight(bbox) {
    return bbox.sort((a, b) => {
      if (a.x > b.x) return -1;
      if (a.x < b.x) return 1;
      if (a.y > b.y) return -1;
      if (a.y < b.y) return 1;
    })[0];
  }

  rotation(bbox) {
    const atl = this.actualTopLeft(bbox);
    const [_, tr, br, bl] = bbox;
    if (atl.x === tr.x && atl.y === tr.y) {
      return 90;
    }
    if (atl.x === br.x && atl.y === br.y) {
      return 180;
    }
    if (atl.x === bl.x && atl.y === bl.y) {
      return 270;
    }
    return 0;
  }

  dimensions(bbox) {
    let width;
    let height;
    if (bbox[0].x === bbox[1].x) {
      if (bbox[0].y > bbox[1].y) {
        width = bbox[0].y - bbox[1].y;
      } else {
        width = bbox[1].y - bbox[0].y;
      }

      if (bbox[0].x > bbox[3].x) {
        height = bbox[0].x - bbox[3].x;
      } else {
        height = bbox[3].x - bbox[0].x;
      }
    } else {
      if (bbox[0].x > bbox[1].x) {
        width = bbox[0].x - bbox[1].x;
      } else {
        width = bbox[1].x - bbox[0].x;
      }

      if (bbox[0].y > bbox[3].y) {
        height = bbox[0].y - bbox[3].y;
      } else {
        height = bbox[3].y - bbox[0].y;
      }
    }
    return { width, height };
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
          next() {
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

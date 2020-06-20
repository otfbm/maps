import tap from "tap";
import Grid from "../grid.js";
import Options from "../options.js";
import Overlay from "../overlay.js";

const { test } = tap;

test("grid created", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  t.equal(grid._cells.length, 10);
  t.equal(grid._cells[0].length, 10);
  t.equal(grid._cells[0][0].size, 0);
  t.end();
});

test("grid iterable", (t) => {
  const options = new Options({ height: 3, width: 2 });
  const grid = new Grid(options);

  grid.add(new Overlay({ cell: "A1" }));
  grid.add(new Overlay({ cell: "A2" }));

  const values = [];
  for (const cell of grid) {
    values.push(cell);
    t.same(null);
  }

  t.equal(values.length, 2);
  t.end();
});

test("grid convertCellNameToXY", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const coords1 = grid.convertCellNameToXY("C4");
  const coords2 = grid.convertCellNameToXY("AA4");
  const coords3 = grid.convertCellNameToXY("C44");
  const coords4 = grid.convertCellNameToXY("AA44");
  const coords5 = grid.convertCellNameToXY("aa6");
  const coords6 = grid.convertCellNameToXY("a5");

  t.same(coords1, { x: 2, y: 3 });
  t.same(coords2, { x: 26, y: 3 });
  t.same(coords3, { x: 2, y: 43 });
  t.same(coords4, { x: 26, y: 43 });
  t.same(coords5, { x: 26, y: 5 });
  t.same(coords6, { x: 0, y: 4 });
  t.end();
});

test("grid overlay added 1", (t) => {
  const options = new Options();
  const grid = new Grid(options);
  const overlay = new Overlay({ cell: "C4" });

  grid.add(overlay);

  t.equal(grid._cells[2][3].size, 1);
  t.end();
});

test("grid overlay added 2", (t) => {
  const options = new Options({ padding: 0 });
  const grid = new Grid(options);

  grid.add(new Overlay({ cell: "A1" }));
  grid.add(new Overlay({ cell: "G8" }));

  const a1 = grid._cells[0][0].get(0);
  const g8 = grid._cells[6][7].get(0);

  t.equal(a1.overlay.width, 40);
  t.equal(a1.overlay.height, 40);
  t.equal(a1.x1, 0);
  t.equal(a1.y1, 0);
  t.equal(a1.x2, 40);
  t.equal(a1.y2, 40);

  t.equal(g8.overlay.width, 40);
  t.equal(g8.overlay.height, 40);
  t.equal(g8.x1, 240);
  t.equal(g8.y1, 280);
  t.equal(g8.x2, 280);
  t.equal(g8.y2, 320);

  t.end();
});

test("grid 2 overlays added to same location", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  grid.add(new Overlay({ cell: "C4" }));
  grid.add(new Overlay({ cell: "C4" }));

  t.equal(grid._cells[2][3].size, 2);
  t.end();
});

test("grid 2 overlays added with overlapping locations", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  grid.add(new Overlay({ cell: "A1" }));
  t.equal(grid._cells[0][0].size, 1);
  t.equal(grid._cells[0][0].has(0), true);
  
  grid.add(new Overlay({ cell: "A2" }));
  t.equal(grid._cells[0][1].size, 1);
  t.equal(grid._cells[0][1].has(0), true);

  grid.add(new Overlay({ cells: ["A1", "B2"] }));
  t.equal(grid._cells[0][0].size, 2);
  t.equal(grid._cells[0][0].has(1), true);
  t.equal(grid._cells[1][1].has(1), false);
  
  grid.add(new Overlay({ cells: ["B2", "C3"] }));
  t.equal(grid._cells[1][1].size, 1);
  t.equal(grid._cells[1][1].has(2), true);
  t.equal(grid._cells[2][2].has(2), false);
  
  t.end();
});

test("grid level iterator", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  grid.add(new Overlay({ cell: "b2" }));
  grid.add(new Overlay({ cell: "b2" }));
  grid.add(new Overlay({ cells: ["a1", "b2"] }));

  const levels = [];
  for (const level of grid.levels()) {
    levels.push(level);
  }

  t.equal(levels.length, 5);
  t.end();
});

test("grid cells iterator", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  grid.add(new Overlay({ cell: "b2" }));
  grid.add(new Overlay({ cell: "b2" }));
  grid.add(new Overlay({ cells: ["a1", "b2"] }));

  const cells1 = [];
  for (const cell of grid.cells(0)) {
    if (cell) cells1.push(cell);
  }

  const cells2 = [];
  for (const cell of grid.cells(1)) {
    if (cell) cells2.push(cell);
  }

  const cells3 = [];
  for (const cell of grid.cells(2)) {
    if (cell) cells3.push(cell);
  }

  t.equal(cells1.length, 1);
  t.equal(cells2.length, 1);
  t.equal(cells3.length, 1);
  t.end();
});

test("grid iterator", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  grid.add(new Overlay({ cell: "b2" }));
  grid.add(new Overlay({ cell: "b2" }));
  grid.add(new Overlay({ cells: ["a1", "b2"] }));

  const cells = [];
  for (const cell of grid) {
    if (cell) cells.push(cell);
  }

  t.equal(cells.length, 3);
  t.end();
});

test("bbox 1", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.bbox("A1", "C3");

  t.same(result[0], { x: 0, y: 0 });
  t.same(result[1], { x: 2, y: 0 });
  t.same(result[2], { x: 2, y: 2 });
  t.same(result[3], { x: 0, y: 2 });
  t.end();
});

test("bbox 2", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.bbox("A3", "C1");

  t.same(result[0], { x: 0, y: 2 });
  t.same(result[1], { x: 2, y: 2 });
  t.same(result[2], { x: 2, y: 0 });
  t.same(result[3], { x: 0, y: 0 });
  t.end();
});

test("bbox 3", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.bbox("c3", "a1");

  t.same(result[0], { x: 2, y: 2 });
  t.same(result[1], { x: 0, y: 2 });
  t.same(result[2], { x: 0, y: 0 });
  t.same(result[3], { x: 2, y: 0 });
  t.end();
});

test("actual top left", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.actualTopLeft([
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 3 },
    { x: 0, y: 3 },
  ]);

  t.same(result, { x: 0, y: 0 });
  t.end();
});

test("actual top left", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.actualTopLeft([
    { x: 3, y: 3 },
    { x: 0, y: 3 },
    { x: 0, y: 0 },
    { x: 3, y: 0 },
  ]);

  t.same(result, { x: 0, y: 0 });
  t.end();
});

test("actual top right", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.actualTopRight([
    { x: 3, y: 3 },
    { x: 0, y: 3 },
    { x: 0, y: 0 },
    { x: 3, y: 0 },
  ]);

  t.same(result, { x: 3, y: 0 });
  t.end();
});

test("actual bottom right", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.actualBottomRight([
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 3 },
    { x: 0, y: 3 },
  ]);

  t.same(result, { x: 3, y: 3 });
  t.end();
});

test("actual bottom right", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.actualBottomRight([
    { x: 3, y: 3 },
    { x: 0, y: 3 },
    { x: 0, y: 0 },
    { x: 3, y: 0 },
  ]);

  t.same(result, { x: 3, y: 3 });
  t.end();
});

test("actual bottom left", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.actualBottomLeft([
    { x: 3, y: 3 },
    { x: 0, y: 3 },
    { x: 0, y: 0 },
    { x: 3, y: 0 },
  ]);

  t.same(result, { x: 0, y: 3 });
  t.end();
});

test("dimensions 1", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.dimensions(0, [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 3 },
    { x: 0, y: 3 },
  ]);

  t.same(result, { width: 4, height: 4 });
  t.end();
});

test("dimensions 2", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.dimensions(0, [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 2 },
    { x: 0, y: 2 },
  ]);

  t.same(result, { width: 4, height: 3 });
  t.end();
});

test("dimensions 3", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.dimensions(90, [
    { x: 1, y: 2 },
    { x: 3, y: 2 },
    { x: 3, y: 7 },
    { x: 1, y: 7 },
  ]);

  t.same(result, { width: 6, height: 3 });
  t.end();
});

test("dimensions 4", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.dimensions(0, [
    { x: 3, y: 3 },
    { x: 3, y: 3 },
    { x: 3, y: 3 },
    { x: 3, y: 3 },
  ]);

  t.same(result, { width: 1, height: 1 });
  t.end();
});

test("overlaps 1", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.overlaps(
    { x1: 0, y1: 0, x2: 3, y2: 3 },
    { x1: 4, y1: 4, x2: 6, y2: 6 }
  );

  t.equal(result, false);
  t.end();
});

test("overlaps 2", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.overlaps(
      { x1: 0, y1: 0, x2: 3, y2: 3 },
      { x1: 2, y1: 2, x2: 4, y2: 4 },
  );

  t.equal(result, true);
  t.end();
});

test("overlaps 3", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.overlaps(
    { x1: 1, y1: 1, x2: 2, y2: 2 },
    { x1: 2, y1: 2, x2: 3, y2: 3 }
  );

  t.equal(result, false);
  t.end();
});

test("overlaps 3", (t) => {
  const options = new Options();
  const grid = new Grid(options);

  const result = grid.overlaps(
    { x1: 1, y1: 1, x2: 2, y2: 2 },
    { x1: 0, y1: 0, x2: 4, y2: 4 }
  );

  t.equal(result, true);
  t.end();
});

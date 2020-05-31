import tap from 'tap';
import Grid from '../grid.js';
import Options from '../options.js';
import Overlay from '../overlay.js';

const { test } = tap;

test('grid created', (t) => {
    const options = new Options();
    const grid = new Grid(options);
    
    t.equal(grid._cells.length, 10);
    t.equal(grid._cells[0].length, 10);
    t.equal(grid._cells[0][0].size, 0);
    t.end();
});

test('grid iterable', (t) => {
    const options = new Options({ height: 3, width: 2 });
    const grid = new Grid(options);

    grid.add(new Overlay({ cell: 'A1' }));
    grid.add(new Overlay({ cell: 'A2' }));

    const values = [];
    for (const cell of grid) {
        values.push(cell);
        t.same(null);
    }

    t.equal(values.length, 2);
    t.end();
});

test('grid convertCellNameToXY', (t) => {
    const options = new Options();
    const grid = new Grid(options);

    const coords1 = grid.convertCellNameToXY('C4');
    const coords2 = grid.convertCellNameToXY('AA4');
    const coords3 = grid.convertCellNameToXY('C44');
    const coords4 = grid.convertCellNameToXY('AA44');
    const coords5 = grid.convertCellNameToXY('aa6');
    const coords6 = grid.convertCellNameToXY('a5');

    t.same(coords1, { x: 2, y: 3 });
    t.same(coords2, { x: 26, y: 3 });
    t.same(coords3, { x: 2, y: 43 });
    t.same(coords4, { x: 26, y: 43 });
    t.same(coords5, { x: 26, y: 5 });
    t.same(coords6, { x: 0, y: 4 });
    t.end();
});

test('grid overlay added', (t) => {
    const options = new Options();
    const grid = new Grid(options);
    const overlay = new Overlay({ cell: 'C4' });

    grid.add(overlay);

    t.equal(grid._cells[2][3].size, 1);
    t.end();
});

test('grid 2 overlays added to same location', (t) => {
    const options = new Options();
    const grid = new Grid(options);

    grid.add(new Overlay({ cell: 'C4' }));
    grid.add(new Overlay({ cell: 'C4' }));

    t.equal(grid._cells[2][3].size, 2);
    t.end();
});

test('grid 2 overlays added with overlapping locations', (t) => {
    const options = new Options();
    const grid = new Grid(options);

    grid.add(new Overlay({ cell: 'a2' }));
    grid.add(new Overlay({ cell: 'a1' }));
    grid.add(new Overlay({ cells: ['a1', 'b2'] }));

    t.equal(grid._cells[0][0].size, 2);
    t.equal(grid._cells[0][1].size, 1);
    t.equal(grid._cells[1][1].size, 1);
    t.equal(grid._cells[1][0].has(0), false);
    t.equal(grid._cells[1][0].has(1), false);
    t.equal(grid._cells[0][0].has(0), true);
    t.equal(grid._cells[0][0].has(1), true);
    t.equal(grid._cells[0][1].has(0), true);
    t.equal(grid._cells[0][1].has(1), false);
    t.end();
});

test('grid level iterator', (t) => {
    const options = new Options();
    const grid = new Grid(options);

    grid.add(new Overlay({ cell: 'b2' }));
    grid.add(new Overlay({ cell: 'b2' }));
    grid.add(new Overlay({ cells: ['a1', 'b2'] }));

    const levels = [];
    for (const level of grid.levels()) {
        levels.push(level);
    }
    
    t.equal(levels.length, 5);
    t.end();
});

test('grid cells iterator', (t) => {
    const options = new Options();
    const grid = new Grid(options);

    grid.add(new Overlay({ cell: 'b2' }));
    grid.add(new Overlay({ cell: 'b2' }));
    grid.add(new Overlay({ cells: ['a1', 'b2'] }));

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
    t.equal(cells3.length, 2);
    t.end();
});

test('grid iterator', (t) => {
    const options = new Options();
    const grid = new Grid(options);

    grid.add(new Overlay({ cell: 'b2' }));
    grid.add(new Overlay({ cell: 'b2' }));
    grid.add(new Overlay({ cells: ['a1', 'b2'] }));

    const cells = [];
    for (const cell of grid) {
        if (cell) cells.push(cell);
    }
    
    t.equal(cells.length, 4);
    t.end();
});

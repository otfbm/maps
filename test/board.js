import tap from 'tap';
import Board from '../board.js';

const { test } = tap;

test('board created', (t) => {
    const board = new Board({ width: 10, height: 8 });
    t.equal(board.state.length, 10);
    t.equal(board.state[0].length, 8);
    t.end();
});

test('board iterable', (t) => {
    const board = new Board({ width: 10, height: 8 });

    const values = [];
    for (const { item } of board) {
        values.push(item);
        t.same(item, null);
    }

    t.equal(values.length, 80);
    t.end();
});

import tap from 'tap';
import Board from '../../board.js';
import Options from '../../options.js';

const { test } = tap;

test('board created', (t) => {
    const options = new Options();
    const board = new Board({options});
    t.equal(board.state.length, 10);
    t.equal(board.state[0].length, 10);
    t.end();
});

test('board iterable', (t) => {
    const options = new Options();
    const board = new Board({options});
    //const board = new Board({ width: 10, height: 8 });

    const values = [];
    for (const { item } of board) {
        values.push(item);
        t.same(item, null);
    }

    t.equal(values.length, 100);
    t.end();
});

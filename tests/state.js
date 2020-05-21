import tap from 'tap';
import State from '../state.js';

const { test } = tap;

test('state created', (t) => {
    const state = new State(10, 8);
    t.equal(state.state.length, 10);
    t.equal(state.state[0].length, 8);
    t.end();
});

test('state iterable', (t) => {
    const state = new State(10, 8);

    const values = [];
    for (const item of state) {
        values.push(item);
        t.equal(item, null);
    }

    t.equal(values.length, 80);
    t.end();
});

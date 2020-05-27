import tap from 'tap';
import BoardParser from '../../parsers/board.js';

const { test } = tap;

test('parsing 1', (t) => {
    const parser = new BoardParser();
    const result = parser.parse('/');
    
    t.equal(result, false);
    t.end();
});

test('parsing 2', (t) => {
    const parser = new BoardParser();
    const result = parser.parse('');
    
    t.equal(result, false);
    t.end();
});

test('parsing 3', (t) => {
    const parser = new BoardParser();
    const result = parser.parse('3x3');
    
    t.equal(result.width, 3);
    t.equal(result.height, 3);
    t.end();
});

test('parsing 4', (t) => {
    const parser = new BoardParser();
    const result = parser.parse('37x42');
    
    t.equal(result.width, 37);
    t.equal(result.height, 42);
    t.end();
});

test('parsing 5', (t) => {
    const parser = new BoardParser();
    const result = parser.parse('37x');
    
    t.equal(result, false);
    t.end();
});

test('parsing 6', (t) => {
    const parser = new BoardParser();
    const result = parser.parse('x34');
    
    t.equal(result, false);
    t.end();
});

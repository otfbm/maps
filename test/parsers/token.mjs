import tap from 'tap';
import TokenParser from '../../parsers/token.js';

const { test } = tap;

test('parsing: position 1', (t) => {
    const parser = new TokenParser();
    const { x, y, color, size, name } = parser.parse('/D3');
    
    t.equal(x, 4);
    t.equal(y, 3);
    t.same(color, 'black');
    t.same(size, 'medium');
    t.equal(name, '');
    t.end();
});

test('parsing: position 2', (t) => {
    const parser = new TokenParser();
    const { x, y, color, size, name } = parser.parse('D3');
    
    t.equal(x, 4);
    t.equal(y, 3);
    t.same(color, 'black');
    t.same(size, 'medium');
    t.equal(name, '');
    t.end();
});

test('parsing: position 3', (t) => {
    const parser = new TokenParser();
    const { x, y, color, size, name } = parser.parse('D12');
    
    t.equal(x, 4);
    t.equal(y, 12);
    t.same(color, 'black');
    t.same(size, 'medium');
    t.equal(name, '');
    t.end();
});

test('parsing: position and 1 flag', (t) => {
    const parser = new TokenParser();
    const { x, y, color, size, name } = parser.parse('/D3r');
    
    t.equal(x, 4);
    t.equal(y, 3);
    t.same(color, 'firebrick');
    t.same(size, 'medium');
    t.equal(name, '');
    t.end();
});

test('parsing: position and 2 flags', (t) => {
    const parser = new TokenParser();
    const { x, y, color, size, name } = parser.parse('/D3rL');
    
    t.equal(x, 4);
    t.equal(y, 3);
    t.same(color, 'firebrick');
    t.same(size, 'large');
    t.equal(name, '');
    t.end();
});

test('parsing: position and name', (t) => {
    const parser = new TokenParser();
    const { x, y, color, size, name } = parser.parse('/D3-name');
    
    t.equal(x, 4);
    t.equal(y, 3);
    t.same(color, 'black');
    t.same(size, 'medium');
    t.equal(name, 'name');
    t.end();
});

test('parsing: position, 1 flag and name', (t) => {
    const parser = new TokenParser();
    const { x, y, color, size, name } = parser.parse('/D3r-name');
    
    t.equal(x, 4);
    t.equal(y, 3);
    t.same(color, 'firebrick');
    t.same(size, 'medium');
    t.equal(name, 'name');
    t.end();
});

test('parsing: position, 2 flags and name', (t) => {
    const parser = new TokenParser();
    const { x, y, color, size, name } = parser.parse('/D3rL-name');
    
    t.equal(x, 4);
    t.equal(y, 3);
    t.same(color, 'firebrick');
    t.same(size, 'large');
    t.equal(name, 'name');
    t.end();
});
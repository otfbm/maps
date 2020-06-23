import tap from 'tap';
import TokenParser from '../../parsers/token.js';

const { test } = tap;

test('parsing: position 1', (t) => {
    const parser = new TokenParser();
    const { color, size, label } = parser.parse('/D3');
    
    t.same(color, 'black');
    t.same(size, 'medium');
    t.equal(label, '');
    t.end();
});

test('parsing: position 2', (t) => {
    const parser = new TokenParser();
    const { color, size, label } = parser.parse('D3');
    
    t.same(color, 'black');
    t.same(size, 'medium');
    t.equal(label, '');
    t.end();
});

test('parsing: position 3', (t) => {
    const parser = new TokenParser();
    const { color, size, label } = parser.parse('D12');
    
    t.same(color, 'black');
    t.same(size, 'medium');
    t.equal(label, '');
    t.end();
});

test('parsing: position and 1 flag', (t) => {
    const parser = new TokenParser();
    const { color, size, label } = parser.parse('/D3r');
    
    t.same(color, 'firebrick');
    t.same(size, 'medium');
    t.equal(label, '');
    t.end();
});

test('parsing: position and 2 flags', (t) => {
    const parser = new TokenParser();
    const { color, size, label } = parser.parse('/D3Lr');
    
    t.same(color, 'firebrick');
    t.same(size, 'large');
    t.equal(label, '');
    t.end();
});

test('parsing: position and name', (t) => {
    const parser = new TokenParser();
    const { color, size, label } = parser.parse('/D3-name');
    
    t.same(color, 'black');
    t.same(size, 'medium');
    t.equal(label, 'name');
    t.end();
});

test('parsing: position, 1 flag and name', (t) => {
    const parser = new TokenParser();
    const { color, size, label } = parser.parse('/D3r-name');
    
    t.same(color, 'firebrick');
    t.same(size, 'medium');
    t.equal(label, 'name');
    t.end();
});

test('parsing: position, 2 flags and name', (t) => {
    const parser = new TokenParser();
    const { color, size, label } = parser.parse('/D3Lr-name');
    
    t.same(color, 'firebrick');
    t.same(size, 'large');
    t.equal(label, 'name');
    t.end();
});

test('parsing: position, size, hex colour and name', (t) => {
    const parser = new TokenParser();
    const { color, size, label } = parser.parse('/D3L~ff5500-name');
    
    t.same(color, '#FF5500');
    t.same(size, 'large');
    t.equal(label, 'name');
    t.end();
});

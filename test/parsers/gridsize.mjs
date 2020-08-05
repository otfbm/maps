import tap from 'tap';
import GridsizeParser from '../../parsers/gridsize.js';

const { test } = tap;

test('parsing 1', (t) => {
    const parser = new GridsizeParser();
    const result = parser.parse('/');
    
    t.equal(result, false);
    t.end();
});

test('parsing 2', (t) => {
    const parser = new GridsizeParser();
    const result = parser.parse('/*');
    
    t.equal(result, false);
    t.end();
});

test('parsing 3', (t) => {
    const parser = new GridsizeParser();
    const result = parser.parse('/*40');
    
    t.same(result, { size: 40 });
    t.end();
});

test('parsing 4', (t) => {
    const parser = new GridsizeParser();
    const result = parser.parse('/*40:0:0');
    
    t.same(result, { size: 40, x: 0, y: 0 });
    t.end();
});

test('parsing 5', (t) => {
    const parser = new GridsizeParser();
    const result = parser.parse('/*40:1');
    
    t.same(result, { size: 40, x: 1 });
    t.end();
});

test('parsing 6', (t) => {
    const parser = new GridsizeParser();
    const result = parser.parse('/*40:1:1');
    
    t.same(result, { size: 40, x: 1, y: 1 });
    t.end();
});

test('parsing 7', (t) => {
    const parser = new GridsizeParser();
    const result = parser.parse('/*40:15:20');
    
    t.same(result, { size: 40, x: 15, y: 20 });
    t.end();
});

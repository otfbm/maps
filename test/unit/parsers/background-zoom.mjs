import tap from 'tap';
import ZoomParser from '../../../parsers/background-zoom.js';

const { test } = tap;

test('parsing 1', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'/'});
    
    t.equal(result, false);
    t.end();
});

test('parsing 2', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'/asd/'});
    
    t.equal(result, false);
    t.end();
});

test('parsing 3', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'/@'});
    
    t.equal(result, false);
    t.end();
});

test('parsing 4', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'/@z1'});
    
    t.equal(result, 1);
    t.end();
});

test('parsing 5', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'/@z3'});
    
    t.equal(result, 3);
    t.end();
});

test('parsing 6', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'/@z4.321'});
    
    t.equal(result, 4.321);
    t.end();
});

test('parsing 7', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'@z0.0'});
    
    t.equal(result, 0);
    t.end();
});

test('parsing 8', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'@z.52'});
    
    t.equal(result, 0.52);
    t.end();
});

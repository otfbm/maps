import tap from 'tap';
import ZoomParser from '../../../parsers/zoom.js';

const { test } = tap;

test('parsing 1', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:''});
    
    t.equal(result, false);
    t.end();
});

test('parsing 2', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'asd'});
    
    t.equal(result, false);
    t.end();
});

test('parsing 3', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'@'});
    
    t.equal(result, false);
    t.end();
});

test('parsing 4', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'@1'});
    
    t.equal(result, 1);
    t.end();
});

test('parsing 5', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'/@3'});
    
    t.equal(result, 3);
    t.end();
});

test('parsing 6', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'@4.321'});
    
    t.equal(result, 3);
    t.end();
});

test('parsing 7', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'@0.0'});
    
    t.equal(result, 0);
    t.end();
});

test('parsing 8', (t) => {
    const parser = new ZoomParser();
    const result = parser.parse({str:'@.52'});
    
    t.equal(result, 0.52);
    t.end();
});

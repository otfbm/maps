import tap from 'tap';
import BackgroundOffsetParser from '../../../parsers/background-offset.js';

const { test } = tap;

test('parsing 1', (t) => {
    const parser = new BackgroundOffsetParser();
    const result = parser.parse({str:'/@o13:12'});
    
    t.same(result, { x: 13, y: 12 });
    t.end();
});

test('parsing 2', (t) => {
    const parser = new BackgroundOffsetParser();
    const result = parser.parse({str:'/@dnc40o13:12'});
    
    t.same(result, { x: 13, y: 12 });
    t.end();
});

test('parsing 3', (t) => {
    const parser = new BackgroundOffsetParser();
    const result = parser.parse({str:'/@dno13:12c40'});
    
    t.same(result, { x: 13, y: 12 });
    t.end();
});

test('parsing 4', (t) => {
    const parser = new BackgroundOffsetParser();
    const result = parser.parse({str:'/@o0:0'});
    
    t.same(result, { x: 0, y: 0 });
    t.end();
});


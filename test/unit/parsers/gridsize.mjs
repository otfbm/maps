import tap from 'tap';
import GridsizeParser from '../../../parsers/gridsize.js';

const { test } = tap;

test('parsing 1', (t) => {
    const parser = new GridsizeParser();
    const result = parser.parse('/@c40');
    
    t.same(result, { size: 40 });
    t.end();
});

test('parsing 2', (t) => {
    const parser = new GridsizeParser();
    const result = parser.parse('/@dnc40');
    
    t.same(result, { size: 40 });
    t.end();
});

test('parsing 3', (t) => {
    const parser = new GridsizeParser();
    const result = parser.parse('/@dnc40o13:12');
    
    t.same(result, { size: 40 });
    t.end();
});

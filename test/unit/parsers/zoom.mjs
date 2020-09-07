import tap from 'tap';
import Options from '../../../options.js';

const { test } = tap;

test('parsing 1', (t) => {
    const options = new Options();
    const result = options.parseOptions('');
    
    t.equal(result, false);
    t.end();
});

test('parsing 2', (t) => {
    const options = new Options();
    const result = options.parseOptions('asd');
    
    t.equal(result, false);
    t.end();
});

test('parsing 3', (t) => {
    const options = new Options();
    const result = options.parseOptions('@');
    
    t.equal(result, false);
    t.end();
});

test('parsing 4', (t) => {
    const options = new Options();
    const result = options.parseOptions('@1');
    
    t.equal(result, true);
    t.equal(options.zoom, 1)
    t.end();
});

test('parsing 6', (t) => {
    const options = new Options();
    const result = options.parseOptions('@4.321');
    
    t.equal(result, true);
    t.equal(options.zoom, 3)
    t.end();
});

test('parsing 7', (t) => {
    const options = new Options();
    const result = options.parseOptions('@0.0');
    
    t.equal(result, true);
    t.equal(options.zoom, 0)

    t.end();
});

test('parsing 8', (t) => {
    const options = new Options();
    const result = options.parseOptions('@.52');
    
    t.equal(result, true);
    t.equal(options.zoom, 0.52)
    t.end();
});

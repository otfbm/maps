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
    //t.equal(options.background.zoom, 1);
    t.end();
});

test('parsing 4', (t) => {
    const options = new Options();
    const result = options.parseOptions('@b1');
    
    t.equal(result, true);
    t.equal(options.background.zoom, 1);
    t.end();
});

test('parsing 5', (t) => {
    const options = new Options();
    const result = options.parseOptions('@b3');
    
    t.equal(result, true);
    t.equal(options.background.zoom, 3);
    t.end();
});

test('parsing 6', (t) => {
    const options = new Options();
    const result = options.parseOptions('@b4.321');

    t.equal(result, true);
    t.equal(options.background.zoom, 4.321);
    t.end();
});

test('parsing 7', (t) => {
    const options = new Options();
    const result = options.parseOptions('@b0.0');
    
    t.equal(result, true);
    t.equal(options.background.zoom, 0);
    t.end();
});

test('parsing 8', (t) => {
    const options = new Options();
    const result = options.parseOptions('@b.52');
    
    t.equal(result, true);
    t.equal(options.background.zoom, 0.52);
    t.end();
});

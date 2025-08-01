import tap from 'tap';
import Options from '../../../options.js';

const { test } = tap;

test('parsing 1', (t) => {
    const options = new Options();
    const result = options.parseOptions('@c45');
    
    t.same(result, true);
    t.same(options.cellSizePx, 45 );
    t.end();
});

test('parsing 2', (t) => {
    const options = new Options();
    const result = options.parseOptions('@dnc60');
    
    t.same(result, true);
    t.same(options.cellSizePx, 60 );
    t.end();
});

test('parsing 3', (t) => {
    const options = new Options();
    const result = options.parseOptions('@z2dnc60o13:12');

    t.same(result, true);
    t.same(options.cellSizePx, 120 );
    t.end();
});

test('supports single precision float', (t) => {
    const options = new Options();
    const result = options.parseOptions('@c60.1');

    t.same(result, true);
    t.same(options.cellSizePx, 60.1 );
    t.end();
});

test('ignores additional precision in float', (t) => {
    const options = new Options();
    const result = options.parseOptions('@c60.2345');

    t.same(result, true);
    t.same(options.cellSizePx, 60.2 );
    t.end();
});

test('supports sizes up to 200', (t) => {
    const options = new Options();
    const result = options.parseOptions('@c200');

    t.same(result, true);
    t.same(options.cellSizePx, 200 );
    t.end();
});

test('clips sizes over 200 to 200', (t) => {
    const options = new Options();
    const result = options.parseOptions('@c201');

    t.same(result, true);
    t.same(options.cellSizePx, 200 );
    t.end();
});

test('handles floats with other settings', (t) => {
    const options = new Options();
    const result = options.parseOptions('@z2dnc60.9o13:12');

    t.same(result, true);
    t.same(options.cellSizePx, 121.8 );
    t.same(options.zoom, 2 );
    t.same(options.darkMode, true );
    t.same(options.background.offsetX, 13 );
    t.same(options.background.offsetY, 12 );
    t.end();
});

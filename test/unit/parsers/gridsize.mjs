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

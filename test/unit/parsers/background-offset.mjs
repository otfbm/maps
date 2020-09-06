import tap from 'tap';
import Options from '../../../options.js';

const { test } = tap;

test('parsing 1', (t) => {
    const options = new Options();
    const result = options.parseOptions('@o13:12');
    
    t.same(result, true);
    t.same(options.background.offsetX, 13);
    t.same(options.background.offsetY, 12);
    t.end();
});

test('parsing 2', (t) => {
    const options = new Options();
    const result = options.parseOptions('@dnc40o13:12');
    
    t.same(result, true);
    t.same(options.background.offsetX, 13);
    t.same(options.background.offsetY, 12);
    t.end();
});

test('parsing 3', (t) => {
    const options = new Options();
    const result = options.parseOptions('@dno13:12c40');
    
    t.same(result, true);
    t.same(options.background.offsetX, 13);
    t.same(options.background.offsetY, 12);
    t.end();
});

test('parsing 4', (t) => {
    const options = new Options();
    const result = options.parseOptions('@o0:0');
    
    t.same(result, true);
    t.same(options.background.offsetX, 0);
    t.same(options.background.offsetY, 0);
    t.end();
});


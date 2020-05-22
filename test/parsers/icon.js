import tap from 'tap';
import IconParser from '../../parsers/icon.js';

const { test } = tap;

test('parsing: 1', (t) => {
    const parser = new IconParser();
    const { icon, x, y } = parser.parse('C3$D');
    
    t.equal(x, 3);
    t.equal(y, 3);
    t.same(icon, './icons/doorway.svg');
    t.end();
});

test('parsing: 2', (t) => {
    const parser = new IconParser();
    const { icon, x, y } = parser.parse('/E3$D');
    
    t.equal(x, 5);
    t.equal(y, 3);
    t.same(icon, './icons/doorway.svg');
    t.end();
});

test('parsing: 2', (t) => {
    const parser = new IconParser();
    const { icon, x, y } = parser.parse('/F3$D/');
    
    t.equal(x, 6);
    t.equal(y, 3);
    t.same(icon, './icons/doorway.svg');
    t.end();
});

test('parsing: 3', (t) => {
    const parser = new IconParser();
    const { icon, x, y } = parser.parse('/F13$D/');
    
    t.equal(x, 6);
    t.equal(y, 13);
    t.same(icon, './icons/doorway.svg');
    t.end();
});

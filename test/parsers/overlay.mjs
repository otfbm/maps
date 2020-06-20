import tap from 'tap';
import OverlayParser from '../../parsers/overlay.js';

const { test } = tap;

test('parsing: 1', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('C3$T');
    
    t.equal(overlay.tl, 'C3');
    t.equal(overlay.br, 'C3');
    t.same(overlay.type, 'trap');
    t.end();
});

test('parsing: 2', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('A1C3$T');
    
    t.equal(overlay.tl, 'A1');
    t.equal(overlay.br, 'C3');
    t.same(overlay.type, 'trap');
    t.end();
});


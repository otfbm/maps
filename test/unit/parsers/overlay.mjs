import tap from 'tap';
import OverlayParser from '../../../parsers/overlay.js';

const { test } = tap;

test('parsing: basic', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('C3$T');
    
    t.equal(overlay.tl, 'C3');
    t.equal(overlay.br, 'C3');
    t.same(overlay.type, 'trap');
    t.end();
});

test('parsing: top left and bottom right definition', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('A1C3$T');
    
    t.equal(overlay.tl, 'A1');
    t.equal(overlay.br, 'C3');
    t.same(overlay.type, 'trap');
    t.end();
});

test('parsing: - case insensitive', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('a1c3$T');
    
    t.equal(overlay.tl, 'a1');
    t.equal(overlay.br, 'c3');
    t.same(overlay.type, 'trap');
    t.end();
});

test('parsing: - multiletter', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('aa1$T');
    
    t.equal(overlay.tl, 'aa1');
    t.same(overlay.type, 'trap');
    t.end();
});

test('parsing: - multiletter over boundary', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('az1ba1$T');
    
    t.equal(overlay.tl, 'az1');
    t.equal(overlay.br, 'ba1');
    t.same(overlay.type, 'trap');
    t.end();
});


import tap from 'tap';
import OverlayParser from '../../../parsers/overlay.js';

const { test } = tap;

test('parsing: basic', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('C3$tr');
    
    t.equal(overlay.tl, 'C3');
    t.equal(overlay.br, 'C3');
    t.same(overlay.type, 'trap');
    t.end();
});

test('parsing: top left and bottom right definition', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('A1C3$tr');
    
    t.equal(overlay.tl, 'A1');
    t.equal(overlay.br, 'C3');
    t.same(overlay.type, 'trap');
    t.end();
});

test('parsing: - case insensitive', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('a1c3$tr');
    
    t.equal(overlay.tl, 'a1');
    t.equal(overlay.br, 'c3');
    t.same(overlay.type, 'trap');
    t.end();
});

test('parsing: - multiletter', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('aa1$tr');
    
    t.equal(overlay.tl, 'aa1');
    t.same(overlay.type, 'trap');
    t.end();
});

test('parsing: - multiletter over boundary', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('az1ba1$tr');
    
    t.equal(overlay.tl, 'az1');
    t.equal(overlay.br, 'ba1');
    t.same(overlay.type, 'trap');
    t.end();
});

test('parsing: - color parsing 1', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('az1ba1r$tr');
    
    t.equal(overlay.tl, 'az1');
    t.equal(overlay.br, 'ba1');
    t.same(overlay.type, 'trap');
    t.same(overlay.color, '#e63c3c');
    t.end();
});

test('parsing: - color parsing 2', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('az1ba1~070$tr');
    
    t.equal(overlay.tl, 'az1');
    t.equal(overlay.br, 'ba1');
    t.same(overlay.type, 'trap');
    t.same(overlay.color, '#007700');
    t.end();
});

test('parsing: - color parsing 3', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('az1ba1~07031a$tr');
    
    t.equal(overlay.tl, 'az1');
    t.equal(overlay.br, 'ba1');
    t.same(overlay.type, 'trap');
    t.same(overlay.color, '#07031A');
    t.end();
});

test('parsing: - color parsing 4', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('az1r$tr');
    
    t.equal(overlay.tl, 'az1');
    t.equal(overlay.br, 'az1');
    t.same(overlay.type, 'trap');
    t.same(overlay.color, '#e63c3c');
    t.end();
});

test('parsing: - color parsing 5', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('az1~070$tr');
    
    t.equal(overlay.tl, 'az1');
    t.equal(overlay.br, 'az1');
    t.same(overlay.type, 'trap');
    t.same(overlay.color, '#007700');
    t.end();
});

test('parsing: - color parsing 6', (t) => {
    const parser = new OverlayParser();
    const overlay = parser.parse('az1~07031a$tr');
    
    t.equal(overlay.tl, 'az1');
    t.equal(overlay.br, 'az1');
    t.same(overlay.type, 'trap');
    t.same(overlay.color, '#07031A');
    t.end();
});


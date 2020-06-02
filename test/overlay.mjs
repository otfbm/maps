import tap from "tap";
import Overlay from "../overlay.js";

const { test } = tap;

test("overlay 1", (t) => {
  const overlay = new Overlay({ cell: 'C4' });

  t.equal(overlay.tl, 'C4');
  t.equal(overlay.br, 'C4');
  t.end();
});

test("overlay 2", (t) => {
  const overlay = new Overlay({ cells: ['C4'] });

  t.equal(overlay.tl, 'C4');
  t.equal(overlay.br, 'C4');
  t.end();
});

test("overlay 3", (t) => {
  const overlay = new Overlay({ cells: ['A1', 'C3'] });

  t.equal(overlay.tl, 'A1');
  t.equal(overlay.br, 'C3');
  t.end();
});

test("overlay 4", (t) => {
  const overlay = new Overlay({ cells: ['A1', 'C3'] });
  overlay.width = 10;
  overlay.height = 15;
  t.equal(overlay.width, 10);
  t.equal(overlay.height, 15);
  t.end();
});

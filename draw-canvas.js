const { join } = require("path");
const fs = require("fs").promises;
const fetch = require("node-fetch");
const InputParser = require("./input-parser.js");
const Board = require("./board.js");
const Options = require("./options.js");
const Renderer = require("./renderer/index.js");
const Grid = require("./grid.js");

const base64Fetch = async (url) => {
  const res = await fetch(url);
  if (res.ok) {
    const buffer = await res.buffer();
    return `data:${res.headers.get("content-type")};base64,${buffer.toString(
      "base64"
    )}`;
  }
  const err = new Error(
    `We couldn't seem to get our claws on the token image you asked for`
  );
  err.status = res.status;
  throw err;
};

let fallbackTokenImage;
const fetchTokenImageAsBase64 = async (code) => {
  if (!code) return null;

  try {
    return await base64Fetch(`https://token.otfbm.io/face/${code}`);
  } catch (err) {
    // swallow error and try img instead of face
    if (err.status === 404) {
      try {
        return await base64Fetch(`https://token.otfbm.io/img/${code}`);
      } catch (err) {
        // noop
      }
    }
  }

  if (!fallbackTokenImage) {
    const buff = await fs.readFile(join(__dirname, "missing-token.jpg"));
    fallbackTokenImage = buff.toString("base64");
  }
  return `data:image/jpeg;base64,${fallbackTokenImage}`;
};

module.exports = async function main(pathname, query) {
  const options = new Options();  
  const input = new InputParser();
  await input.parse(options, pathname, query);

  const renderer = new Renderer(options);

  const board = new Board({
    ctx: renderer.ctx,
    options
  });

  // TODO: refactor to match the TODO below
  for (const { x, y, item } of input.icons) {
    board.placeItem(x, y, item);
  }
  board.addLines(input.lines);
  board.addEffects(input.effects);

  // TODO: recalculate icons by inspecting the data structure

  board.draw();

  // TODO: replace board implementation with these methods
  // renderer.drawAxis(grid);
  // renderer.drawGridLines(grid);
  // for (const wall of walls) {
  //   renderer.drawWall(wall);
  // }
  // for (const effect of effects) {
  //   renderer.drawEffect(effect);
  // }

  const grid = new Grid(options);

  for (const overlay of input.overlays) {
    grid.add(overlay);
  }

  const tokenImages = await Promise.all(
    input.tokens.map((tn) => fetchTokenImageAsBase64(tn.imageCode))
  );
  for (let i = 0; i < input.tokens.length; i++) {
    input.tokens[i].image = tokenImages[i];
  }
  for (const overlay of input.tokens) {
    grid.add(overlay);
  }

  for (const cell of grid) {
    renderer.renderOverlay(cell);
  }

  // overlays are drawn 2nd to last
  board.drawEffects();

  // border is drawn last so nothing overlaps it
  board.drawBorder();

  return renderer.canv;
};

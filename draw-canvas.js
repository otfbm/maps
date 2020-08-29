const {join} = require('path');
const fs = require('fs').promises;
const fetch = require('node-fetch');
const InputParser = require("./input-parser.js");
const Board = require("./board.js");
const Options = require("./options.js");
const Renderer = require("./renderer/index.js");
const Grid = require("./grid.js");

let fallbackTokenImage;
const fetchTokenImageAsBase64 = async (code) => {
  if (!code) return null;
  try {
    const url = `https://token.otfbm.io/img/${code}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Non 200 status code');
    const buffer = await res.buffer();
    return `data:${res.headers.get("content-type")};base64,${buffer.toString("base64")}`
  } catch(err) {
    console.log(err);
    if (!fallbackTokenImage) {
      const buff = await fs.readFile(join(__dirname, 'missing-token.jpg'));
      fallbackTokenImage = buff.toString('base64');
    }
    return `data:image/jpeg;base64,${fallbackTokenImage}`;
  }
}

module.exports = async function main(pathname, query) {
  const input = new InputParser()
  await input.parse(pathname, query);
  const gridsize = input.gridsize * input.zoom;
  const width = input.board.width * gridsize;
  const height = input.board.height * gridsize;
  
  const options = new Options({
    padding: gridsize,
    gridsize,
    zoom: input.zoom,
    width,
    height,
    panX: input.board.panX,
    panY: input.board.panY,
    backgroundOffsetX: input.backgroundOffsetX * input.zoom,
    backgroundOffsetY: input.backgroundOffsetY * input.zoom,
    backgroundZoom: input.backgroundZoom,
  });
  const zoom = input.zoom;

  const renderer = new Renderer(options);
  
  const board = new Board({
    ctx: renderer.ctx,
    width,
    height,
    gridsize,
    zoom,
    padding: gridsize,
    darkMode: input.darkMode,
    gridOpacity: input.gridOpacity,
    panX: input.board.panX,
    panY: input.board.panY,
    backgroundOffsetX: input.backgroundOffsetX * input.zoom,
    backgroundOffsetY: input.backgroundOffsetY * input.zoom,
    backgroundZoom: input.backgroundZoom,
    edgeOpacity: input.edgeOpacity,
  });

  // TODO: refactor to match the TODO below
  board.addBackground(input.background);
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
    input.tokens.map(tn => fetchTokenImageAsBase64(tn.imageCode))
  );
  for (let i=0; i<input.tokens.length; i++) {
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
}

import canvas from "canvas";
import InputParser from "./input-parser.js";
import Board from "./board.js";
import Options from "./options.js";
import Renderer from './renderer/index.js';

const GRID_SIZE = 40;
const PADDING = 15;

const { createCanvas, loadImage } = canvas;

export default function main(pathname, backgroundImage) {
  const input = new InputParser(pathname);
  const gridsize = GRID_SIZE * input.zoom;
  const width = (input.board.width >= 52 ? 52 : input.board.width) * gridsize;
  const height =
    (input.board.height >= 52 ? 52 : input.board.height) * gridsize;
  const options = new Options({
    padding: PADDING,
    gridsize,
    zoom: input.zoom,
    width,
    height,
  });
  const zoom = input.zoom;

  const renderer = new Renderer(options);

  const board = new Board({
    ctx: renderer.ctx,
    width,
    height,
    gridsize,
    zoom,
    padding: PADDING,
    darkMode: input.darkMode,
    gridOpacity: input.gridOpacity,
  });

  board.addBackground(backgroundImage || input.background);


  for (const { x, y, item } of input.icons) {
    board.placeItem(x, y, item);
  }

  board.addLines(input.lines);
  board.addEffects(input.effects);

  // TODO: recalculate icons by inspecting the data structure

  board.draw();

  for (const { x, y, item } of input.tokens) {
    renderer.render({ x, y, item });
    // board.placeItem(x, y, item);
  }

  return renderer.canv;
}

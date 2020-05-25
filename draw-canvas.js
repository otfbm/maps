import canvas from "canvas";
import InputParser from "./input-parser.js";
import Board from "./board.js";

const GRID_SIZE = 40;
const PADDING = 15;

const { createCanvas, loadImage } = canvas;

export default function main(pathname, backgroundImage) {
  const input = new InputParser(pathname);
  const gridsize = GRID_SIZE * input.zoom;
  const width = (input.board.width >=52 ? 52 : input.board.width) * gridsize;
  const height = (input.board.height >=52 ? 52 : input.board.height) * gridsize;
  const canv = createCanvas(width + 2 * PADDING, height + 2 * PADDING);
  const ctx = canv.getContext("2d");
  const zoom = input.zoom;

  const board = new Board({
    ctx,
    width,
    height,
    gridsize,
    zoom,
    padding: PADDING,
    darkMode: input.options.darkMode,
    gridOpacity: input.options.gridOpacity
  });

  board.addBackground(backgroundImage || input.background);

  for (const { x, y, item } of input.tokens) {
    board.placeItem(x, y, item);
  }

  for (const { x, y, item } of input.icons) {
    board.placeItem(x, y, item);
  }

  board.addLines(input.lines);

  // TODO: recalculate icons by inspecting the data structure

  board.draw();

  return canv;
}

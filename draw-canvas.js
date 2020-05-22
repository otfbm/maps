import canvas from "canvas";
import InputParser from "./input-parser.js";
import Board from "./board.js";

const GRID_SIZE = 40;
const PADDING = 15;

const { createCanvas, loadImage } = canvas;

export default function main(pathname) {
  const input = new InputParser(pathname);
  const width = (input.board.width >=52 ? 52 : input.board.width) * GRID_SIZE;
  const height = (input.board.height >=52 ? 52 : input.board.height) * GRID_SIZE;
  const canv = createCanvas(width + 2 * PADDING, height + 2 * PADDING);
  const ctx = canv.getContext("2d");

  const board = new Board({
    ctx,
    width,
    height,
    gridsize: GRID_SIZE,
    padding: PADDING,
  });

  for (const { x, y, item } of input.tokens) {
    board.placeItem(x, y, item);
  }

  // TODO: recalculate icons by inspecting the data structure

  board.draw();

  return canv;
}

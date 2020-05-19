import Board from './board.js';
import Room from './room.js';
import Token from './token.js';
import InputParser from './input-parser.js';

function drawBoard(){
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const {board, rooms, tokens} = new InputParser(new URL(document.location));
    
    const GRID_SIZE = 40;
    const BOARD_WIDTH = board[0] * GRID_SIZE;
    const BOARD_HEIGHT = board[1] * GRID_SIZE;
    const PADDING = 10;

    new Board({
        ctx,
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT, 
        gridsize: GRID_SIZE,
        padding: PADDING,
    }).draw();

    for (const { width, height } of rooms) {
        new Room({
            ctx,
            width,
            height,
            gridsize: GRID_SIZE,
            padding: PADDING,
        }).draw();
    }

    for (const {name, position, color} of tokens) {
        new Token({
            ctx,
            name,
            position,
            gridsize: GRID_SIZE,
            padding: PADDING,
            color,
        }).draw();
    }
}

drawBoard();
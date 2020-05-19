import Board from './board.js';
import Room from './room.js';
import Token from './token.js';
import InputParser from './input-parser.js';

async function drawBoard(){
    // const canvas = document.getElementById("canvas");
    const canvas = new OffscreenCanvas(800, 800);
    const ctx = canvas.getContext("2d");
    const {board, rooms, tokens} = new InputParser(new URL(document.location));
    const img = new Image();
    
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

    const container = document.getElementById('container');
    const blob = await canvas.convertToBlob();
    const imageURL = URL.createObjectURL(blob);
    img.src = imageURL;
    container.appendChild(img);
}

drawBoard();
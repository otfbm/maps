import Board from './board.js';
import Room from './room.js';
import Token from './token.js';

export default async function drawBoard(ctx, width, height, rooms, tokens, gridsize, padding){
    new Board({
        ctx,
        width,
        height, 
        gridsize,
        padding,
    }).draw();

    for (const { width, height } of rooms) {
        new Room({
            ctx,
            width,
            height,
            gridsize,
            padding,
        }).draw();
    }

    for (const {name, position, color} of tokens) {
        new Token({
            ctx,
            name,
            position,
            gridsize,
            padding,
            color,
        }).draw();
    }
}
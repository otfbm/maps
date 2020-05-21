import Board from './board.js';
// import Room from './room.js';
// import Token from './token.js';
// import Icon from './icon.js';
import State from './state.js';

export default async function drawBoard(ctx, width, height, rooms, tokens, gridsize, padding){
    const state = new State(width, height);
    
    for (const token of tokens) {
        state.set(token);
    }

    // TODO: recalculate icons by inspecting the data structure

    new Board({
        state,
        ctx,
        width,
        height, 
        gridsize,
        padding,
    }).draw();



    // for (const { width, height } of rooms) {
    //     new Room({
    //         ctx,
    //         width,
    //         height,
    //         gridsize,
    //         padding,
    //     }).draw();
    // }

    // for (const {name, position, color, size} of tokens) {
    //     new Token({
    //         ctx,
    //         name,
    //         position,
    //         gridsize,
    //         padding,
    //         color,
    //         size,
    //     }).draw();
    // }

    // new Icon({
    //     name: '$D',
    //     position: [1, 6],
    //     gridsize,
    //     ctx,
    // }).draw();
}
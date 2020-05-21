import fastify from 'fastify';
import canvas from 'canvas';
import InputParser from './input-parser.js';
import drawBoard from './scripts.js';
import path from 'path';
import fastifyStatic from 'fastify-static';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GRID_SIZE = 40;
const PADDING = 15;

const { createCanvas, loadImage } = canvas;

const server = fastify({ logger: true });

server.register(fastifyStatic, {
    root: path.join(__dirname, 'icons'),
    prefix: '/icons/',
});

server.get('/*', (request, reply) => {
    if (request.params['*'] === 'favicon.ico') return reply.send('');
    const {board, rooms, tokens} = new InputParser(request.params, request.query);
    
    const BOARD_WIDTH = board[0] * GRID_SIZE;
    const BOARD_HEIGHT = board[1] * GRID_SIZE;
    
    const canvas = createCanvas(BOARD_WIDTH + (2 * PADDING), BOARD_HEIGHT + (2 * PADDING))
    const ctx = canvas.getContext('2d');
    
    drawBoard(ctx, BOARD_WIDTH, BOARD_HEIGHT, rooms, tokens, GRID_SIZE, PADDING);

    const data = canvas.toDataURL({type: 'image/png'});
    const stripped = data.replace(/^data:image\/\w+;base64,/, '');
    const buff = new Buffer(stripped, 'base64');

    reply.type('image/png').send(buff);
});

server.listen(process.env.PORT || 3000, '0.0.0.0');
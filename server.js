import fastify from 'fastify';
import drawCanvas from './draw-canvas.js';

const server = fastify({ logger: true });

server.get('/*', (request, reply) => {
    if (request.params['*'] === 'favicon.ico') return reply.send('');
    
    const canvas = drawCanvas(request.params['*']);
    const data = canvas.toDataURL({type: 'image/png'});
    const stripped = data.replace(/^data:image\/\w+;base64,/, '');
    const buff = new Buffer(stripped, 'base64');

    reply.type('image/png').send(buff);
});

server.listen(process.env.PORT || 3000, '0.0.0.0');
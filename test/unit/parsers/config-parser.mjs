import tap from 'tap';
import fastify from 'fastify';
import ConfigParser from '../../../parsers/config.js';

const { test } = tap;

const config1 = {
    board: 'c2:10x10',
    lines: ['_B2G2G4H4-dH6G6G8-sF9E10-bC10B10B2_B6-oG6'],
    effects: ['*c20rd5'],
    overlays: ['f4$T'],
    options: '@h10',
    background: 'https://i.imgur.com/5ODcwpV.jpg',
};

const config2 = {
    options: '@dh20',
    tokenImages: {
        Urzer: 'https://www.dndbeyond.com/avatars/17/930/636378855296814599.png',
        'Orc#': 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/301/1000/1000/636252771691385727.jpeg',
        'OR#': 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/301/1000/1000/636252771691385727.jpeg'
    }
};

test('parsing single config file', async (t) => {
    const server = fastify();
    server.get('/config', async (request, reply) => {
        return config1;
    });
    const address = await server.listen();

    const parser = new ConfigParser();
    const result = await parser.parse({ load: `${address}/config` });
    
    t.same(result, config1);

    await server.close();
    t.end();
});

test('parsing mutiple config files: configs get merged', async (t) => {
    const server = fastify();
    server.get('/config1', async (request, reply) => {
        return config1;
    });
    server.get('/config2', async (request, reply) => {
        return config2;
    });
    const address = await server.listen();

    const parser = new ConfigParser();
    const result = await parser.parse({ 
        load: [`${address}/config1`, `${address}/config2`],
    });
    
    t.same(result, { ...config1, ...config2 });

    await server.close();
    t.end();
});

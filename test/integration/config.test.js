const fastify = require('fastify');
const drawCanvas = require("../../draw-canvas");
const { toMatchImageSnapshot } = require("jest-image-snapshot");

expect.extend({ toMatchImageSnapshot });

const config = {
    tokenImages: {
        Urzer: 'https://www.dndbeyond.com/avatars/17/930/636378855296814599.png',
        'OR#': 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/301/1000/1000/636252771691385727.jpeg'
    }
};

test("tokens", async () => {
    const server = fastify();
    server.get('/config', async (request, reply) => {
        return config;
    });
    const address = await server.listen();
    const tokens = [
      "A1-Urzer",
      "B2-OR",
      "c3-OR1",
      "d4-or2",
    ];
    const canvas = await drawCanvas(`/${tokens.join("/")}`, { load: `${address}/config` }, false);
    expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
    await server.close();
});

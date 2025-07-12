import tap from 'tap'
import installImageSnapshot from "tap-image-snapshot";
import fastify from 'fastify';
import drawCanvas from "../../draw-canvas.js";

installImageSnapshot(tap)

const config = {
    tokenImages: {
        Urzer: 'https://www.dndbeyond.com/avatars/17/930/636378855296814599.png',
        'OR#': 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/301/1000/1000/636252771691385727.jpeg'
    }
};

tap.test("tokens", async (t) => {
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
    t.matchImageSnapshot(canvas.toBuffer("image/png"));
    await server.close();
    t.end();
});

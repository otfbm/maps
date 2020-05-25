import fastify from "fastify";
import drawCanvas from "./draw-canvas.js";
import fetch from 'node-fetch';

export default function createServer () {
  const server = fastify({ logger: true });

  server.get("/*", async (request, reply) => {
    if (request.params["*"] === "favicon.ico") return reply.send("");

    let backgroundImage = null;
    if (request.query.bg) {
      const res = await fetch(request.query.bg);
      const buffer = await res.buffer();
      backgroundImage = `data:${res.headers['content-type']};base64,${buffer.toString('base64')}`;
    }

    const canvas = drawCanvas(request.params["*"], backgroundImage);
    const data = canvas.toDataURL("image/png", 1);
    const stripped = data.replace(/^data:image\/\w+;base64,/, "");
    const buff = new Buffer(stripped, "base64");

    reply.type("image/png").send(buff);
  });

  return server;
}
  
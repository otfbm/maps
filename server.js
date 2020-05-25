import cluster from 'cluster';
import os from 'os';
import fastify from "fastify";
import drawCanvas from "./draw-canvas.js";
import fetch from 'node-fetch';

const numCPUs = os.cpus().length;
const server = fastify({ logger: true });

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', worker => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
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

  server.listen(process.env.PORT || 3000, "0.0.0.0");
}
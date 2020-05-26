import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import crypto from 'crypto';
import fastify from "fastify";
import drawCanvas from "./draw-canvas.js";
import fetch from "node-fetch";

export default function createServer() {
  const server = fastify({ logger: true });

  server.get("/*", async (request, reply) => {
    if (request.params["*"] === "favicon.ico") return reply.send("");

    let backgroundImage = null;
    if (request.query.bg) {
      try {
        const hash = crypto.createHash('md5').update(request.query.bg).digest('hex');
        const filePath = join(tmpdir(), hash);
        try {
          // try to get background image from file system cache
          const data = await fs.readFile(filePath, backgroundImage, 'utf8');
          backgroundImage = data.toString();
        } catch(err) {
          // fallback to fetching from URL
          const res = await fetch(request.query.bg);
          const buffer = await res.buffer();
          backgroundImage = `data:${
            res.headers["content-type"]
          };base64,${buffer.toString("base64")}`;

          // put data URL in file system cache
          await fs.writeFile(filePath, backgroundImage);
        }
      } catch (err) {
        // noop
      }
    }

    const canvas = drawCanvas(request.params["*"], backgroundImage);
    const data = canvas.toDataURL("image/jpeg", { quality: 1 });
    const stripped = data.replace(/^data:image\/\w+;base64,/, "");
    const buff = new Buffer(stripped, "base64");

    reply.type("image/jpeg").send(buff);
  });

  return server;
}

// start the server if this file is run directly with node server.js
if (process.argv[1].includes('server.js')) {
  const server = createServer();
  server.listen(process.env.PORT || 3000, "0.0.0.0");
}

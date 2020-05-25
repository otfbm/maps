import throng from 'throng';
import os from 'os';
import createServer from './server.js';

const numCPUs = os.cpus().length;
const WORKERS = process.env.WEB_CONCURRENCY || numCPUs;

throng({
  workers: WORKERS,
  lifetime: Infinity
}, () => {
  const server = createServer();
  server.listen(process.env.PORT || 3000, "0.0.0.0");
});
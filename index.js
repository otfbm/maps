import cluster from 'cluster';
import os from 'os';
import createServer from './server.js';

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', worker => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const server = createServer();
  server.listen(process.env.PORT || 3000, "0.0.0.0");
}
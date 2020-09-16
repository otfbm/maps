const fastify = require('fastify');
const func = require('./index').handler;

const createServer = ({ logger = true } = {}) => {
    const server = fastify({ logger });
    server.get("/*", async (request, reply) => {
        if (request.params["*"] === "favicon.ico") return reply.send("");
        const event = {
            rawPath: request.params['*'],
            path: request.params['*'],
            queryStringParameters: request.query,
            requestContext: {
                http: {
                    method: 'GET',
                    path: request.params['*'],
                },
            },
            headers: request.headers,
            isBase64Encoded: false,
        };
        const result = await func(event, {}, false);
        reply.headers(result.headers).status(result.statusCode).send(Buffer.from(result.body, 'base64'));
    });
    return server;
}

module.exports = createServer;

if (!module.parent) {
    const server = createServer();
    server.listen(4001);
}
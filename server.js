const fastify = require('fastify');
const server = fastify({ logger: true });
const func = require('./index').handler;

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
    const result = await func(event);
    reply.headers(result.headers).status(result.statusCode).send(new Buffer(result.body, 'base64'));
});

server.listen(4001);
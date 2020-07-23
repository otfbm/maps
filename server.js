const fastify = require('fastify');
const server = fastify({ logger: true });
const func = require('./index');

server.get("/*", async (request, reply) => {
    if (request.params["*"] === "favicon.ico") return reply.send("");
    const event = {
        rawPath: request.params['*'],
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
    reply.headers(result.headers).status(result.statusCode).send(result.body);
});

server.listen(4001);
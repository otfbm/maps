import fastify from 'fastify';
import { handler as func } from './index.js';

const normalizeQueryParams = (query) => {
    let q = {};
    for (const [key, val] of Object.entries(query)) {
        q[key] = Array.isArray(val) ? val : [val];
    }
    return q;
};

const createServer = ({ logger = true } = {}) => {
    const server = fastify({ logger });
    server.get("/*", async (request, reply) => {
        if (request.params["*"] === "favicon.ico") return reply.send("");
        const event = {
            rawPath: request.params['*'],
            path: request.params['*'],
            multiValueQueryStringParameters: normalizeQueryParams(request.query),
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

export default createServer;


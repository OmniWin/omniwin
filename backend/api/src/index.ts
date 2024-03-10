import Fastify from 'fastify'
import userRoutes from './routes/nft'
import authRoutes from './routes/auth'
import sseRoutes from './routes/sse'
import socialRoutes from './routes/social'
import dbPlugin from './db/dbConnector'
import { HttpError } from './errors/httpError';
import Ajv from 'ajv'
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'
import jwtAuthMiddleware from './plugins/auth';
import fastifyWebsocket from '@fastify/websocket'

dotenv.config()

const ajv = new Ajv({
    removeAdditional: 'all',
    useDefaults: true,
    coerceTypes: 'array',
    // any other options
    // ...
})

const fastify = Fastify({
    logger: true
})

const corsOptions = {
    origin: ['http://omniwin.local', 'http://localhost:3000', 'http://localhost:4356', 'http://localhost'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
};
fastify.register(cookie, {
    secret: "my-dadasdadasd", // for cookies signature
    parseOptions: {}     // options for parsing cookies
} as FastifyCookieOptions)

fastify.register(fastifyWebsocket);

fastify.register(cors, corsOptions)
fastify.register(jwtAuthMiddleware)
fastify.register(dbPlugin)


fastify.register(userRoutes, { prefix: '/v1' })
fastify.register(authRoutes, { prefix: '/v1' })
fastify.register(sseRoutes, { prefix: '/v1' })
fastify.register(socialRoutes, { prefix: '/v1' })

fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
    return ajv.compile(schema)
})

const start = async () => {
    try {
        const port = parseInt(process.env.BACKEND_APP_DOCKER_PORT || "8978")
        fastify.listen({ port: port, host: '0.0.0.0' }, function (err, address) {
            if (err) {
                fastify.log.error(err)
                process.exit(1)
            }

            fastify.log.info(`server listening on ${address}`)
        })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}


fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof HttpError) {
        return reply.code(error.statusCode).send({ success: false, message: error.message });
    } else if (error.validation) {
        // Customize the response for validation errors
        return reply.status(400).send({
            success: false,
            message: 'Validation failed',
            errors: error.validation // or format this as you prefer
        });
    } {
        console.log(error);
        return reply.code(500).send({ success: false, message: 'Internal Server Error' });
    }
});

start() 
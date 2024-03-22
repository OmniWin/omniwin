import Fastify from 'fastify'
import userRoutes from './routes/user'
import nftRoutes from './routes/nft'
import referralRoutes from './routes/referral'
import sseRoutes from './routes/sse'
import socialRoutes from './routes/social'
import dbPlugin from './db/dbConnector'
import { HttpError } from './errors/httpError';
import Ajv from 'ajv'
import dotenv from 'dotenv'
import fastifyMultipart from '@fastify/multipart';
import cors from '@fastify/cors'
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'
import jwtAuthMiddleware from './plugins/auth';
import fastifyWebsocket from '@fastify/websocket'
// import Session from 'express-session';

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
    credentials: true,
};
fastify.register(cookie, {
    secret: process.env.NEXTAUTH_SECRET, // for cookies signature
    parseOptions: {}     // options for parsing cookies
} as FastifyCookieOptions)

fastify.register(fastifyWebsocket);
// fastify.register(Session({
//     name: 'siwe-quickstart',
//     secret: "siwe-quickstart-secret",
//     resave: true,
//     saveUninitialized: true,
//     cookie: { secure: false, sameSite: true }
// }));

fastify.register(cors, corsOptions)
fastify.register(fastifyMultipart, {
    limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 10000,     // Max field value size in bytes
        fields: 10,         // Max number of non-file fields
        fileSize: 2 * 1024 * 1024, // 2MB,  // For multipart forms, the max file size in bytes
        // fileSize: 1000000,  // For multipart forms, the max file size in bytes
        files: 1,           // Max number of file fields
        headerPairs: 2000,  // Max number of header key=>value pairs
        parts: 1000         // For multipart forms, the max number of parts (fields + files)
    }
});
fastify.register(jwtAuthMiddleware)
fastify.register(dbPlugin)

fastify.register(userRoutes, { prefix: '/v1' })
fastify.register(nftRoutes, { prefix: '/v1' })
fastify.register(sseRoutes, { prefix: '/v1' })
fastify.register(socialRoutes, { prefix: '/v1' })
fastify.register(referralRoutes, { prefix: '/v1' })

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
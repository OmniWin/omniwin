import fp from "fastify-plugin"
import fastifyJwt from '@fastify/jwt'
import { FastifyRequest, FastifyReply, FastifyPluginAsync } from "fastify";
import { HttpError } from "../errors/httpError";
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1h';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

const jwtAuthMiddleware: FastifyPluginAsync = fp(async (fastify, options) => {
    fastify.register(fastifyJwt, {
        secret: "supersecret",
        sign: {
            expiresIn: accessTokenExpiry
        }
    })

    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify()
        } catch (err) {
            throw new HttpError(fastify, "UNAUTHORIZED")
        }
    })
})

export default jwtAuthMiddleware
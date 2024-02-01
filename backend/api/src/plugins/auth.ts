import fastifyPlugin from "fastify-plugin"
import { FastifyInstance } from "fastify"
import { FastifyPluginAsync } from "fastify";
import { FastifyRequest, FastifyReply } from "fastify";

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

const authenticate: FastifyPluginAsync = fastifyPlugin(async function (fastify: FastifyInstance, opts: any) {
    fastify.register(require("@fastify/jwt"), {
        secret: "supersecret"
    })

    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })
})

export default authenticate
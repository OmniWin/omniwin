
import { FastifyInstance } from "fastify"
import { SSeController } from '../controllers/sseController';

async function routes(fastify: FastifyInstance, options: any) {

    fastify.get('/events', SSeController.sse)

    // fastify.post('/logout', { schema: logoutSchema, onRequest: [fastify.authenticate] }, AuthController.logout)
}

export default routes
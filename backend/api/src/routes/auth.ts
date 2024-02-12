import { FastifyInstance } from "fastify"
import { AuthController } from '../controllers/authController';

async function routes(fastify: FastifyInstance, options: any) {
    fastify.get('/auth/nonce', AuthController.nonce)
    fastify.post('/auth/verify', AuthController.verify)
    fastify.get('/auth/session', {
        onRequest: [fastify.authenticate]
    }, AuthController.session)
    fastify.get('/auth/signout', {
        onRequest: [fastify.authenticate]
    }, AuthController.signout)
}

export default routes
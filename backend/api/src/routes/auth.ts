import { FastifyInstance } from "fastify"
import { AuthController } from '../controllers/authController';
import { authSchema } from '../schemas/authSchema';

async function routes(fastify: FastifyInstance, options: any) {
    fastify.get('/auth/nonce', AuthController.nonce)
    fastify.post('/auth/verify', AuthController.verify)
    fastify.get('/auth/session', AuthController.session)

    fastify.post('/auth/login', { schema: authSchema }, AuthController.signIn)
    fastify.post('/auth/logout', { schema: authSchema }, AuthController.logOut)
}

export default routes
import { FastifyInstance } from "fastify";
import { UserController } from '../controllers/userController';

async function routes(fastify: FastifyInstance, options: any) {
    fastify.get('/user/settings', {
        onRequest: [fastify.authenticate],
    }, UserController.settings)

    // Create user if not exists
    fastify.post('/user', {
        onRequest: [fastify.authenticate],
    }, UserController.create)

    // Check if user exists
    fastify.post('/user/exists', UserController.exists)
}

export default routes;
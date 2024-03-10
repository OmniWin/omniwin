import { FastifyInstance } from "fastify";
import { UserController } from '../controllers/userController';

async function routes(fastify: FastifyInstance, options: any) {
    fastify.post('/user/settings', {
        onRequest: [fastify.authenticate],
    }, UserController.settings)
}

export default routes;
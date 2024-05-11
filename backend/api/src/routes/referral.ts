import { FastifyInstance } from "fastify";
import { ReferralController } from '../controllers/referralController';

async function routes(fastify: FastifyInstance, options: any) {
    fastify.post('/referral/validate', {
        onRequest: [],
    }, ReferralController.validateCode)
}

export default routes;
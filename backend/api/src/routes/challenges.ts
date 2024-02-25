import { FastifyInstance } from "fastify"
import { ChallengesController } from '../controllers/challengesController';
import { seasonSchema } from '../schemas/seasonSchema';

async function routes(fastify: FastifyInstance, options: any) {

    fastify.post('/season', { schema: seasonSchema }, ChallengesController.fetchSeason)
}

export default routes
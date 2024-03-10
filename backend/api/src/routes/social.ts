import { FastifyInstance } from "fastify";
import { SocialController } from '../controllers/socialController';

const platformSchema = {
  type: 'object',
  required: ['platform', 'data'], // Assuming 'data' is also required
  properties: {
    platform: { type: 'string', enum: ['telegram', 'discord', 'x', 'email'] },
    data: {
      type: 'object',
      // You can include more specific validation here depending on the expected structure of 'data'
      // For example, if 'data' should always include a 'userId' field, you can uncomment the following lines:
      // required: ['userId'],
      // properties: {
      //   userId: { type: 'string' }
      // }
    }
  }
};

async function routes(fastify: FastifyInstance, options: any) {
    fastify.post('/user/social/sync', {
        onRequest: [fastify.authenticate],
        schema: {
            body: platformSchema
        }
    }, SocialController.sync)
}

export default routes;
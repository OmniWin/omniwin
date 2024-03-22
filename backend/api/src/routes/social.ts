import { FastifyInstance } from "fastify";
import { SocialController } from "../controllers/socialController";

async function routes(fastify: FastifyInstance, options: any) {
  fastify.post(
    "/user/social/sync",
    {
      onRequest: [fastify.authenticate],
    },
    SocialController.sync,
  );
}

export default routes;

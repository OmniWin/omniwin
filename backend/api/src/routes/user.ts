import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/userController";

async function routes(fastify: FastifyInstance, options: any) {
  fastify.get(
    "/user/settings",
    {
      onRequest: [fastify.authenticate],
    },
    UserController.settings,
  );

  // Create user if not exists
  fastify.post(
    "/user",
    {
      onRequest: [],
    },
    UserController.create,
  );

  // Update user settings
  fastify.put(
    "/user",
    {
      // onRequest: [fastify.authenticate],
      onRequest: [fastify.authenticate],
    },
    UserController.update,
  );

  // Check if user exists
  fastify.post("/user/exists", UserController.exists);

  // Fetch Opeansea assets
  fastify.get(
    "/user/wallet/nfts",
    {
      // onRequest: [fastify.authenticate],
    },
    UserController.fetchOpenseaNFTs,
  );
}

export default routes;

import { FastifyInstance } from "fastify"
import { NftController } from '../controllers/nftController';
import { nftPagination } from '../schemas/nftSchema';

async function routes(fastify: FastifyInstance, options: any) {

    fastify.post('/nfts', { schema: nftPagination }, NftController.fetchNFTs)
    fastify.get('/nfts/:id', NftController.fetchNFT)

    // fastify.post('/logout', { schema: logoutSchema, onRequest: [fastify.authenticate] }, AuthController.logout)
}

export default routes
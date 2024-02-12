import { FastifyInstance } from "fastify"
import { NftController } from '../controllers/nftController';
import { nftPagination } from '../schemas/nftSchema';

async function routes(fastify: FastifyInstance, options: any) {

    fastify.post('/nfts', { schema: nftPagination }, NftController.fetchNFTs)
    fastify.get('/nfts/:id', NftController.fetchNFT)
    fastify.get('/nfts/:id/tickets', NftController.fetchNFTTickets)
    fastify.get('/nfts/:id/activity', NftController.fetchNFTActivity)
    fastify.get('/nfts/:id/entrants', NftController.fetchNFTEntrants)


    fastify.post('/nfts/:id/favorite', { onRequest: [fastify.authenticate] }, NftController.addFavorite)

    // fastify.post('/logout', { schema: logoutSchema, onRequest: [fastify.authenticate] }, AuthController.logout)
}

export default routes
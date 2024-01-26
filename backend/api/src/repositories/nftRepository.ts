import { FastifyInstance } from 'fastify';

export class NftRepository {
    fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }

    async fetchNFTs(whereCondition: any, limit: number, orderBy: any) {
        const { prisma } = this.fastify;

        const nfts = await prisma.nft.findMany({
            where: whereCondition,
            take: limit + 1, // Fetch one extra item to determine if there's a next page
            orderBy: orderBy,
            include: {
                metadata: true,
            }
        });

        return nfts;
    }
}


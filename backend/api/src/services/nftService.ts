import { NftRepository } from '../repositories/nftRepository';
import { FastifyInstance } from 'fastify';

export class NftService {
    private nftRepository: NftRepository;
    constructor(private fastify: FastifyInstance) {
        this.nftRepository = new NftRepository(this.fastify);
    }

    async fetchNFTs(limit: number, cursor?: string) {
        const whereCondition = cursor ? { id_nft: { gt: cursor } } : {};
        const items = await this.nftRepository.fetchNFTs(whereCondition, limit);

        let nextCursor: string | null = null;
        if (items.length > limit) {
            nextCursor = items[limit - 1].id_nft.toString();
            items.pop(); // Remove the extra item
        }

        return { items, nextCursor };
    }

}
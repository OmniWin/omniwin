import { NftRepository } from '../repositories/nftRepository';
import { FastifyInstance } from 'fastify';
//import assetType enum
import { AssetType, NetworkType } from '@prisma/client';
import { SortBy } from "../types/sortBy";

export class NftService {
    private nftRepository: NftRepository;
    constructor(private fastify: FastifyInstance) {
        this.nftRepository = new NftRepository(this.fastify);
    }

    async fetchNFTs(limit: number, cursor: number, filters: { types?: AssetType[], networks?: NetworkType[], sortBy?: SortBy }) {
        let whereCondition = cursor ? { id_nft: { gt: cursor } } : {} as any;

        if (filters?.types) {
            whereCondition.asset_type = {
                in: filters.types
            };
        }

        if (filters?.networks) {
            whereCondition.network = {
                in: filters.networks
            };
        }

        if (filters?.sortBy) {
            whereCondition.orderBy = {
                [filters.sortBy]: 'desc'
            }
        }

        let orderBy = this.mapSortBy(filters.sortBy);


        const items = await this.nftRepository.fetchNFTs(whereCondition, limit, orderBy);

        let nextCursor: string | null = null;
        if (items.length > limit) {
            nextCursor = items[limit - 1].id_nft.toString();
            items.pop(); // Remove the extra item
        }

        return { items, nextCursor };
    }

    mapSortBy(sortBy: SortBy | undefined) {
        switch (sortBy) {
            case SortBy.TicketsRemaining:
                return { custom: 'TicketsRemaining' };
            case SortBy.PriceHighToLow:
                return { custom: 'PriceHighToLow' };
            case SortBy.PriceLowToHigh:
                return { custom: 'PriceLowToHigh' };
            case SortBy.Newest:
                return { custom: 'Newest' };
            case SortBy.Oldest:
                return { custom: 'Oldest' };
            case SortBy.TimeRemaining:
                return { custom: 'TimeRemaining' }; // Modify as per your field name
            default:
                return { custom: 'Newest' };
        }
    }
}
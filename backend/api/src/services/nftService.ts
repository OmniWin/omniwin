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

    async fetchNFTs(limit: number, cursor: number, filters: { types?: AssetType[], networks?: NetworkType[], sortBy?: SortBy, includeClosed?: boolean }) {
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

        if ('closed' in filters) {
            whereCondition.includeClosed = filters.includeClosed;
        } else {
            whereCondition.includeClosed = false;
        }


        const items = await this.nftRepository.fetchNFTs(whereCondition, limit, cursor, filters.sortBy);

        let nextCursor: string | null = null;
        if (items.length > limit) {
            nextCursor = items[limit - 1].id_nft.toString();
            items.pop(); // Remove the extra item
        }

        return { items, nextCursor };
    }

    async fetchNFT(id: number) {
        const fetchedNft = await this.nftRepository.fetchNFT(id);

        // console.log('fetchedNft', fetchedNft)

        const USDC_decimals = 6;

        //@ts-ignore
        const processedNft = fetchedNft.nft?.map(item => ({
            full_price: (this.convertBigInts(Number(item.ticket_price)) / Math.pow(10, USDC_decimals)) * item.total_tickets,
            ticket_price: this.convertBigInts(Number(item.ticket_price) / Math.pow(10, USDC_decimals)),
            tickets_bought: parseInt(item.tickets_bought.toString(), 10) || 0,
            tickets_total: item.total_tickets,
            end_timestamp: item.end_timestamp,
            nft_name: item.name,
            nft_image: item.image_local,
            nft_owner: item.owner,
            is_favorite: item.favorite ? !!item.favorite.length : false,
            favorites_count: this.convertBigInts(Number(item.favorites_count)) > 0 ? this.convertBigInts(Number(item.favorites_count)) : 0,
            asset_type: item.asset_type,
            nft_id: item.id_lot,
            token_id: parseInt(item.token_id.toString(), 10),
            network: item.network,
            collection_name: item.collection_name,
            is_verified: false,
            count_views: item.count_views,
        }));

        //@ts-ignore
        const processedTickets = fetchedNft.tickets.map(ticket => ({
            recipient: ticket.recipient,
            total_tickets: ticket.total_tickets,
            amount: this.convertBigInts(Number(ticket.amount)),
            bonus: ticket.bonus,
            tokens_spent: this.convertBigInts(Number(ticket.tokens_spent) / Math.pow(10, USDC_decimals)),
        }));

        //bonus Tickets formula= (uint256(amount) * amount) / (uint256(4) * totalTickets);
        //calculate bonus
        const purchaseOptions = this.getPurchaseOptions(fetchedNft.nft?.[0]?.total_tickets || 0);

        let obj = {
            nft: processedNft?.[0] || [],
            tickets: processedTickets,
            purchaseOptions,
            activity: (await this.fetchNFTActivity(id, 30, 0)).activity,
            participants: (await this.fetchNFTEntrants(id, 30, 0)).entrants,
        }

        return obj;
    }

    async increaseNFTViews(id: number) {
        return await this.nftRepository.increaseNFTViews(id);
    }

    async fetchNFTTickets(lotId: number, limit: number, cursor: number, order: string) {
        const fetchedTickets = await this.nftRepository.fetchNFTTickets(lotId, limit, cursor, order);
        const USDC_decimals = 6;

        const processedTickets = fetchedTickets.map(ticket => ({
            id_ticket: ticket.id_ticket,
            recipient: ticket.recipient,
            total_tickets: ticket.total_tickets,
            amount: this.convertBigInts(Number(ticket.amount)),
            bonus: ticket.bonus,
            tokens_spent: this.convertBigInts(Number(ticket.tokens_spent) / Math.pow(10, USDC_decimals)),
            transaction_hash: ticket.transaction_hash,
            created_at: ticket.created_at,
        }));

        let nextCursor: string | null = null;
        if (processedTickets.length > limit) {
            nextCursor = processedTickets[limit - 1].id_ticket.toString();
            processedTickets.pop(); // Remove the extra item
        }

        return { tickets: processedTickets, nextCursor };
    }

    async fetchNFTActivity(lotId: number, limit: number, cursor: number) {
        const fetchedActivity = await this.nftRepository.fetchNFTActivity(lotId, limit, cursor);
        const USDC_decimals = 6;

        const processedActivity = fetchedActivity.map(activity => ({
            id_activity: activity.id_ticket,
            recipient: activity.recipient,
            total_tickets: activity.total_tickets,
            amount: this.convertBigInts(Number(activity.amount)),
            bonus: activity.bonus,
            tokens_spent: this.convertBigInts(Number(activity.tokens_spent) / Math.pow(10, USDC_decimals)),
            transaction_hash: activity.transaction_hash,
            created_at: activity.created_at,
        }));

        let nextCursor: string | null = null;
        if (processedActivity.length > limit) {
            nextCursor = processedActivity[limit - 1].id_activity.toString();
            processedActivity.pop(); // Remove the extra item
        }

        return { activity: processedActivity, nextCursor };
    }

    async fetchNFTEntrants(lotId: number, limit: number, cursor: number) {
        const fetchedEntrants = await this.nftRepository.fetchNFTEntrants(lotId, limit, cursor);
        const USDC_decimals = 6;

        const processedEntrants = fetchedEntrants.map(entrant => ({
            recipient: entrant.recipient,
            total_tickets: entrant.total_tickets,
            amount: this.convertBigInts(Number(entrant.amount)),
            bonus: entrant.bonus,
            tokens_spent: this.convertBigInts(Number(entrant.tokens_spent) / Math.pow(10, USDC_decimals)),
            transaction_hash: entrant.transaction_hash,
            created_at: entrant.created_at,
        }));

        let nextCursor: string | null = null;
        if (processedEntrants.length > limit) {
            nextCursor = processedEntrants[limit - 1].recipient;
            processedEntrants.pop(); // Remove the extra item
        }

        return { entrants: processedEntrants, nextCursor };
    }

    calculateBonus(amount: number, totalTickets: number) {
        const bonus = (amount * amount) / (4 * totalTickets);

        return Math.floor(bonus);
    }

    getPurchaseOptions(totalTickets: number) {
        const purchaseOptions = [1, 10, 100, 500]; // Default purchase options
        const validOptions = purchaseOptions.filter(option => option <= totalTickets); // Filter out options greater than totalTickets
        const optionsWithBonuses = validOptions.map(amount => {
            const bonus = this.calculateBonus(amount, totalTickets); // Assume calculateBonus is the function from previous messages
            return {
                amount,
                bonus,
                total: amount + bonus // This is the total number of tickets including bonuses
            };
        });
        return optionsWithBonuses;
    }

    convertBigInts(obj: any) {
        for (let key in obj) {
            if (typeof obj[key] === 'bigint') {
                obj[key] = obj[key].toString();
            }
        }
        return obj;
    }


    async getEvents(created_at: Date | null) {
        const newBuyTickets = await this.nftRepository.newBuyTickets(created_at);

        if (newBuyTickets.length === 0) {
            return { events: [], created_at: null };
        }

        const lotIds = newBuyTickets.map(ticket => ticket.id_lot);
        const lots = await this.nftRepository.fetchNFTByIds(lotIds);

        const processedTickets = newBuyTickets.map(ticket => ({
            id_lot: ticket.id_lot,
            tickets: this.convertBigInts(Number(ticket.amount)),
            bonus: ticket.bonus,
            recipient: ticket.recipient,
        }));

        //@ts-ignore
        const processedNft = lots?.map(item => ({
            tickets_bought: item.tickets_bought || 0,
            nft_id: item.id_lot,
            participants: processedTickets.filter(ticket => ticket.id_lot === item.id_lot).map(ticket => ({
                recipient: ticket.recipient,
                tickets: ticket.tickets,
                bonus: ticket.bonus,
            })),
        }));

        return { events: processedNft, created_at: newBuyTickets[0].created_at };
    }


    async addFavorite(lotId: number, userId: string) {
        return await this.nftRepository.addFavorite(lotId, userId);
    }
}
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
            full_price: (Number(item.ticket_price) / Math.pow(10, USDC_decimals)) * item.total_tickets,
            ticket_price: this.convertBigInts(Number(item.ticket_price) / Math.pow(10, USDC_decimals)),
            tickets_bought: item.tickets_bought || 0,
            tickets_total: item.total_tickets,
            end_timestamp: item.end_timestamp,
            nft_name: item.name,
            nft_image: item.image_local,
            nft_owner: item.owner,
            // favorites: item.favorites,
            asset_type: item.asset_type,
            nft_id: item.id_lot,
            token_id: item.token_id,
            network: item.network,
            collection_name: item.collectionName,
            is_verified: false,
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
        console.log('purchaseOptions', purchaseOptions)

        return { nft: processedNft?.[0] || [], tickets: processedTickets, purchaseOptions };

    }

    async fetchNFTTickets(lotId: number, limit: number, cursor: number) {
        const fetchedTickets = await this.nftRepository.fetchNFTTickets(lotId, limit, cursor);
        const USDC_decimals = 6;

        const processedTickets = fetchedTickets.map(ticket => ({
            id_ticket: ticket.id_ticket,
            recipient: ticket.recipient,
            total_tickets: ticket.total_tickets,
            amount: this.convertBigInts(Number(ticket.amount)),
            bonus: ticket.bonus,
            tokens_spent: this.convertBigInts(Number(ticket.tokens_spent) / Math.pow(10, USDC_decimals)),
            created_at: ticket.created_at,
        }));

        let nextCursor: string | null = null;
        if (processedTickets.length > limit) {
            nextCursor = processedTickets[limit - 1].id_ticket.toString();
            processedTickets.pop(); // Remove the extra item
        }

        return { tickets: processedTickets, nextCursor };
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
}
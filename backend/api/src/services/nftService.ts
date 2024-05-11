import { NftRepository } from '../repositories/nftRepository';
import { FastifyInstance } from 'fastify';
//import assetType enum
import { AssetType } from '@prisma/client';
import { SortBy } from "../types/sortBy";

export class NftService {
    private nftRepository: NftRepository;
    constructor(private fastify: FastifyInstance) {
        this.nftRepository = new NftRepository(this.fastify);
    }

    async fetchNFTs(limit: number, cursor: number, filters: { types?: AssetType[], networks?: number[], sortBy?: SortBy, includeClosed?: boolean }) {
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

    async fetchNFT(id: number, limit: number) {
        // const fetchedNft = await this.nftRepository.fetchNFT(id);

        // const USDC_decimals = 6;

        // //@ts-ignore
        // const processedNft = fetchedNft.nft?.map(item => ({
        //     full_price: (this.convertBigInts(Number(item.ticket_price)) / Math.pow(10, USDC_decimals)) * item.total_tickets,
        //     ticket_price: this.convertBigInts(Number(item.ticket_price) / Math.pow(10, USDC_decimals)),
        //     tickets_bought: parseInt(item.tickets_bought?.toString() || '0', 10) || 0,
        //     tickets_total: item.total_tickets,
        //     end_timestamp: item.end_timestamp,
        //     nft_name: item.name,
        //     nft_image: item.image_local,
        //     nft_owner: item.owner,
        //     is_favorite: item.favorite ? !!item.favorite.length : false,
        //     favorites_count: this.convertBigInts(Number(item.favorites_count)) > 0 ? this.convertBigInts(Number(item.favorites_count)) : 0,
        //     asset_type: item.asset_type,
        //     nft_id: item.id_lot,
        //     token_id: parseInt(item.token_id.toString(), 10),
        //     network: item.network,
        //     collection_name: item.collection_name,
        //     is_verified: false,
        //     count_views: item.count_views,
        // }));

        //@ts-ignore
        // const processedTickets = fetchedNft.tickets.map(ticket => ({
        //     recipient: ticket.recipient,
        //     total_tickets: ticket.total_tickets,
        //     amount: this.convertBigInts(Number(ticket.amount)),
        //     bonus: ticket.bonus,
        //     tokens_spent: this.convertBigInts(Number(ticket.tokens_spent) / Math.pow(10, USDC_decimals)),
        // }));

        //bonus Tickets formula= (uint256(amount) * amount) / (uint256(4) * totalTickets);
        //calculate bonus
        // const purchaseOptions = this.getPurchaseOptions(fetchedNft.nft?.[0]?.total_tickets || 0);

        // let obj = {
        //     nft: processedNft?.[0] || [],
        //     // tickets: processedTickets,
        //     purchaseOptions,
        //     activity: (await this.fetchNFTActivity(id, limit, 0)).activity,
        //     participants: (await this.fetchNFTEntrants(id, limit, 0)).entrants,
        // }

        // return obj;
    }

    async increaseNFTViews(id: number) {
        return await this.nftRepository.increaseNFTViews(id);
    }

    async fetchNFTTickets(lotId: number, limit: number, cursor: number, order: string) {
        // const fetchedTickets = await this.nftRepository.fetchNFTTickets(lotId, limit, cursor, order);
        // const USDC_decimals = 6;

        // const processedTickets = fetchedTickets.map(ticket => ({
        //     id_ticket: ticket.idTicket,
        //     recipient: ticket.recipient,
        //     total_tickets: ticket.total_tickets,
        //     amount: this.convertBigInts(Number(ticket.amount)),
        //     bonus: ticket.bonus,
        //     tokens_spent: this.convertBigInts(Number(ticket.tokens_spent) / Math.pow(10, USDC_decimals)),
        //     transaction_hash: ticket.transaction_hash,
        //     created_at: ticket.created_at,
        // }));

        // let nextCursor: string | null = null;
        // if (processedTickets.length > limit) {
        //     nextCursor = processedTickets[limit - 1].id_ticket.toString();
        //     processedTickets.pop(); // Remove the extra item
        // }

        // return { tickets: processedTickets, nextCursor };
    }

    async fetchNFTActivity(lotId: number, limit: number, offset: number) {
        // const fetchedActivity = await this.nftRepository.fetchNFTActivity(lotId, limit, offset);
        // const USDC_decimals = 6;

        // const processedActivity = fetchedActivity.data.map(ticket => ({
        //     // id_ticket: ticket.id_ticket,
        //     block: ticket.block,
        //     recipient: ticket.recipient,
        //     total_tickets: ticket.total_tickets,
        //     tickets: this.convertBigInts(Number(ticket.amount)),
        //     bonus: ticket.bonus,
        //     tokens_spent: this.convertBigInts(Number(ticket.tokens_spent) / Math.pow(10, USDC_decimals)),
        //     transaction_hash: ticket.transaction_hash,
        //     created_at: ticket.created_at,
        // }));

        // return { activity: processedActivity, pagination: fetchedActivity.pagination };
    }

    async fetchNFTEntrants(lotId: number, limit: number, offset: number) {
        // const fetchedEntrants = await this.nftRepository.fetchNFTEntrants(lotId, limit, offset);
        // const USDC_decimals = 6;

        // const processedEntrants = fetchedEntrants.map(entrant => ({
        //     max_id_ticket: entrant.max_id_ticket || 0,
        //     block: entrant.max_block,
        //     recipient: entrant.recipient,
        //     total_tickets: parseInt(entrant.total_tickets),
        //     total_bonus: parseInt(entrant.total_bonus.toString()),
        //     total_tokens_spent: this.convertBigInts(Number(entrant.total_tokens_spent) / Math.pow(10, USDC_decimals)),
        //     username: entrant.username,
        // }));

        // return { entrants: processedEntrants };
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
        // const newBuyTickets = await this.nftRepository.newBuyTickets(created_at);

        // if (newBuyTickets.length === 0) {
        //     return { events: [], created_at: null };
        // }

        // let lotIds = newBuyTickets.map(ticket => ticket.id_lot);
        // const nfts = await this.nftRepository.fetchNFTByIds(lotIds);
        // const participants = await this.nftRepository.fetchNFTEntrantsByLots(lotIds);

        // // console.log("nfts", nfts)
        // // console.log("participants", participants)
        // //find participant by recipient

        // const processedTickets = newBuyTickets?.map(ticket => {
        //     const participant = participants[ticket.id_lot]?.find(participant => participant.recipient === ticket.recipient && participant.id_lot === ticket.id_lot);

        //     return {
        //         max_id_ticket: participant?.max_id_ticket || 0,
        //         max_block: participant?.max_block || 0,
        //         recipient: ticket.recipient,
        //         total_tickets: participant?.total_tickets || 0,
        //         total_bonus: participant?.total_bonus || 0,
        //         total_tokens_spent: participant?.total_tokens_spent || 0,
        //         username: participant?.username || '',
        //         id_lot: ticket.id_lot,
        //         tickets: this.convertBigInts(Number(ticket.amount)),
        //         bonus: ticket.bonus,
        //         block: ticket.block,
        //         transaction_hash: ticket.transaction_hash,
        //         created_at: ticket.created_at,
        //     }
        // })

        // // console.log("processedTickets", processedTickets)

        // //@ts-ignore
        // const processedNft = nfts?.map(item => ({
        //     tickets_bought: item.tickets_bought || 0,
        //     nft_id: item.id_lot,
        //     total_tickets: item.tickets_bought, // total amount of tickets bought
        //     total_bonus: item.bonus_tickets, // total amount of bonus tickets,
        //     total_tokens_spent: item.total_tokens_spent, // total amount of tokens spent
        //     participants: processedTickets.filter(ticket => ticket.id_lot === item.id_lot).map(ticket => ({
        //         block: ticket.block,
        //         recipient: ticket.recipient, // address of the recipient
        //         total_tickets: ticket.total_tickets,
        //         tickets: ticket.tickets, // amount of tickets bought per transaction
        //         bonus: ticket.bonus, // amount of bonus tickets per transaction
        //         max_id_ticket: ticket.max_id_ticket, //sending it just to preserve the structure of the object
        //         max_block: ticket.max_block, //sending it just to preserve the structure of the object
        //         total_bonus: ticket.total_bonus,
        //         total_tokens_spent: ticket.total_tokens_spent,
        //         username: ticket.username,
        //         transaction_hash: ticket.transaction_hash,
        //         created_at: ticket.created_at,
        //     })),
        // }));

        // /**
          
        //     max_id_ticket: number;
        //     max_block: number;
        //     recipient: string;
        //     total_tickets: string;
        //     total_bonus: string;
        //     total_tokens_spent: number;
        //     username: string;
        
        //  */

        // return { events: processedNft, created_at: newBuyTickets[0].created_at };
    }


    async addFavorite(lotId: number, userId: string) {
        return await this.nftRepository.addFavorite(lotId, userId);
    }

    async generateMetadata(tokenId: number) {
        const json = {
            "name": `Omniwin ${tokenId}`,
            "description": "A rare digital collectible OmniWin card.",
            "image": `https://web3trust.app/nft/${tokenId}_goerli.png`,
            "attributes": [
                {
                    "trait_type": "Color",
                    "value": "Emerald Green"
                },
                {
                    "trait_type": "Element",
                    "value": "Earth"
                },
                {
                    "trait_type": "Power Level",
                    "value": 5000
                },
                {
                    "trait_type": "Rarity",
                    "value": "Legendary"
                }
            ],
            "external_url": `https://omniwin.io/raffles/${tokenId}`
        }
        
        return json;
    }
}
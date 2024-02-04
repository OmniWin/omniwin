import { FastifyInstance } from 'fastify';
// import { FetchNFTsResultType } from "../types/fetchNfts";
import { SortBy } from "../types/sortBy";

export class NftRepository {
    fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }

    async fetchNFTs(whereCondition: any, limit: number, cursor: number, sortBy: any): Promise<{
        id_nft: number;
        id_lot: number;
        total_tickets: number;
        bonus_tickets: number;
        tickets_bought: number;
        ticket_price: number;
        transactions: number;
        end_timestamp: Date;
        fee: number;
        closed: boolean;
        buyout: number;
        asset_claimed: boolean;
        tokens_claimed: boolean;
        owner: string;
        signer: string;
        token: string;
        token_id: string;
        amount: number;
        asset_type: string;
        data: string;
        network: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        collectionName: string;
        image_local: string;

    }[]> {
        const { prisma } = this.fastify;
        const currentTimestamp = Math.floor(Date.now() / 1000);

        // Construct the base query with parameter placeholders
        let rawQuery = `SELECT 
                            Nft.id_nft, 
                            Nft.id_lot, 
                            Nft.total_tickets, 
                            Nft.bonus_tickets, 
                            Nft.tickets_bought, 
                            Nft.ticket_price, 
                            Nft.transactions, 
                            Nft.end_timestamp, 
                            Nft.fee, 
                            Nft.closed, 
                            Nft.buyout, 
                            Nft.asset_claimed, 
                            Nft.tokens_claimed, 
                            Nft.owner, 
                            Nft.signer, 
                            Nft.token, 
                            Nft.token_id, 
                            Nft.amount, 
                            Nft.asset_type, 
                            Nft.data, 
                            Nft.network, 
                            Nft.created_at, 
                            Nft.updated_at, 
                            NftMetadata.name, 
                            NftMetadata.collectionName, 
                            NftMetadata.image_local 
                        FROM Nft
                        LEFT JOIN NftMetadata ON Nft.id_nft = NftMetadata.id_nft
        `;

        // Parameters for the query
        let queryParams: any[] = [];

        // Building the WHERE clause with parameters
        let whereClauses = [];
        let orderByClause = "";

        if (whereCondition.asset_type?.in) {
            whereClauses.push(`asset_type IN (${whereCondition.asset_type.in.map(() => '?').join(', ')})`);
            queryParams.push(...whereCondition.asset_type.in);
        }

        if (whereCondition.network?.in) {
            whereClauses.push(`network IN (${whereCondition.network.in.map(() => '?').join(', ')})`);
            queryParams.push(...whereCondition.network.in);
        }

        if (cursor) {
            whereClauses.push(`Nft.id_nft > ?`);
            queryParams.push(cursor);
        }

        if (whereCondition.includeClosed === false) {
            // do not include closed nfts
            whereClauses.push(`end_timestamp > ${currentTimestamp} AND closed = 0`);
        }


        if (sortBy === SortBy.PriceHighToLow) {
            orderByClause += ` ORDER BY (ticket_price / 6) * total_tickets DESC LIMIT ?`;
        }

        if (sortBy === SortBy.PriceLowToHigh) {
            orderByClause += ` ORDER BY (ticket_price / 6) * total_tickets ASC LIMIT ?`;
        }

        if (sortBy === SortBy.TicketsRemaining) {
            orderByClause += ` ORDER BY (total_tickets - tickets_bought) / total_tickets ASC LIMIT ?`;
        }

        if (sortBy === SortBy.Newest) {
            orderByClause += ` ORDER BY created_at DESC LIMIT ?`;
        }

        if (sortBy === SortBy.Oldest) {
            orderByClause += ` ORDER BY created_at ASC LIMIT ?`;
        }

        if (sortBy === SortBy.TimeRemaining) {
            orderByClause += ` ORDER BY end_timestamp ASC LIMIT ?`;
        }

        if (sortBy === SortBy.Trending) {
            orderByClause += ` ORDER BY trendingScore DESC LIMIT ?`;
        }

        if (whereClauses.length > 0) {
            rawQuery += ` WHERE ${whereClauses.join(' AND ')}`;
        }


        queryParams.push(limit + 1);

        rawQuery += orderByClause;


        // console.log("rawQuery", rawQuery);
        // console.log("queryParams", queryParams);
        // Execute the query with parameterized values
        const nfts = await prisma.$queryRawUnsafe(rawQuery, ...queryParams);



        return nfts as any[];

    }


    async fetchNFT(id: number) {
        const { prisma } = this.fastify;

        let rawQuery = `SELECT 
                            Nft.id_nft, 
                            Nft.id_lot, 
                            Nft.total_tickets, 
                            Nft.bonus_tickets,
                            Nft.tickets_bought, 
                            Nft.ticket_price, 
                            Nft.transactions, 
                            Nft.end_timestamp, 
                            Nft.fee, 
                            Nft.closed, 
                            Nft.buyout, 
                            Nft.asset_claimed, 
                            Nft.tokens_claimed, 
                            Nft.owner, 
                            Nft.signer, 
                            Nft.token,
                            Nft.token_id, 
                            Nft.amount, 
                            Nft.asset_type, 
                            Nft.data, 
                            Nft.network, 
                            Nft.created_at, 
                            Nft.updated_at, 
                            NftMetadata.name, 
                            NftMetadata.collectionName, 
                            NftMetadata.image_local
                        FROM Nft
                        LEFT JOIN NftMetadata ON Nft.id_lot = NftMetadata.id_lot
                        WHERE Nft.id_lot = ? LIMIT 1`;

        const queryParams = [id];
        const nft = await prisma.$queryRawUnsafe(rawQuery, ...queryParams) as any;


        let rawQuery2 = `SELECT 
                            id_ticket,
                            id_lot,
                            unique_id,
                            recipient,
                            total_tickets,
                            amount,
                            bonus,
                            tokens_spent
                        FROM Tickets
                        WHERE id_lot = ?`;

        //id_lot 33 is fucked up
        const queryParams2 = [id];
        const tickets = await prisma.$queryRawUnsafe(rawQuery2, ...queryParams2) as any;




        return { nft, tickets };
    }

    async fetchNFTTickets(lotId: number, limit: number, cursor: number) {
        const { prisma } = this.fastify;
        const tickets = await prisma.tickets.findMany({
            take: limit + 1,
            cursor: cursor ? { id_ticket: cursor } : undefined,
            orderBy: { id_ticket: 'asc' },
            where: {
                id_lot: lotId
            }
        });

        return tickets;
    }

    convertBigInts(obj: any) {
        for (let key in obj) {
            if (typeof obj[key] === 'bigint') {
                obj[key] = obj[key].toString();
            }
        }
        return obj;
    }

}
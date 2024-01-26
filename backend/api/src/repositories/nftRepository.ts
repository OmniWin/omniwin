import { FastifyInstance } from 'fastify';
// import { FetchNFTsResultType } from "../types/fetchNfts";

export class NftRepository {
    fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }

    async fetchNFTs(whereCondition: any, limit: number, orderBy: any): Promise<{
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
        image: string;

    }[]> {
        const { prisma } = this.fastify;

        // Construct the base query with parameter placeholders
        let rawQuery = `SELECT id_nft, id_lot, total_tickets, bonus_tickets, tickets_bought, ticket_price, transactions, end_timestamp, fee, closed, buyout, asset_claimed, tokens_claimed, owner, signer, token, token_id, amount, asset_type, data, network, created_at, updated_at, NftMetadata.name, NftMetadata.image FROM Nft
        LEFT JOIN NftMetadata ON Nft.id_nft = NftMetadata.id_nft
        `;

        // Parameters for the query
        let queryParams: any[] = [];

        // Building the WHERE clause with parameters
        let whereClauses = [];

        if (whereCondition.asset_type?.in) {
            whereClauses.push(`asset_type IN (${whereCondition.asset_type.in.map(() => '?').join(', ')})`);
            queryParams.push(...whereCondition.asset_type.in);
        }

        if (whereCondition.network?.in) {
            whereClauses.push(`network IN (${whereCondition.network.in.map(() => '?').join(', ')})`);
            queryParams.push(...whereCondition.network.in);
        }

        if (whereClauses.length > 0) {
            rawQuery += ` WHERE ${whereClauses.join(' AND ')}`;
        }

        if (orderBy.custom === 'PriceHighToLow') {
            // Adding ORDER BY and LIMIT with placeholders
            rawQuery += ` ORDER BY (ticket_price / 6) * total_tickets DESC LIMIT ?`;
        }

        if (orderBy.custom === 'PriceLowToHigh') {
            // Adding ORDER BY and LIMIT with placeholders
            rawQuery += ` ORDER BY (ticket_price / 6) * total_tickets ASC LIMIT ?`;
        }

        if (orderBy.custom === 'TicketsRemaining') {
            // Adding ORDER BY and LIMIT with placeholders
            rawQuery += ` ORDER BY (total_tickets - tickets_bought) DESC LIMIT ?`;
        }

        if (orderBy.custom === 'Newest') {
            // Adding ORDER BY and LIMIT with placeholders
            rawQuery += ` ORDER BY created_at DESC LIMIT ?`;
        }

        if (orderBy.custom === 'Oldest') {
            // Adding ORDER BY and LIMIT with placeholders
            rawQuery += ` ORDER BY created_at ASC LIMIT ?`;
        }

        if (orderBy.custom === 'TimeRemaining') {
            // Adding ORDER BY and LIMIT with placeholders
            rawQuery += ` ORDER BY end_timestamp ASC LIMIT ?`;
        }


        queryParams.push(limit + 1);


        console.log("rawQuery", rawQuery);
        // Execute the query with parameterized values
        const nfts = await prisma.$queryRawUnsafe(rawQuery, ...queryParams);



        return nfts as any[];

    }

}
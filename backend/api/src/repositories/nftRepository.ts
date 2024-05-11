import { FastifyInstance } from 'fastify';
// import { FetchNFTsResultType } from "../types/fetchNfts";
import { SortBy } from "../types/sortBy";
// import { Prisma } from '@prisma/client';


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
        collection_name: string;
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
                            NftMetadata.collection_name, 
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
            orderByClause += ` ORDER BY trending_score DESC LIMIT ?`;
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
        // const { prisma } = this.fastify;

        // let rawQuery = `SELECT 
        //                     Nft.id_nft, 
        //                     Nft.id_lot, 
        //                     Nft.total_tickets,
        //                     Nft.ticket_price, 
        //                     Nft.transactions, 
        //                     Nft.end_timestamp, 
        //                     Nft.fee, 
        //                     Nft.closed, 
        //                     Nft.buyout, 
        //                     Nft.asset_claimed, 
        //                     Nft.tokens_claimed, 
        //                     Nft.owner, 
        //                     Nft.signer, 
        //                     Nft.token,
        //                     Nft.token_id, 
        //                     Nft.amount, 
        //                     Nft.asset_type, 
        //                     Nft.data, 
        //                     Nft.network, 
        //                     Nft.created_at, 
        //                     Nft.updated_at, 
        //                     NftMetadata.name, 
        //                     NftMetadata.collection_name, 
        //                     NftMetadata.image_local,
        //                     TicketSum.total_amount AS tickets_bought,
        //                     TicketSum.bonus_tickets,
        //                     count_views,
        //                     Favorites.id_user AS favorite,
        //                     (SELECT count(*) FROM Favorites WHERE Favorites.id_lot = ?) as favorites_count
        //                 FROM Nft
        //                 LEFT JOIN NftMetadata ON Nft.id_lot = NftMetadata.id_lot
        //                 LEFT JOIN Favorites ON Favorites.id_lot = Nft.id_lot
        //                 LEFT JOIN (
        //                     SELECT Tickets.id_lot, SUM(Tickets.amount) AS total_amount, SUM(Tickets.bonus) as bonus_tickets
        //                     FROM Tickets
        //                     WHERE Tickets.id_lot = ?
        //                     GROUP BY Tickets.id_lot
        //                 ) AS TicketSum ON Nft.id_lot = TicketSum.id_lot
        //                 WHERE Nft.id_lot = ? LIMIT 1`;

        // const queryParams = [id, id, id];
        // const nft = await prisma.$queryRawUnsafe(rawQuery, ...queryParams) as any;


        // let rawQuery2 = `SELECT 
        //                     id_ticket,
        //                     id_lot,
        //                     unique_id,
        //                     recipient,
        //                     total_tickets,
        //                     amount,
        //                     bonus,
        //                     tokens_spent
        //                 FROM Tickets
        //                 WHERE id_lot = ? LIMIT 10`;

        // //id_lot 33 is fucked up
        // const queryParams2 = [id];
        // const tickets = await prisma.$queryRawUnsafe(rawQuery2, ...queryParams2) as any;




        // return { nft, tickets };
    }

    async increaseNFTViews(id: number) {
        // const { prisma } = this.fastify;

        // await prisma.nft.update({
        //     where: {
        //         id_lot: id
        //     },
        //     data: {
        //         count_views: {
        //             increment: 1
        //         }
        //     }
        // })
    }

    async fetchNFTByIds(ids: number[]) {
        // const { prisma } = this.fastify;
        // const placeholders = ids.map(() => '?').join(', ');

        // let rawQuery = `SELECT 
        //                     Nft.id_nft, 
        //                     Nft.id_lot, 
        //                     Nft.total_tickets,
        //                     Nft.ticket_price, 
        //                     Nft.transactions, 
        //                     Nft.end_timestamp, 
        //                     Nft.fee, 
        //                     Nft.closed, 
        //                     Nft.buyout, 
        //                     Nft.asset_claimed, 
        //                     Nft.tokens_claimed, 
        //                     Nft.owner, 
        //                     Nft.signer, 
        //                     Nft.token,
        //                     Nft.token_id, 
        //                     Nft.amount, 
        //                     Nft.asset_type, 
        //                     Nft.data, 
        //                     Nft.network, 
        //                     Nft.created_at, 
        //                     Nft.updated_at, 
        //                     NftMetadata.name, 
        //                     NftMetadata.collection_name, 
        //                     NftMetadata.image_local,
        //                     TicketSum.total_amount AS tickets_bought,
        //                     TicketSum.bonus_tickets,
        //                     TicketSum.total_tokens_spent
        //                 FROM Nft
        //                 LEFT JOIN NftMetadata ON Nft.id_lot = NftMetadata.id_lot
        //                 LEFT JOIN (
        //                     SELECT Tickets.id_lot, SUM(Tickets.amount) AS total_amount, SUM(Tickets.bonus) as bonus_tickets, SUM(tokens_spent) AS total_tokens_spent
        //                     FROM Tickets
        //                     WHERE Tickets.id_lot IN (${placeholders})
        //                     GROUP BY Tickets.id_lot
        //                 ) AS TicketSum ON Nft.id_lot = TicketSum.id_lot
        //                 WHERE Nft.id_lot IN (${placeholders})`;


        // const queryParams = [...ids, ...ids]; // Duplicate the ids array for both IN clauses

        // const nfts: {
        //     id_nft: number;
        //     id_lot: number;
        //     total_tickets: number;
        //     ticket_price: number;
        //     transactions: number;
        //     end_timestamp: Date;
        //     fee: number;
        //     closed: boolean;
        //     buyout: number;
        //     asset_claimed: boolean;
        //     tokens_claimed: boolean;
        //     owner: string;
        //     signer: string;
        //     token: string;
        //     token_id: string;
        //     amount: number;
        //     asset_type: string;
        //     data: string;
        //     network: string;
        //     created_at: Date;
        //     updated_at: Date;
        //     name: string;
        //     collection_name: string;
        //     image_local: string;
        //     tickets_bought: number;
        //     bonus_tickets: number;
        //     total_tokens_spent: number;
        // }[] = await prisma.$queryRawUnsafe(rawQuery, ...queryParams) as any;



        // return nfts;
    }

    async fetchNFTTickets(lotId: number, limit: number, cursor: number, order: string) {
        // const { prisma } = this.fastify;
        // const tickets = await prisma.tickets.findMany({
        //     take: limit + 1,
        //     cursor: cursor ? { id_ticket: cursor } : undefined,
        //     orderBy: { block: order as Prisma.SortOrder },
        //     where: {
        //         id_lot: lotId
        //     }
        // });

        // return tickets;
    }

    async fetchNFTActivity(lotId: number, limit: number, offset: number) {
        // const { prisma } = this.fastify;

        // // Fetch activities with limit and offset
        // const activities = await prisma.tickets.findMany({
        //     where: {
        //         id_lot: lotId,
        //     },
        //     take: limit,
        //     skip: offset, // Use skip for offset
        //     orderBy: [
        //         { block: 'desc' },
        //         { total_tickets: 'desc' } // Ensure a secondary order to maintain uniqueness
        //     ],
        // });

        // // Optionally, fetch the total count of records to calculate the total number of pages
        // const totalCount = await prisma.tickets.count({
        //     where: {
        //         id_lot: lotId,
        //     },
        // });

        // const totalPages = Math.ceil(totalCount / limit);

        // return {
        //     data: activities,
        //     pagination: {
        //         totalPages,
        //         totalCount,
        //     },
        // };
    }

    async fetchNFTEntrants(lotId: number, limit: number, offset: number) {
        // const { prisma } = this.fastify;

        // const rawQuery = `
        //                 SELECT 
        //                     MAX(id_ticket) AS max_id_ticket,
        //                     MAX(block) AS max_block,
        //                     recipient, 
        //                     SUM(amount) AS total_tickets, 
        //                     SUM(bonus) as total_bonus,
        //                     SUM(tokens_spent) AS total_tokens_spent,
        //                     User.username
        //                 FROM 
        //                     Tickets
        //                 LEFT JOIN User ON User.address = Tickets.recipient    
        //                 WHERE 
        //                     id_lot = ? 
        //                 GROUP BY 
        //                     recipient
        //                 ORDER BY 
        //                     total_tickets DESC, max_block DESC
        //                 LIMIT ? OFFSET ?;
        //                 `;

        // const queryParams = [lotId, limit, offset];
        // const entrants = await prisma.$queryRawUnsafe(rawQuery, ...queryParams) as any;
        // return entrants as {
        //     max_id_ticket: number;
        //     max_block: number;
        //     recipient: string;
        //     total_tickets: string;
        //     total_bonus: string;
        //     total_tokens_spent: number;
        //     username: string;
        // }[];
    }

    async fetchNFTEntrantsByLots(lotId: number[]) {
        // const { prisma } = this.fastify;

        // if (lotId.length === 0) {
        //     return {};
        // }


        // const placeholders = lotId.map(() => '?').join(', ');
        // const rawQuery = `
        //                 SELECT 
        //                     MAX(id_ticket) AS max_id_ticket,
        //                     MAX(block) AS max_block,
        //                     recipient, 
        //                     SUM(amount) AS total_tickets, 
        //                     SUM(bonus) as total_bonus,
        //                     SUM(tokens_spent) AS total_tokens_spent,
        //                     User.username,
        //                     id_lot
        //                 FROM 
        //                     Tickets
        //                 LEFT JOIN User ON User.address = Tickets.recipient    
        //                 WHERE 
        //                     id_lot IN (${placeholders}) 
        //                 GROUP BY 
        //                     recipient, id_lot
        //                 ORDER BY 
        //                     total_tickets DESC, max_block DESC;
        //                 `;

        // const queryParams = [...lotId]
        // const entrants = await prisma.$queryRawUnsafe(rawQuery, ...queryParams) as any;
        // const response = {} as {
        //     [id_lot: number]: {
        //         id_lot: number;
        //         max_id_ticket: number;
        //         max_block: number;
        //         recipient: string;
        //         total_tickets: string;
        //         total_bonus: string;
        //         total_tokens_spent: number;
        //         username: string;
        //     }[];
        // }

        // for (let i = 0; i < entrants.length; i++) {
        //     if (!response[entrants[i].id_lot]) {
        //         response[entrants[i].id_lot] = [];
        //     }
        //     response[entrants[i].id_lot].push(entrants[i]);
        // }


        // return response;
    }


    convertBigInts(obj: any) {
        for (let key in obj) {
            if (typeof obj[key] === 'bigint') {
                obj[key] = obj[key].toString();
            }
        }
        return obj;
    }

    async newBuyTickets(created_at: Date | null) {
        // const { prisma } = this.fastify

        // let gte = new Date(new Date().getTime() - 10 * 1000)

        // if (created_at !== null) {
        //     gte = (created_at as Date)
        // }
        // //get tickets last 10 seconds
        // const tickets = await prisma.tickets.findMany({
        //     orderBy: { id_ticket: 'desc' },
        //     where: {
        //         created_at: {
        //             gt: gte
        //         }
        //     }
        // })

        // return tickets;
    }

    async addFavorite(id: number, user: string) {
        // const { prisma } = this.fastify;

        // // Check if the favorite already exists
        // const existingFavorite = await prisma.favorites.findUnique({
        //     where: {
        //         id_lot_id_user: {
        //             id_lot: id,
        //             id_user: user,
        //         },
        //     },
        // });

        // // If it exists, remove it
        // if (existingFavorite) {
        //     await prisma.favorites.delete({
        //         where: {
        //             id_lot_id_user: {
        //                 id_lot: id,
        //                 id_user: user,
        //             },
        //         },
        //     });
        //     return { message: 'Favorite removed' };
        // } else {
        //     // If it doesn't exist, create it
        //     await prisma.favorites.create({
        //         data: {
        //             id_lot: id,
        //             id_user: user,
        //         },
        //     });
        //     return { message: 'Favorite added' };
        // }
    }
}

import { FastifyRequest, FastifyReply } from "fastify";
import { NftService } from '../services/nftService';
import { HttpError } from '../errors/httpError';
import { FastifyInstance } from 'fastify';
import { AssetType, NetworkType } from '@prisma/client';
import { SortBy, FetchNFTsResultType } from "../types";
export class NftController {
    /**
     * 
     const sortOptions = [
        { id: "tickets_remaining",name: "% Tickets Remaining", href: "#", current: true },
        { id: "newest",name: "Newest", href: "#", current: true },
        { id: "oldest",name: "Oldest", href: "#", current: false },
        { id: "time_remaining",name: "Time remaining", href: "#", current: false },
    ];
     */
    public static async fetchNFTs(req: FastifyRequest, res: FastifyReply) {
        try {
            const nftService = new NftService(req.server as FastifyInstance);

            const { pagination, types, networks, sortBy } = req.body as {
                pagination: {
                    pageSize: string,
                    cursor: string
                },
                types: AssetType[],
                networks: NetworkType[],
                sortBy: SortBy,
                includeClosed: boolean
            };

            console.log("filters", req.body);


            const limit = parseInt(pagination.pageSize, 10) || 10;
            const cursor = pagination?.cursor ? parseInt(pagination.cursor.toString()) : 0;

            const filters = {
                types,
                networks,
                sortBy
            }



            const { items, nextCursor } = await nftService.fetchNFTs(limit, cursor, filters);

            //full_price
            //ticket_price
            //tickets_bought / tickets_total
            //time_left
            //nft name
            //nft image
            //nft owner
            //favorites
            //assetType

            const USDC_decimals = 6;
            const convertedItems = items.map(item => ({
                full_price: (Number(item.ticket_price) / Math.pow(10, USDC_decimals)) * item.total_tickets,
                ticket_price: Number(item.ticket_price) / Math.pow(10, USDC_decimals),
                tickets_bought: item.tickets_bought,
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
                collection_name: item.collection_name,
                is_verified: false,
            }));

            req.server.log.info(`Nfts fetched successfully, page: ${cursor}, limit: ${limit}`);

            return res.code(200).send({
                success: true,
                data: {
                    items: convertedItems,
                    next_cursor: nextCursor
                } as FetchNFTsResultType,
                message: "Nfts fetched successfully",
            });

        } catch (error: any) {
            console.log(error);
            if (error.code === 'P2002') { // Prisma's code for unique constraint violation
                throw new HttpError(req.server, "EMAIL_IN_USE");
            }
            throw new HttpError(req.server, error.message);
        }
    }

    public static async fetchNFT(req: FastifyRequest, res: FastifyReply) {
        try {
            //get activity
            //get entrants
            //date of draw
            //prize
            const nftId = parseInt((req.params as any).id.toString(), 10);
            const limit = 10
            // console.log("nftId", nftId);

            const nftService = new NftService(req.server as FastifyInstance);
            //increase count views by 1
            await nftService.increaseNFTViews(nftId);
            const nft = await nftService.fetchNFT(nftId, limit);

            req.server.log.info(`Nft fetched successfully, id: ${nftId}`);

            return res.code(200).send({
                success: true,
                data: nft,
                message: "Nft fetched successfully",
            });


        } catch (error: any) {
            console.log(error);
            if (error.code === 'P2002') { // Prisma's code for unique constraint violation
                throw new HttpError(req.server, "EMAIL_IN_USE");
            }
            throw new HttpError(req.server, error.message);
        }
    }

    public static async fetchNFTTickets(req: FastifyRequest, res: FastifyReply) {
        try {
            const lotId = (req.params as any).id;
            const nftService = new NftService(req.server as FastifyInstance);

            let { cursor, limit, order } = req.query as { cursor: string, limit: string, order: string };

            const lotId_ = parseInt(lotId, 10);
            const limit_ = parseInt(limit, 10) || 10;
            const cursor_ = cursor ? parseInt(cursor.toString()) : 0;
            const order_ = order === 'asc' ? 'asc' : 'desc';

            const { tickets, nextCursor } = await nftService.fetchNFTTickets(lotId_, limit_, cursor_, order_);

            return res.code(200).send({
                success: true,
                data: {
                    items: tickets,
                    next_cursor: nextCursor
                },
                message: "Nfts fetched successfully",
            });

        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }

    public static async fetchNFTActivity(req: FastifyRequest, res: FastifyReply) {
        try {
            const lotId = (req.params as any).id;
            const nftService = new NftService(req.server as FastifyInstance);

            let { cursor, limit } = req.query as { cursor: string, limit: string };

            const lotId_ = parseInt(lotId, 10);
            const limit_ = parseInt(limit, 10) || 10;
            const cursor_ = cursor ? parseInt(cursor.toString()) : 0;

            const { activity, nextCursor } = await nftService.fetchNFTActivity(lotId_, limit_, cursor_);

            return res.code(200).send({
                success: true,
                data: {
                    items: activity,
                    next_cursor: nextCursor
                },
                message: "Activity fetched successfully",
            });

        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }

    public static async fetchNFTEntrants(req: FastifyRequest, res: FastifyReply) {
        try {
            const lotId = (req.params as any).id;
            const nftService = new NftService(req.server as FastifyInstance);

            let { offset, limit, ticketId } = req.query as { offset: string, limit: string, ticketId: string };

            const lotId_ = parseInt(lotId, 10);
            const limit_ = parseInt(limit, 10) || 10;
            const offset_ = offset ? parseInt(offset.toString()) : 0;
            const last_page_last_id_ticket = ticketId ? parseInt(ticketId.toString()) : 0;

            console.log({
                lotId_,
                limit_,
                offset_,
                last_page_last_id_ticket
            });

            const { entrants } = await nftService.fetchNFTEntrants(lotId_, limit_, offset_);

            return res.code(200).send({
                success: true,
                data: {
                    items: entrants,
                },
                message: "Entrants fetched successfully",
            });

        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }

    public static async addFavorite(req: FastifyRequest, res: FastifyReply) {
        try {
            const lotId = (req.params as any).id;
            const nftService = new NftService(req.server as FastifyInstance);

            const decodedToken = await req.jwtDecode() as any;


            const session = {
                address: decodedToken.payload.address,
                chainId: decodedToken.payload.chainId,
                userId: decodedToken.payload.userId,
                username: decodedToken.payload.username,
                email: decodedToken.payload.email,
            };

            const lotId_ = parseInt(lotId, 10);
            const favorite = await nftService.addFavorite(lotId_, session.userId);

            return res.code(200).send({
                success: true,
                message: favorite.message,
            });

        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }
}

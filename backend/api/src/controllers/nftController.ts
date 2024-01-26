
import { FastifyRequest, FastifyReply } from "fastify";
import { NftService } from '../services/nftService';
import { HttpError } from '../errors/httpError';
import { FastifyInstance } from 'fastify';
import { AssetType, NetworkType } from '@prisma/client';
export class NftController {

    public static async fetchNFTs(req: FastifyRequest, res: FastifyReply) {
        try {
            const nftService = new NftService(req.server as FastifyInstance);

            const { pagination, types, networks } = req.body as {
                pagination: {
                    pageSize: string,
                    offset: string
                },
                types: AssetType[],
                networks: NetworkType[]
            };

            console.log("filters", req.body);


            const limit = parseInt(pagination.pageSize, 10) || 10;
            const cursor = pagination?.offset ? parseInt(pagination.offset.toString()) : 0;

            const filters = {
                types,
                networks,
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
                full_price: Number(item.ticket_price) / USDC_decimals * item.total_tickets,
                ticket_price: Number(item.ticket_price) / USDC_decimals,
                tickets_bought: item.tickets_bought,
                tickets_total: item.total_tickets,
                time_left: item.end_timestamp,
                nft_name: item.metadata?.name,
                nft_image: item.metadata?.image,
                nft_owner: item.owner,
                // favorites: item.favorites,
                asset_type: item.asset_type,
                nft_id: item.id_lot,
                token_id: item.token_id,
                network: item.network,
            }));

            req.server.log.info(`Nfts fetched successfully, page: ${cursor}, limit: ${limit}`);

            return res.code(201).send({
                success: true,
                data: {
                    items: convertedItems,
                    nextCursor: nextCursor
                },
                message: "User created successfully",
            });

        } catch (error: any) {
            console.log(error);
            if (error.code === 'P2002') { // Prisma's code for unique constraint violation
                throw new HttpError(req.server, "EMAIL_IN_USE");
            }
            throw new HttpError(req.server, error.message);
        }
    }
}

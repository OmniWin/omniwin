
import { FastifyRequest, FastifyReply } from "fastify";
import { NftService } from '../services/nftService';
import { HttpError } from '../errors/httpError';
import { FastifyInstance } from 'fastify';

export class NftController {

    public static async fetchNFTs(req: FastifyRequest, res: FastifyReply) {
        try {
            const nftService = new NftService(req.server as FastifyInstance);

            const { pagination, types } = req.body as {
                pagination: {
                    pageSize: string,
                    offset: string
                },
                types: string[]
            };
            console.log(types);


            const limit = parseInt(pagination.pageSize, 10) || 10;

            const cursor = pagination.offset;
            const { items, nextCursor } = await nftService.fetchNFTs(limit, cursor);


            const convertedItems = items.map(item => ({
                ...item,
                ticket_price: item.ticket_price.toString(),
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

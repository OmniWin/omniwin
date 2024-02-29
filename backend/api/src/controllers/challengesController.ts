
import { FastifyRequest, FastifyReply } from "fastify";
import { ChallengesService } from '../services/challengesService';
import { HttpError } from '../errors/httpError';
import { FastifyInstance } from 'fastify';
export class ChallengesController {

    public static async fetchSeason(req: FastifyRequest, res: FastifyReply) {
        try {
           
            const { end_date } = req.body as {
                end_date: Date
            };
            const limit = 1

            const challengesService = new ChallengesService(req.server as FastifyInstance);
            const season = await challengesService.fetchSeason(end_date, limit);

            req.server.log.info(`Season fetched successfully, end_date: ${end_date}`);

            return res.code(200).send({
                success: true,
                data: season,
                message: "Season fetched successfully",
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

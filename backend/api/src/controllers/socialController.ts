import { FastifyRequest, FastifyReply } from "fastify";
import { HttpError } from '../errors/httpError';
import { SocialService } from '../services/socialService';
import { FastifyInstance } from 'fastify';

export class SocialController {

    public static async sync(req: FastifyRequest, res: FastifyReply) {
        try {
            const { address } = req.user as any;

            if (!address) {
                throw new HttpError(req.server, "INVALID_ADDRESS");
            }

            const userService = await new SocialService(req.server as FastifyInstance);
            const user = userService.findBy('address', address);

            if (!user) {
                throw new HttpError(req.server, "USER_NOT_FOUND");
            }

            const { platform, data } = req.body as any;

            console.log(platform, data)

            await userService.syncSocialPlatforms(platform, data, address);

            return res.code(200).send({
                success: true,
                data: data,
                message: "Social platforms synced successfully",
            });
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }
}

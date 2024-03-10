import { FastifyRequest, FastifyReply } from "fastify";
import { HttpError } from '../errors/httpError';
import { SocialService } from '../services/socialService';
import { FastifyInstance } from 'fastify';

export class SocialController {

    public static async sync(req: FastifyRequest, res: FastifyReply) {
        try {
            const decodedToken = await req.jwtDecode() as any;

            const session = {
                address: decodedToken.payload.address,
                chainId: decodedToken.payload.chainId,
                userId: decodedToken.payload.userId,
                username: decodedToken.payload.username,
                email: decodedToken.payload.email,
            };

            const userService = await new SocialService(req.server as FastifyInstance);
            const user = userService.find(session.userId);

            if (!user) {
                throw new HttpError(req.server, "USER_NOT_FOUND");
            }

            const { platform, data } = req.body as { platform: string, data: any };

            userService.syncSocialPlatforms(user, {
                platform: platform,
                data: data
            });

            return res.code(200).send(true);
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }
}

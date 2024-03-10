import { FastifyRequest, FastifyReply } from "fastify";
import { HttpError } from '../errors/httpError';
import { UserService } from "../services/userService";
import { FastifyInstance } from 'fastify';

export class UserController {

    public static async settings(req: FastifyRequest, res: FastifyReply) {
        try {
            const decodedToken = await req.jwtDecode() as any;

            const session = {
                address: decodedToken.payload.address,
                chainId: decodedToken.payload.chainId,
                userId: decodedToken.payload.userId,
                username: decodedToken.payload.username,
                email: decodedToken.payload.email,
            };

            const userService = await new UserService(req.server as FastifyInstance);
            const user = userService.fetchUserSettings(session.address);

            if (!user) {
                throw new HttpError(req.server, "USER_NOT_FOUND");
            }

            return res.code(200).send(user);
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }
}

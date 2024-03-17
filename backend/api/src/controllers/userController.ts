import { FastifyRequest, FastifyReply } from "fastify";
import { HttpError } from '../errors/httpError';
import { UserService } from "../services/userService";
import { ReferralService } from "../services/referralService";
import { FastifyInstance } from 'fastify';

export class UserController {

    public static async settings(req: FastifyRequest, res: FastifyReply) {
        try {
            const { address } = req.user as any;
            const userService = await new UserService(req.server as FastifyInstance);
            const user = await userService.fetchUserSettings(address);

            if (!user) {
                throw new HttpError(req.server, "USER_NOT_FOUND");
            }

            return res.code(200).send(user);
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }

    public static async create(req: FastifyRequest, res: FastifyReply) {
        try {
            const { address, chainId } = req?.user as any;
            const referralService = await new ReferralService(req.server as FastifyInstance);
            const userService = await new UserService(req.server as FastifyInstance);
            const referralCode = await referralService.generateReferralCode();
            const data = {
                ...req.body ?? {},
                chainId: chainId,
                address: address,
                referral_code: referralCode,
            };
            const user = await userService.createUser(data);
            await referralService.createReferral({ referred_user_id: user.id_user, referral_code: user.referral_code });

            return res.code(200).send(user);
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }

    public static async exists(req: FastifyRequest, res: FastifyReply) {
        try {
            const { address } = req.body as {
                address: string;
            };

            if (!address) {
                throw new HttpError(req.server, "INVALID_ADDRESS");
            }

            const userService = await new UserService(req.server as FastifyInstance);
            const exists = await userService.exists(address);

            return res.code(200).send(exists ? true : false);
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }
}

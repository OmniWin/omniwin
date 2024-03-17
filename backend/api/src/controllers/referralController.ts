import { FastifyRequest, FastifyReply } from "fastify";
import { HttpError } from '../errors/httpError';
import { ReferralService } from "../services/referralService";
import { FastifyInstance } from 'fastify';

export class ReferralController {

    public static async validateCode(req: FastifyRequest, res: FastifyReply) {
        try {
            const { referralCode } = req.body as {
                referralCode: string;
            };

            if (!referralCode) {
                throw new HttpError(req.server, "INVALID_REFERRAL_CODE");
            }

            const referralService = await new ReferralService(req.server as FastifyInstance);
            const code = await referralService.validateCode(referralCode);

            if (!code) {
                throw new HttpError(req.server, "REFERRAL_CODE_NOT_FOUND");
            }

            return res.code(200).send(code);
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }
}

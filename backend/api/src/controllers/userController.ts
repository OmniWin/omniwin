import { FastifyRequest, FastifyReply } from "fastify";
import { HttpError } from '../errors/httpError';
import { UserService } from "../services/userService";
import { ReferralService } from "../services/referralService";
import { FastifyInstance } from 'fastify';

import fs from 'fs';
import path from 'path';
import util from 'util';

// const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

export class UserController {

    public static async settings(req: FastifyRequest, res: FastifyReply) {
        try {
            const { address } = req.user as any;
            const userService = await new UserService(req.server as FastifyInstance);
            const user = await userService.fetchUserSettings(address);

            if (!user) {
                throw new HttpError(req.server, "USER_NOT_FOUND");
            }

            return res.code(200).send({
                success: true,
                data: user,
                message: "User settings fetched successfully",
            });
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }

    public static async create(req: FastifyRequest, res: FastifyReply) {
        try {
            const { address, chainId, usedReferralCode } = req?.body as any;
            const referralService = new ReferralService(req.server as FastifyInstance);
            const userService = new UserService(req.server as FastifyInstance);

            // Check if user exists
            const exists = await userService.exists(address);
            if (exists) {
                // throw new HttpError(req.server, "USER_EXISTS");
                const { issuedAt, updatedAt, ...userWithoutTimestamps } = exists;
                return res.code(200).send({
                    success: true,
                    data: userWithoutTimestamps,
                    message: "User exists",
                });
            }

            // Validate usedReferralCode
            if (usedReferralCode) {
                const referral = await referralService.validateCode(usedReferralCode);
                if (!referral) {
                    throw new HttpError(req.server, "INVALID_REFERRAL_CODE");
                }
            } else {
                throw new HttpError(req.server, "INVALID_REFERRAL_CODE");
            }

            const referralCode = await referralService.generateReferralCode();
            const data = {
                chainId: chainId,
                address: address,
                referral_code: referralCode,
            };
            const user = await userService.createUser(data);
            await referralService.createReferral({ referred_user_id: user.id, referral_code: usedReferralCode });

            const { issuedAt, updatedAt, ...userWithoutTimestamps } = user;
            return res.code(200).send({
                success: true,
                data: userWithoutTimestamps,
                message: "User created successfully",
            });
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }

    public static async update(req: FastifyRequest, res: FastifyReply) {
        try {
            const { address } = req.user as any;

            if (!address) {
                throw new HttpError(req.server, "INVALID_ADDRESS");
            }

            const userService = await new UserService(req.server as FastifyInstance);
            const user = await userService.exists(address);

            if (!user) {
                throw new HttpError(req.server, "USER_NOT_FOUND");
            }

            // Handling file upload
            const parts = req.parts();
            let avatarPath = '';
            let username: string | object = '';
            let description: string | object = '';

            for await (const part of parts) {
                console.log(part);
                if (part.type === 'file') {
                    const timestamp = Date.now();
                    const uploadDir = path.join(__dirname, '../../../../website/public/images/uploads/avatars/');
                    const uniqueFilename = `${timestamp}-${part.filename}`;
                    const filePath = path.join(uploadDir, uniqueFilename);
                    await writeFile(filePath, await part.toBuffer());
                    avatarPath = uniqueFilename;
                } else {
                    if (part.fieldname === 'username') {
                        username = (await part?.value) ?? '';
                    } else if (part.fieldname === 'description') {
                        description = (await part?.value) ?? '';
                    }
                }
            }

            const data: {
                username: string;
                avatar?: string;
                description: string;
            } = {
                username: username as string,
                description: description as string,
            };
            avatarPath && (data['avatar'] = avatarPath);
            const updatedUser = await userService.updateUser(address, data);

            return res.code(200).send(updatedUser);
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

            return res.code(200).send({
                success: true,
                data: {
                    exists: exists ? true : false,
                },
                message: "User exists",
            });
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }
}

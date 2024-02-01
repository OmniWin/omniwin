import { FastifyRequest, FastifyReply } from "fastify";
import { HttpError } from '../errors/httpError';
import ssx from "../helpers/_ssx";
import { generateNonce, SiweMessage } from 'siwe';
import { UserService } from "../services/userService";
import { FastifyInstance } from 'fastify';

export class AuthController {

    public static async nonce(req: FastifyRequest, res: FastifyReply) {
        try {

            res.header('Content-Type', 'text/plain');
            return res.code(200).send(generateNonce());
        } catch (error: any) {
            console.log(error);
            if (error.code === 'P2002') { // Prisma's code for unique constraint violation
                throw new HttpError(req.server, "EMAIL_IN_USE");
            }
            throw new HttpError(req.server, error.message);
        }
    }

    public static async verify(req: FastifyRequest, res: FastifyReply) {
        const { message, signature } = req.body as { message: string, signature: string };
        const siweMessage = new SiweMessage(message);
        try {
            const userService = new UserService(req.server as FastifyInstance);

            await siweMessage.verify({ signature });

            const address = siweMessage.address as string;
            const chainId = siweMessage.chainId as number;

            const user = await userService.findOrCreateUser({
                address,
                chainId,
            });

            const payload = {
                address,
                chainId,
                issuedAt: siweMessage.issuedAt,
                username: user.username,
                email: user.email,
                userId: user.id_user,
            };

            const token = await res.jwtSign({ payload })
            console.log({ token })

            res.send({ token });
        } catch (error: any) {
            console.log(error);
            res.send(false);
        }
    }

    public static async session(req: FastifyRequest, res: FastifyReply) {
        try {
            const session = {
                address: "0x0000000",
                chainId: 5,
            };


            return res.code(200).send({
                success: true,
                data: session
            });
        } catch (error: any) {
            console.log(error);
            if (error.code === 'P2002') { // Prisma's code for unique constraint violation
                throw new HttpError(req.server, "EMAIL_IN_USE");
            }
            throw new HttpError(req.server, error.message);
        }
    }

    public static async signIn(req: FastifyRequest, res: FastifyReply) {
        const body = req.body as {
            siwe: string,
            signature: string,
            daoLogin: boolean,
            resolveEns: boolean,
            resolveLens: boolean,
        };

        // Accessing the cookie
        const nonce = req.cookies.nonce;

        try {
            const loginResponse = await ssx.login(
                body.siwe,
                body.signature,
                body.daoLogin,
                body.resolveEns,
                nonce ?? "",
                body.resolveLens,
            );

            console.log({ loginResponse })

            return res.code(200).send({
                success: true,
                data: loginResponse
            });
        } catch (error: any) {
            console.log(error);
            if (error.code === 'P2002') { // Prisma's code for unique constraint violation
                throw new HttpError(req.server, "EMAIL_IN_USE");
            }
            throw new HttpError(req.server, error.message);
        }
    }

    public static async logOut(req: FastifyRequest, res: FastifyReply) {
        try {
            return res.code(200).send({
                success: await ssx.logout() ?? true,
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

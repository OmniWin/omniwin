import { FastifyRequest, FastifyReply } from "fastify";
import { HttpError } from '../errors/httpError';
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

            res
                .setCookie('token', token, {
                    // domain: 'localhost',
                    path: '/',
                    // secure: true, // send cookie over HTTPS only
                    httpOnly: true,
                    sameSite: 'lax'
                })
                .code(200)
                .send(true)
        } catch (error: any) {
            console.log(error);
            res.send(false);
        }
    }

    public static async session(req: FastifyRequest, res: FastifyReply) {
        try {
            const decodedToken = await req.jwtDecode() as any;
            // console.log({ decodedToken })

            const session = {
                address: decodedToken.payload.address,
                chainId: decodedToken.payload.chainId,
                userId: decodedToken.payload.userId,
                username: decodedToken.payload.username,
                email: decodedToken.payload.email,
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

    public static async signout(req: FastifyRequest, res: FastifyReply) {
        try {

            res.clearCookie('token', {
                // domain: 'localhost',
                path: '/',
                secure: false, // send cookie over HTTPS only
                httpOnly: true,
                sameSite: false // alternative CSRF protection
            });
            return res.code(200).send(true);
        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }
}

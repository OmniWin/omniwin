import fp from "fastify-plugin"
import fastifyJwt from '@fastify/jwt'
import { FastifyRequest, FastifyReply, FastifyPluginAsync } from "fastify";
import { HttpError } from "../errors/httpError";
import dotenv from 'dotenv'
import { decode } from 'next-auth/jwt';
import { JWT } from 'next-auth/jwt'

dotenv.config()

const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1h';
const secret = process.env.NEXTAUTH_SECRET || 'my-secret';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

const jwtAuthMiddleware: FastifyPluginAsync = fp(async (fastify, options) => {
    fastify.register(fastifyJwt, {
        secret: secret,
        sign: {
            expiresIn: accessTokenExpiry
        }
    })

    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.cookies?.['next-auth.session-token'] || "";
            const decodedToken: JWT | null = await decode({ token, secret });
            if (!decodedToken) {
                // throw new Error('Token decoding failed or token is null');
                throw new HttpError(fastify, "UNAUTHORIZED");
            }

            const [, chainId, address] = decodedToken.sub!.split(":")

            if (!address || !chainId) {
                throw new HttpError(fastify, "UNAUTHORIZED");
            }

            request.user = {
                chainId: parseInt(chainId, 10),
                address: address,
                exp: decodedToken.exp,
                iat: decodedToken.iat
            }
        } catch (err) {
            throw new HttpError(fastify, "UNAUTHORIZED")
        }
    })
})

export default jwtAuthMiddleware
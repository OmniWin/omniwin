import { FastifyInstance } from 'fastify';


export class UserRepository {
    fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }

    async findUser(address: string) {
        const { prisma } = this.fastify;
        return await prisma.user.findUnique({ where: { address: address } });
    }

    async createUser(data: any) {
        const { prisma } = this.fastify;
        return await prisma.user.create({ data });
    }
}


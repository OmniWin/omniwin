import { FastifyInstance } from 'fastify';

export class UserRepository {
    fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }

    async findByAddress(address: string) {
        const { prisma } = this.fastify;
        return await prisma.user.findUnique({ where: { address: address } });
    }

    async createUser(data: any) {
        const { prisma } = this.fastify;
        return await prisma.user.create({ data });
    }

    async find(id: number) {
        const { prisma } = this.fastify;
        return await prisma.user.findUnique({ where: { id_user: id } });
    }

    async syncSocialPlatforms(platform: any, data: any) {
        const { prisma } = this.fastify;

        return await prisma.user.update({
            where: { id_user: data.id_user },
            data: {
                [platform]: data
            }
        });
    }
}


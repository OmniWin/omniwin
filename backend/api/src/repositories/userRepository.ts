import { FastifyInstance } from 'fastify';

export class UserRepository {
    fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }

    async findByAddress(address: string, select: Record<string, boolean> | null = null) {
        const { prisma } = this.fastify;

        const queryOptions: any = {
            where: { address: address },
        };

        if (select) {
            queryOptions.select = select;
        }

        return await prisma.user.findUnique(queryOptions);
    }

    async createUser(data: any) {
        const { prisma } = this.fastify;
        return await prisma.user.create({ data });
    }

    async find(id: number) {
        const { prisma } = this.fastify;
        return await prisma.user.findUnique({ where: { id_user: id } });
    }

    async syncSocialPlatforms(platform: any, data: any, address: string) {
        const { prisma } = this.fastify;

        return await prisma.user.update({
            where: { address: address },
            data: {
                [platform]: data
            }
        });
    }

    async findBy(field: string, value: any) {
        const { prisma } = this.fastify;
        return await prisma.user.findFirst({ where: { [field]: value } });
    }

    async updateUser(address: string, data: any) {
        const { prisma } = this.fastify;
        return await prisma.user.update({ where: { address: address }, data });
    }

    async getUserByReferralCode(referralCode: string) {
        const { prisma } = this.fastify;
        return await prisma.user.findFirst({ where: { referral_code: referralCode } });
    }

    async exists(address: string) {
        const { prisma } = this.fastify;
        return await prisma.user.findUnique({ where: { address: address } });
    }
}


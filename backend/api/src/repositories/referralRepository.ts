import { FastifyInstance } from "fastify";

export class ReferralRepository {
  fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  public create = async (referralData: any) => {
    const { prisma } = this.fastify;

    const referral = await prisma.referral.create({
      data: referralData,
    });
    return referral;
  };

  public findByCode = async (referralCode: string) => {
    const { prisma } = this.fastify;

    const referral = await prisma.user.findUnique({
      where: {
        referralCode: referralCode,
      },
    });
    return referral;
  };
}

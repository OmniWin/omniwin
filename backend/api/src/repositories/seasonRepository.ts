import { FastifyInstance } from 'fastify';

export class SeasonRepository {
    fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }

    async fetchSeason(end_date: Date, limit: number) {
        const { prisma } = this.fastify;

        let rawQuery = `SELECT 
                            Season.id,
                            Season.name,
                            Season.sub_title,
                            Season.description,
                            Season.start_date,
                            Season.end_date,
                            Season.xp_limit,
                            Season.created_at,
                            Season.updated_at
                        FROM Season
                        WHERE Season.end_date > ? LIMIT ?`;

        const queryParams = [end_date, limit];

        console.log("rawQuery", rawQuery);
        console.log("queryParams", queryParams);

        const season = await prisma.$queryRawUnsafe(rawQuery, ...queryParams) as any;

        return { season };
    }
}
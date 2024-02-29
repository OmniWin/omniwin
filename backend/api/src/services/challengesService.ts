import { SeasonRepository } from '../repositories/seasonRepository';
import { FastifyInstance } from 'fastify';

export class ChallengesService {
    private seasonRepository: SeasonRepository;
    constructor(private fastify: FastifyInstance) {
        this.seasonRepository = new SeasonRepository(this.fastify);
    }

    async fetchSeason(end_date: Date, limit: number) {
        const fetchedSeason = await this.seasonRepository.fetchSeason(end_date, limit);
        console.log(fetchedSeason);
        return fetchedSeason;
    }
}
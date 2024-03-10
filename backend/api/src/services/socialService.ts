import { UserRepository } from '../repositories/userRepository';
import { FastifyInstance } from 'fastify';

export class SocialService {
    private userRepository: UserRepository;
    constructor(private fastify: FastifyInstance) {
        this.userRepository = new UserRepository(this.fastify);
    }

    async find(id: number) {
        return await this.userRepository.find(id);
    }

    async syncSocialPlatforms(platform: any, data: any) {
        return await this.userRepository.syncSocialPlatforms(platform, data);
    }

}
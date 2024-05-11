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

    async findBy(field: string, value: any) {
        return await this.userRepository.findBy(field, value);
    }

    async syncSocialPlatforms(platform: any, data: any, address: string) {
        return await this.userRepository.syncSocialPlatforms(platform, data, address);
    }

}
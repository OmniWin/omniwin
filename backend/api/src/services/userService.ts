import { UserRepository } from '../repositories/userRepository';
import { FastifyInstance } from 'fastify';

export class UserService {
    private userRepository: UserRepository;
    constructor(private fastify: FastifyInstance) {
        this.userRepository = new UserRepository(this.fastify);
    }

    async findOrCreateUser(data: any) {
        let user = await this.userRepository.findByAddress(data.address);
        if (!user) {
            user = await this.userRepository.createUser(data);
        }
        return user;
    }

    async createUser(data: any) {
        return await this.userRepository.createUser(data);
    }

    async fetchUserSettings(address: string) {
        return await this.userRepository.findByAddress(address, {
            address: true,
            username: true,
            // avatar: true,
            email: true,
            twitter: true,
            discord: true,
            telegram: true,
            description: true,
        });
    }

    async getUserByReferralCode(referralCode: string) {
        return await this.userRepository.getUserByReferralCode(referralCode);
    }

    async exists(address: string) {
        return await this.userRepository.exists(address);
    }

}
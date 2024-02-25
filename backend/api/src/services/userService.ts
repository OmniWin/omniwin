import { UserRepository } from '../repositories/userRepository';
import { FastifyInstance } from 'fastify';

export class UserService {
    private userRepository: UserRepository;
    constructor(private fastify: FastifyInstance) {
        this.userRepository = new UserRepository(this.fastify);
    }
    

    async findOrCreateUser(data: any) {
        let user = await this.userRepository.findUser(data.address);
        if (!user) {
            user = await this.userRepository.createUser(data);
        }
        return user;
    }

}
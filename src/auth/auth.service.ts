import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { Repository } from 'typeorm';
import { User } from './models/user.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository : Repository<UserEntity>
    ){}
    async create(user : User):Promise<User>{
        return await this.userRepository.save(user);
    }
    async findOneByEmail(email:string):Promise<User>{
        const user = await this.userRepository.findOne({where:{email}})
        console.log('User in service ', user.email)
        
        return user
    }

    async findOneBy(condition ) {
        const user = await this.userRepository.findOne(condition );
        console.log(user)
        if (!user) {
            throw new NotFoundException('User not found');
        }
        console.log('User in service ', user.id);
        return user;
    }
    
    
}

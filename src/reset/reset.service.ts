import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetEntity } from './reset.entity';
import { Repository } from 'typeorm';
import { Reset } from './reser.interface';

@Injectable()
export class ResetService {
    constructor(
        @InjectRepository(ResetEntity) private readonly resetRepository : Repository<ResetEntity>
    ){}

    async create(reset : Reset):Promise<Reset>{
        return await this.resetRepository.save(reset);
    }
    async findOne(condition):Promise<Reset>{
        return await this.resetRepository.findOne(condition)
    }
    async findOneByToken(token: string): Promise<Reset | undefined> {
        console.log('token',token)
        return await this.resetRepository.findOne({ where: { token } });
    }
}

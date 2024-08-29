import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateThirdPartyDto } from './dto/create-third-party.dto';
import { ThirdPartyEntity } from './entities/third-party.entity';

@Injectable()
export class ThirdPartyService {
  constructor(
    @InjectRepository(ThirdPartyEntity)
    private readonly thirdPartyRepository: Repository<ThirdPartyEntity>,
  ) {}

  async create(createThirdPartyDto: CreateThirdPartyDto): Promise<ThirdPartyEntity> {
    const thirdParty = this.thirdPartyRepository.create(createThirdPartyDto);
    return this.thirdPartyRepository.save(thirdParty);
  }

  async findThirdPartiesByUserId(userId: string): Promise<ThirdPartyEntity[]> {
    return this.thirdPartyRepository.find({
      where: { user: { user_id: userId } },
      relations: ['user'],
      select: {
        user: {
          user_id: true,
          user_name: true,
        },
      },
    });
  }

  async findAll(): Promise<ThirdPartyEntity[]> {
    return this.thirdPartyRepository.find();
  }
}
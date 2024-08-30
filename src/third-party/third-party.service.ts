import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateThirdPartyDto } from './dto/create-third-party.dto';
import { ThirdPartyEntity } from './entities/third-party.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { NameValidate } from 'src/common/utils/name.validate';

@Injectable()
export class ThirdPartyService {
  constructor(
    @InjectRepository(ThirdPartyEntity)
    private readonly thirdPartyRepository: Repository<ThirdPartyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createThirdPartyDto: CreateThirdPartyDto): Promise<ThirdPartyEntity> {
    const { user_id, third_party_name } = createThirdPartyDto;
    NameValidate.getInstance().getValidName(third_party_name);

    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const thirdParty = this.thirdPartyRepository.create({
      third_party_name,
      user,
    });

    await this.thirdPartyRepository.save(thirdParty);
    return this.thirdPartyRepository
      .createQueryBuilder('thirdParty')
      .leftJoinAndSelect('thirdParty.user', 'user')
      .select([
        'thirdParty',
        'user.user_id',
        'user.user_name',
      ])
      .where('thirdParty.third_party_id = :id', { id: thirdParty.third_party_id })
      .getOne();
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
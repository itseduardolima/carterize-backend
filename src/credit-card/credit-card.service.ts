import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditCardEntity } from './entities/credit-card.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CreditCardService {
  constructor(
    @InjectRepository(CreditCardEntity)
    private readonly creditCardRepository: Repository<CreditCardEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createCreditCardDto: CreateCreditCardDto): Promise<CreditCardEntity> {
    const { user_id, ...cardData } = createCreditCardDto;

    const user = await this.userRepository.findOneBy({ user_id });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    const creditCard = this.creditCardRepository.create({ ...cardData, user }); 
    return this.creditCardRepository.save(creditCard);
  }

  async findAll() {
    return this.creditCardRepository.find();
  }

  async findCardsByUserId(userId: string): Promise<CreditCardEntity[]> {
    return this.creditCardRepository.find({
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
  

  async findOne(id: string) {
    return this.creditCardRepository.findOne({ where: { card_id: id } });
  }

  async update(id: string, updateCreditCardDto: UpdateCreditCardDto) {
    await this.creditCardRepository.update(id, updateCreditCardDto);
    return this.creditCardRepository.findOne({ where: { card_id: id } });
  }

  async remove(id: string) {
    await this.creditCardRepository.delete(id);
    return { deleted: true };
  }
}
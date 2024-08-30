import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditCardEntity } from './entities/credit-card.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreditCardValidate } from 'src/common/utils/card.validate';

@Injectable()
export class CreditCardService {
  constructor(
    @InjectRepository(CreditCardEntity)
    private readonly creditCardRepository: Repository<CreditCardEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(
    createCreditCardDto: CreateCreditCardDto,
  ): Promise<CreditCardEntity> {
    const {
      user_id,
      bank_name,
      card_holder_name,
      last_four_digits,
      credit_limit,
    } = createCreditCardDto;

    CreditCardValidate.getInstance().validateBankName(bank_name);
    CreditCardValidate.getInstance().validateCardHolderName(card_holder_name);
    CreditCardValidate.getInstance().validateLastFourDigits(last_four_digits);
    CreditCardValidate.getInstance().validateCreditLimit(credit_limit);

    const user = await this.userRepository.findOneBy({ user_id });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const creditCard = this.creditCardRepository.create({
      ...createCreditCardDto,
      user,
      available_limit: credit_limit,
    });

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
    const {
      user_id,
      bank_name,
      card_holder_name,
      last_four_digits,
      credit_limit,
    } = updateCreditCardDto;

    CreditCardValidate.getInstance().validateBankName(bank_name);
    CreditCardValidate.getInstance().validateCardHolderName(card_holder_name);
    CreditCardValidate.getInstance().validateLastFourDigits(last_four_digits);
    CreditCardValidate.getInstance().validateCreditLimit(credit_limit);

    const creditCard = await this.creditCardRepository.findOne({
      where: { card_id: id },
    });
    if (!creditCard) {
      throw new NotFoundException(`Credit Card with ID ${id} not found`);
    }

    if (user_id) {
      const user = await this.userRepository.findOneBy({ user_id });
      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }
      creditCard.user = user;
    }
    if (bank_name) creditCard.bank_name = bank_name;
    if (card_holder_name) creditCard.card_holder_name = card_holder_name;
    if (last_four_digits) creditCard.last_four_digits = last_four_digits;
    if (credit_limit) creditCard.credit_limit = credit_limit;

    return this.creditCardRepository.save(creditCard);
  }

  async remove(id: string) {
    await this.creditCardRepository.delete(id);
    return { deleted: true };
  }
}

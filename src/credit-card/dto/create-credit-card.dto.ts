import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreditCardEntity } from '../entities/credit-card.entity';

export class CreateCreditCardDto extends OmitType(CreditCardEntity, ['card_id', 'createdAt', 'updatedAt']) {
  @ApiProperty()
  bank_name: string;

  @ApiProperty()
  card_holder_name: string;

  @ApiProperty()
  last_four_digits: string;

  @ApiProperty()
  credit_limit: number;

  @ApiProperty()
  user_id: string;
}
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ExpenseEntity } from '../entities/expense.entity';

export class CreateExpenseDto extends OmitType(ExpenseEntity, ['expense_id', 'createdAt']) {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  category_id: number;

  @ApiProperty()
  credit_card_id: string;

  @ApiProperty({ required: false })
  third_party_id?: string;

  @ApiProperty()
  is_third_party: boolean;
}

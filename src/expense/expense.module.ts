import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { ExpenseEntity } from './entities/expense.entity';
import { CreditCardEntity } from 'src/credit-card/entities/credit-card.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { ThirdPartyEntity } from 'src/third-party/entities/third-party.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpenseEntity,
      CreditCardEntity,
      CategoryEntity,
      ThirdPartyEntity,
    ]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}

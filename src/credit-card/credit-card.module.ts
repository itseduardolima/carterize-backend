import { Module } from '@nestjs/common';
import { CreditCardService } from './credit-card.service';
import { CreditCardController } from './credit-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCardEntity } from './entities/credit-card.entity';
import { UsersModule } from 'src/users/users.module';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCardEntity, UserEntity]), UsersModule],
  controllers: [CreditCardController],
  providers: [CreditCardService],
})
export class CreditCardModule {}

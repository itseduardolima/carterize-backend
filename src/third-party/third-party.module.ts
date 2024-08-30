import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartyEntity } from './entities/third-party.entity';
import { ThirdPartyService } from './third-party.service';
import { ThirdPartyController } from './third-party.controller';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThirdPartyEntity, UserEntity])],
  controllers: [ThirdPartyController],
  providers: [ThirdPartyService],
})
export class ThirdPartyModule {}

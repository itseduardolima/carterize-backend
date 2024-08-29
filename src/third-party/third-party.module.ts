import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartyEntity } from './entities/third-party.entity';
import { ThirdPartyService } from './third-party.service';
import { ThirdPartyController } from './third-party.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ThirdPartyEntity])],
  controllers: [ThirdPartyController],
  providers: [ThirdPartyService],
})
export class ThirdPartyModule {}

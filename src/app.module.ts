import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import * as cors from 'cors';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './config/database/database-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
      inject: [DatabaseConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

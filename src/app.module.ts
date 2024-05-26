import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { RecordsModule } from './records/records.module';
import { TagsModule } from './tags/tags.module';
import { TokensModule } from './tokens/tokens.module';
import { TestMiddleware } from './middleware/test.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGOOSE_URI),
    UsersModule,
    RecordsModule,
    TagsModule,
    TokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//        consumer.apply(TestMiddleware)
//        .forRoutes('');
//   }
// }
export class AppModule {};
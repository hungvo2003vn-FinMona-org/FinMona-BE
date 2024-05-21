import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { UsersModule } from 'src/users/users.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './entities/token.entity';
import { UserSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: 'Token', schema: TokenSchema },
      { name: 'User', schema: UserSchema}
    ])
  ],
  controllers: [],
  providers: [TokensService],
})
export class TokensModule {}

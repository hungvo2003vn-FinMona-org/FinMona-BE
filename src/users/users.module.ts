import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { RecordSchema } from 'src/records/entities/record.entity';
import { TagSchema } from 'src/tags/entities/tag.entity';
import { PassThrough } from 'stream';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../auth/jwt.strategy';
import { TokenSchema } from 'src/tokens/entities/token.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('ACCESS_TOKEN_KEY'),
          signOptions: {
            expiresIn: config.get<string | number>('ACCESS_TOKEN_EXPIRES_TIME')
          }
        };
      }
    })
    ,
    MongooseModule.forFeature([
      { name: 'Record', schema: RecordSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Tag', schema: TagSchema },
      { name: 'Token', schema: TokenSchema }
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, TokensService],
  exports: [JwtStrategy, PassportModule]
})
export class UsersModule {}

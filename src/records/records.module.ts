import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from 'src/tags/entities/tag.entity';
import { RecordSchema } from './entities/record.entity';
import { UserSchema } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: 'Record', schema: RecordSchema },
      { name: 'Tag', schema: TagSchema },
      { name: 'User', schema: UserSchema },
    ])
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}

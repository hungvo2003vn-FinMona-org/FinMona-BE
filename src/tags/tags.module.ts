import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagSchema } from './entities/tag.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordSchema } from 'src/records/entities/record.entity';
import { UserSchema } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: 'Record', schema: RecordSchema },
      { name: 'Tag', schema: TagSchema },
      { name: 'User', schema: UserSchema }
    ])
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}

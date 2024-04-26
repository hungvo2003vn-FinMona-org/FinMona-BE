import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagSchema } from './entities/tag.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordSchema } from 'src/records/entities/record.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Record', schema: RecordSchema },
      { name: 'Tag', schema: TagSchema }
    ])
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}

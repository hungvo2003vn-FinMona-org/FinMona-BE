import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TagDocument } from './entities/tag.entity';
import { TagResponseDTO } from './dto/tag.response.dto';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    @InjectModel('Tag') private tagModel: Model<TagDocument>
  ) {}

  async addTag(requestDTO: CreateTagDto): Promise<any> {
    try {
      const newTag = new this.tagModel();
      newTag.icon = requestDTO.icon;
      newTag.title = requestDTO.title;
      if (requestDTO.type == 'Category' || requestDTO.type == 'Money Source') {
        newTag.type = requestDTO.type;
      } else {
        {
          throw new HttpException(
            'Error while creating new tag',
            HttpStatus.BAD_REQUEST,
          )
        }
      }
      const tag = newTag.save();
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Tag created successfully'
      };
    } catch (error) {
      throw new HttpException(
        'Error while creating new tag',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async findAllTag(): Promise<Array<TagResponseDTO>> {
    try {
      const tags = await this.tagModel.find().exec();
      return tags.map(TagResponseDTO.from);
    } catch (error) {
      throw new HttpException('Error fetching tags', HttpStatus.BAD_REQUEST);
    }
  }

  async updateTagById(id: string, requestDTO: UpdateTagDto): Promise<any> {
    try {
      const _id = new Types.ObjectId(id);

      const updateTag = await this.tagModel.findByIdAndUpdate(_id, requestDTO).exec();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Tag updated successfully'
      };

    } catch (error) {
      throw new HttpException('Error updating Tag', HttpStatus.BAD_REQUEST);
    }
  }


  async deleteTag(id: string): Promise<any> {
    try {
      const _id = new Types.ObjectId(id);
      const tagDeleted = await this.tagModel.findByIdAndDelete(_id).exec();
      return {
        statusCode: HttpStatus.OK,
        message: 'Tag $tagDeleted.title deleted'
      }
    } catch (error) {
      throw new HttpException('Error deleting tag', HttpStatus.BAD_REQUEST);
    }
  }
}

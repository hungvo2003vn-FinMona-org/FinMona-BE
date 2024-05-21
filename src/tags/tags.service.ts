import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag, TagDocument } from './entities/tag.entity';
import { TagResponseDTO } from './dto/tag.response.dto';
import { UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    @InjectModel('Tag') private tagModel: Model<TagDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>
  ) {}

  async addDefaultTag(requestDTO: CreateTagDto): Promise<any> {
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
      newTag.isDefault = true;
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


  async addUserTag(id: string, requestDTO: CreateTagDto): Promise<any> {
    try {
      const newTag = new this.tagModel();
      newTag.icon = requestDTO.icon;
      newTag.title = requestDTO.title;
      newTag.type = requestDTO.type;

      newTag.isDefault = false;
      const _userId = new Types.ObjectId(id);
      const user = await this.userModel.findById(_userId).exec();
      newTag.user = user;

      newTag.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Record created successfully'
      };
    } catch (error) {
      throw new HttpException('Error creating new tags', HttpStatus.BAD_REQUEST);
    }
  }

  async findDefaultTag(): Promise<Array<TagResponseDTO>> {
    try {
      const tags = await this.tagModel.find({ isDefault: true });
      return tags.map(TagResponseDTO.from);
    } catch (error) {
      throw new HttpException('Error fetching Tags', HttpStatus.BAD_REQUEST);
    }
  }

  async findUserTag( id: string ): Promise<Array<TagResponseDTO>> {
    try {
      const _userId = new Types.ObjectId(id);
      const tags = await this.tagModel.find({ $or: [{isDefault: true}, {user: _userId}] });
      return tags.map(TagResponseDTO.from);
    } catch (error) {
      throw new HttpException('Error fetching Tags', HttpStatus.BAD_REQUEST);
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

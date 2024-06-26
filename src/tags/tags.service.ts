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
      const testIfTagHasExist = await this.tagModel.findOne({ isDefault: true, title: requestDTO.title });
      if (testIfTagHasExist) {
        throw new HttpException(
          'Default Tag Name has existed',
          HttpStatus.BAD_REQUEST,
        )
      }

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
      const _userId = new Types.ObjectId(id);

      const testIfTagHasExist = await this.tagModel.findOne({ user: _userId, isDefault: false, title: requestDTO.title });
      if (testIfTagHasExist) {
        throw new HttpException(
          'User Tag Name has existed',
          HttpStatus.BAD_REQUEST,
        )
      }

      const newTag = new this.tagModel();
      newTag.icon = requestDTO.icon;
      newTag.title = requestDTO.title;
      newTag.type = requestDTO.type;

      newTag.isDefault = false;
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

  async findTagByName(id: string, tagName: string, type: string): Promise<TagResponseDTO> {
    try {
      const tag = await this.tagModel.findOne({ title: tagName, type: type }).exec();

      return TagResponseDTO.from(tag);
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

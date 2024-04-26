import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './entities/user.entity';
import UserResponseDTO from './dto/user.response.dto';
import { Model, Types } from 'mongoose';
import { RecordDocument } from 'src/records/entities/record.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Record') private recordModel: Model<RecordDocument>
  ) {}

  async addUser(requestDTO: CreateUserDto): Promise<any> {
    try {
      const newUser = new this.userModel();
      newUser.name = requestDTO.name;
      newUser.email = requestDTO.email;
      newUser.password = requestDTO.password;
      newUser.avatar = requestDTO.avatar;

      const user = await newUser.save();
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully'
      };

    } catch (error) {
      throw new HttpException(
        'Error while creating new user',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async findAllUsers(): Promise<Array<UserResponseDTO>> {
    try {
      const users = await this.userModel.find().exec();
      return users.map(UserResponseDTO.from);
    } catch (error) {
      throw new HttpException('Error fetching users', HttpStatus.BAD_REQUEST);
    }
  }

  async findUserById(id: string): Promise<UserResponseDTO> {
    try {
      const _id = new Types.ObjectId(id);
      const user = await this.userModel.findById(_id).exec();
      return UserResponseDTO.from(user);
    } catch (error) {
      throw new HttpException('Error fetching user', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserById(id: string, requestDTO: UpdateUserDto): Promise<any> {
    try {
      const _id = new Types.ObjectId(id);

      const updateUser = await this.userModel.findByIdAndUpdate(_id, requestDTO).exec();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User updated successfully'
      };

    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  

  async deleteUser(id: string): Promise<any> {
    try {
      const _id = new Types.ObjectId(id);
      const userDeleted = await this.userModel.findByIdAndDelete(_id).exec();
      return {
        statusCode: HttpStatus.OK,
        message: 'User $userDeleted.name deleted'
      }
    } catch (error) {
      throw new HttpException('Error deleting user', HttpStatus.BAD_REQUEST);
    }
  }
}

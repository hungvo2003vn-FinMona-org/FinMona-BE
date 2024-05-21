import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './entities/user.entity';
import UserResponseDTO from './dto/user.response.dto';
import { Model, Types } from 'mongoose';
import { RecordDocument } from 'src/records/entities/record.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from 'src/tokens/tokens.service';
import { CreateTokenDto } from 'src/tokens/dto/create-token.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Record') private recordModel: Model<RecordDocument>,
    private jwtService: JwtService,
    private tokenService: TokensService
  ) {}

  async signIn(requestDTO: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = requestDTO;

    const user = await this.userModel.findOne({ email: email, password: password });
    
    if (!user) {
      throw new UnauthorizedException("Invalid email or password")
    }
    
    let { token, expiredAt } = await this.tokenService.checkIfUserHasToken(user._id.toString());

    var current = new Date();
    // console.log(a);
    // console.log(a > expiredAt);

    if (token) {
      if(current < expiredAt) {
        return { token };
      } else {
        const tryDelete = await this.tokenService.deleteToken(token);
        if (tryDelete) {
          token = this.jwtService.sign({ id: user._id });
          var date = new Date();
          date.setDate(date.getDate() + 3); // 3 days
          const tmp = await this.tokenService.saveToken(
            {
              token: token,
              expiredAt: date,
              user: user
            }
          );
          return { token };
        } 
      }
    } else { 
      token = this.jwtService.sign({ id: user._id });
      var date = new Date();
      date.setDate(date.getDate() + 3); // 3 days
      const tmp = await this.tokenService.saveToken(
        {
          token: token,
          expiredAt: date,
          user: user
        }
      );
      return { token };
     }
  }

  async addUser(requestDTO: CreateUserDto): Promise<any> {
    try {
      const emailIsValidOrNot = await this.userModel.find({ email: requestDTO.email });
      if (emailIsValidOrNot.length != 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email has been used'
        };
      }
      const newUser = new this.userModel();
      newUser.name = requestDTO.name;
      newUser.email = requestDTO.email;
      newUser.password = requestDTO.password;
      if (!(requestDTO.avatar === undefined)) {
        newUser.avatar = requestDTO.avatar;
      } else {
        newUser.avatar = "default";
      }


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
        message: `User ${userDeleted.name} deleted`
      }
    } catch (error) {
      throw new HttpException('Error deleting user', HttpStatus.BAD_REQUEST);
    }
  }
}

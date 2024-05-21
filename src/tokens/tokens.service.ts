import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TokenDocument } from './entities/token.entity';
import { UserDocument } from 'src/users/entities/user.entity';
import { Type } from 'class-transformer';

@Injectable()
export class TokensService {

  constructor(
    @InjectModel('Token') private tokenModel:Model<TokenDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>
  ) {}

  async saveToken(createTokenDto: CreateTokenDto): Promise<boolean> {
    try {
      const newToken = new this.tokenModel();
      newToken.token = createTokenDto.token;
      newToken.expiredAt = createTokenDto.expiredAt;
      newToken.user = createTokenDto.user;

      newToken.save();

      return true;
    } catch (error) { 
        return false;
    }
  }

  async checkIfUserHasToken(id: string): Promise<{ token: string, expiredAt: Date }> {
    const _userId = new Types.ObjectId(id);
    const user = await this.tokenModel.findOne({ user: _userId }).exec();
    if (!user) {
      return { token: null, expiredAt: null };
    } 
    return { token: user.token, expiredAt: user.expiredAt };
  }

  async deleteToken(token: string): Promise<any> {
    try {
      const tmp = await this.tokenModel.findOneAndDelete({ token: token });
      return true;
    } catch(error) {
      return false;
    }
  }
}

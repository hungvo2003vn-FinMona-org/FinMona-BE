import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RecordDocument } from './entities/record.entity';
import { TagDocument } from 'src/tags/entities/tag.entity';
import RecordResponseDTO from './dto/record.response.dto';
import { UserDocument } from 'src/users/entities/user.entity';
import * as moment from "moment";
import { Type } from 'class-transformer';

@Injectable()
export class RecordsService {
  private readonly logger = new Logger(RecordsService.name);

  constructor(
    @InjectModel('Record') private recordModel: Model<RecordDocument>,
    @InjectModel('Tag') private tagModel: Model<TagDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>
  ) {}
/*
  async addNewRecord(requestDTO: CreateRecordDto): Promise<any> {
    try {
      const newRecord = new this.recordModel();
      newRecord.isIncome = requestDTO.isIncome;
      newRecord.repeat = requestDTO.repeat;
      newRecord.amount = requestDTO.amount;
      newRecord.description = requestDTO.description;
      newRecord.dateRepeat = requestDTO.dateRepeat;

      newRecord.dateCreated = new Date().toISOString().slice(0, 10);

      const category = await this.tagModel.findOne({ title: requestDTO.category, type: "Category" }).exec();
      const moneySource = await this.tagModel.findOne({ title: requestDTO.moneySource, type: "Money Source" }).exec();

      newRecord.category = category;
      newRecord.moneySource = moneySource;

      newRecord.save();
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Record created successfully'
      };

    } catch (error) {
      throw new HttpException(
        'Error while creating new record',
        HttpStatus.BAD_REQUEST,
      )
    }
  }
*/
  async addNewRecordWithUserInfo(id: string, requestDTO: CreateRecordDto): Promise<any> {
    try {
      const newRecord = new this.recordModel();
      newRecord.isIncome = requestDTO.isIncome;
      newRecord.amount = requestDTO.amount;
      newRecord.description = requestDTO.description;

      newRecord.dateCreated = moment().format("DD-MM-YYYY").toString();

      const category = await this.tagModel.findOne({ title: requestDTO.category, type: "Category" }).exec();
      if (!category) {
        return new HttpException(
          'Category Tag not Found',
          HttpStatus.BAD_REQUEST,
        )
      }
      const moneySource = await this.tagModel.findOne({ title: requestDTO.moneySource, type: "Money Source" }).exec();
      if (!moneySource) {
        return new HttpException(
          'Money Source Tag not Found',
          HttpStatus.BAD_REQUEST,
        )
      }

      newRecord.category = category;
      newRecord.moneySource = moneySource;

      const _userId = new Types.ObjectId(id);
      const user = await this.userModel.findById(_userId).exec();
      newRecord.user = user;

      newRecord.save();
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Record created successfully'
      };

    } catch (error) {
      throw new HttpException(
        'Error while creating record',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async findAllRecord(): Promise<Array<RecordResponseDTO>> {
    try {
      const records = await this.recordModel.find().exec();
      const res = records.map(RecordResponseDTO.from);
      for (var item of res){
        const convertCategory = (await this.tagModel.findById(item.category)).title;
        const convertMoneySource = (await this.tagModel.findById(item.moneySource)).title;

        item.category = convertCategory;
        item.moneySource = convertMoneySource;
      }

      return res;
    } catch (error) {
      throw new HttpException('Error fetching records', HttpStatus.BAD_REQUEST);
    }
  }

  async findAllRecordByUserId(id: string): Promise<Array<RecordResponseDTO>> {
    try {
      const userId = new Types.ObjectId(id);
      const records = await this.recordModel.find({ user: userId }).exec();
      const res = records.map(RecordResponseDTO.from);
      for (var item of res){
        const convertCategory = (await this.tagModel.findById(item.category)).title;
        const convertMoneySource = (await this.tagModel.findById(item.moneySource)).title;

        item.category = convertCategory;
        item.moneySource = convertMoneySource;
      }

      return res;
    } catch (error) {
      throw new HttpException('Error fetching record', HttpStatus.BAD_REQUEST);
    }
  }


  async filterRecordsByDate(id: string, date: string): Promise<Array<RecordResponseDTO>> {
    try {
      const userId = new Types.ObjectId(id);
      const records = await this.recordModel.find({ user: userId, dateCreated: date }).exec();
      const res = records.map(RecordResponseDTO.from);

      for (var item of res){
        const convertCategory = (await this.tagModel.findById(item.category)).title;
        const convertMoneySource = (await this.tagModel.findById(item.moneySource)).title;

        item.category = convertCategory;
        item.moneySource = convertMoneySource;
      }

      return res;
    } catch (error) {
      throw new HttpException('Error fetching record', HttpStatus.BAD_REQUEST);
    }
  }

  async filterRecordsByTime(id: string, startDate: string, endDate: string): Promise<Array<RecordResponseDTO>> {
    try {
      const userId = new Types.ObjectId(id);
      const records = await this.recordModel.find({ user: userId }).exec();

      const _startDate = moment(startDate, "DD-MM-YYYY");
      const _endDate = moment(endDate, "DD-MM-YYYY");

      const res = records.filter((record, index) => {
        // console.log(index);
        // console.log(moment(record.dateCreated, "DD-MM-YYYY").isAfter(_startDate));
        // console.log(moment(record.dateCreated, "DD-MM-YYYY").isBefore(_endDate));
        return ((moment(record.dateCreated, "DD-MM-YYYY").isAfter(_startDate) && moment(record.dateCreated, "DD-MM-YYYY").isBefore(_endDate)) || (record.dateCreated === startDate) || (record.dateCreated === endDate));
      });

      const resConvert = res.map(RecordResponseDTO.from);

      for (var item of resConvert ){
        const convertCategory = (await this.tagModel.findById(item.category)).title;
        const convertMoneySource = (await this.tagModel.findById(item.moneySource)).title;

        item.category = convertCategory;
        item.moneySource = convertMoneySource;
      }

      return resConvert ;
    } catch(error) {
      throw new HttpException('Error fetching record', HttpStatus.BAD_REQUEST);
    }
  }

  async filterRecordsByCategory(id: string, categoryName: string): Promise<Array<RecordResponseDTO>> {
    try {
      const userId = new Types.ObjectId(id);
      const categoryId = await this.tagModel.findOne({ title: categoryName, type: 'Category' });
      // console.log(categoryId);
      // console.log(categoryName);
      const records = await this.recordModel.find({ user: userId, category: categoryId._id });

      const res = records.map(RecordResponseDTO.from);

      for (var item of res){
        const convertCategory = (await this.tagModel.findById(item.category)).title;
        const convertMoneySource = (await this.tagModel.findById(item.moneySource)).title;

        item.category = convertCategory;
        item.moneySource = convertMoneySource;
      }

      return res;

    } catch(error) {
      console.log(error);
      throw new HttpException('Error fetching record', HttpStatus.BAD_REQUEST);
    }
  }

  async filterRecordsByMoneySource(id: string, moneySourceName: string): Promise<Array<RecordResponseDTO>> {
    try {
      const userId = new Types.ObjectId(id);
      const categoryId = await this.tagModel.findOne({ title: moneySourceName, type: 'Money Source' });
      // console.log(categoryId);
      // console.log(moneySourceName);
      const records = await this.recordModel.find({ user: userId, moneySource: categoryId._id });

      const res = records.map(RecordResponseDTO.from);

      for (var item of res){
        const convertCategory = (await this.tagModel.findById(item.category)).title;
        const convertMoneySource = (await this.tagModel.findById(item.moneySource)).title;

        item.category = convertCategory;
        item.moneySource = convertMoneySource;
      }

      return res;

    } catch(error) {
      console.log(error);
      throw new HttpException('Error fetching record', HttpStatus.BAD_REQUEST);
    }
  }

  async updateRecord(id: string, requestDTO: UpdateRecordDto): Promise<any> {
    try {
      const userId = new Types.ObjectId(id);

      const category = await this.tagModel.findOne({ title: requestDTO.category, type: "Category" }).exec();
      if (!category) {
        return new HttpException(
          'Category Tag not Found',
          HttpStatus.BAD_REQUEST,
        )
      }
      const moneySource = await this.tagModel.findOne({ title: requestDTO.moneySource, type: "Money Source" }).exec();
      if (!moneySource) {
        return new HttpException(
          'Money Source Tag not Found',
          HttpStatus.BAD_REQUEST,
        )
      }
      requestDTO.category = category;
      requestDTO.moneySource = moneySource;

      const updateRecord = await this.recordModel.findByIdAndUpdate(userId, requestDTO).exec();
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Record updated successfully'
      };
        
    } catch(error) {
      throw new HttpException('Error updating record', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteRecord(id: string): Promise<any> {
    try {
      const _id = new Types.ObjectId(id);
      const recordDeleted = await this.recordModel.findByIdAndDelete(_id).exec();
      return {
        statusCode: HttpStatus.OK,
        message: 'Record deleted'
      }
    } catch (error) {
      throw new HttpException('Error deleting record', HttpStatus.BAD_REQUEST);
    }
  }
}

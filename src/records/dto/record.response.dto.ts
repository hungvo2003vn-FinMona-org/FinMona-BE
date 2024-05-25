import mongoose, { Model } from "mongoose";
import { RecordDocument } from "../entities/record.entity"
import { Injectable } from "@nestjs/common";
import { TagDocument } from "src/tags/entities/tag.entity";
@Injectable()
export default class RecordResponseDTO {
    constructor(
        public id: string,
        public isIncome: boolean,
        public amount: number,
        public category: any,
        public moneySource: any,
        public dateCreated: string,
        public user: any,
        public description?: string,
    ) {}

    static from = ({
        _id,
        isIncome,
        amount,
        category,
        moneySource,
        dateCreated,
        user,
        description,
    }: RecordDocument): RecordResponseDTO => 
        new RecordResponseDTO(_id.toHexString(), isIncome, amount, category, moneySource, dateCreated, user, description);
}
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { TagDocument } from "src/tags/entities/tag.entity";
import { UserDocument } from "src/users/entities/user.entity";

export type RecordDocument = Record & Document<Types.ObjectId>

@Schema({ collection: 'records' })
export class Record {

    @Prop({ required: true, type: String })
    dateCreated: string;

    @Prop({ required: true, type: Boolean })
    isIncome: boolean;

    @Prop({ required: true, type: Boolean })
    repeat: boolean;

    @Prop({ required: true, type: Number })
    amount: number;

    @Prop({ type: Types.ObjectId, ref: 'Tag' })
    category: TagDocument;

    @Prop({ type: Types.ObjectId, ref: 'Tag' })
    moneySource: TagDocument;

    @Prop({ type: Types.ObjectId, ref: 'User'})
    user: UserDocument;

    @Prop({ type: String })
    description: string;

    @Prop({ type: String })
    dateRepeat: string;

}

export const RecordSchema = SchemaFactory.createForClass(Record);

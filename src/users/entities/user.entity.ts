
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { RecordDocument } from "src/records/entities/record.entity";

export type UserDocument = User & Document<Types.ObjectId>;

@Schema({ collection: 'users'})
export class User {

    @Prop({ required: true, type: String})
    name: string;

    @Prop({ required: true, type: String})
    email: string;

    @Prop({ required: true, type: String})
    password: string;

    @Prop({ type: String })
    avatar: string;

    @Prop({ type: [{ type: Types.ObjectId }] })
    records: Array<RecordDocument>;

}

export const UserSchema = SchemaFactory.createForClass(User);
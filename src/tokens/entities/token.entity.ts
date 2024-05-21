import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { UserDocument } from "src/users/entities/user.entity";

export type TokenDocument = Token & Document<Types.ObjectId>

@Schema({ collection: 'tokens' })
export class Token {

    @Prop({ required: true, type: String })
    token: string;

    @Prop({ required: true, type: Date })
    expiredAt: Date;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: UserDocument;

}

export const TokenSchema = SchemaFactory.createForClass(Token);



import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { Types, Document } from "mongoose";
import { UserDocument, UserSchema } from "src/users/entities/user.entity";

export type TagDocument = Tag & Document<Types.ObjectId>

@Schema({ collection: 'tags' })
export class Tag {

    @Prop({ required: true, type: String })
    icon: string;

    @Prop({ required: true, type: String })
    title: string;

    @Prop({ required: true, type: String})
    type: string;

    @Prop({ required: true, type: Boolean })
    isDefault: boolean;

    @Prop({ type: Types.ObjectId, ref:'User' })
    user: UserDocument;

}

export const TagSchema = SchemaFactory.createForClass(Tag);
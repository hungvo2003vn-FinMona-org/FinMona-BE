import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

export type TagDocument = Tag & Document<Types.ObjectId>

@Schema({ collection: 'tags' })
export class Tag {

    @Prop({ required: true, type: String })
    icon: string;

    @Prop({ required: true, type: String })
    title: string;

    @Prop({ required: true, type: String})
    type: string;

}

export const TagSchema = SchemaFactory.createForClass(Tag);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PromptDocument = Prompt & Document;

@Schema({ timestamps: true })
export class Prompt {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  liked: boolean;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);

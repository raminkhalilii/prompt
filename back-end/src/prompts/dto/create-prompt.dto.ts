import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreatePromptDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsOptional()
  readonly createdBy: MongooseSchema.Types.ObjectId;
}
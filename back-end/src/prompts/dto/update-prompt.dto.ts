import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class UpdatePromptDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  readonly createdBy?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  readonly liked?: boolean;
}

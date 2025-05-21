import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prompt, PromptDocument } from './schemas/prompt.schema';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { Types } from 'mongoose';

@Injectable()
export class PromptsService {
  constructor(
    @InjectModel(Prompt.name) private promptModel: Model<PromptDocument>
  ) {}

  async create(createPromptDto: CreatePromptDto): Promise<Prompt> {
    const createdPrompt = new this.promptModel(createPromptDto);
    return createdPrompt.save();
  }

  async findAll(userId?: string): Promise<Prompt[]> {
    // If userId is provided, filter prompts by user
    const filter = userId ? { createdBy: userId } : {};
    return this.promptModel.find(filter).exec();
  }

  async findOne(id: string, userId?: string): Promise<Prompt> {
    const prompt = await this.promptModel.findById(id).exec();
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID "${id}" not found`);
    }

    // If userId is provided, check if the prompt belongs to the user
    if (userId && prompt.createdBy && prompt.createdBy.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to access this prompt');
    }

    return prompt;
  }

  async update(id: string, updatePromptDto: UpdatePromptDto, userId?: string): Promise<Prompt> {
    // If userId is provided, check if the prompt belongs to the user
    if (userId) {
      const prompt = await this.promptModel.findById(id).exec();
      if (!prompt) {
        throw new NotFoundException(`Prompt with ID "${id}" not found`);
      }

      if (prompt.createdBy && prompt.createdBy.toString() !== userId) {
        throw new ForbiddenException('You do not have permission to update this prompt');
      }
    }

    const updatedPrompt = await this.promptModel
        .findByIdAndUpdate(id, updatePromptDto, { new: true })
        .exec();
    if (!updatedPrompt) {
      throw new NotFoundException(`Prompt with ID "${id}" not found`);
    }
    return updatedPrompt;
  }

  async remove(id: string, userId?: string): Promise<Prompt> {
    // If userId is provided, check if the prompt belongs to the user
    if (userId) {
      const prompt = await this.promptModel.findById(id).exec();
      if (!prompt) {
        throw new NotFoundException(`Prompt with ID "${id}" not found`);
      }

      if (prompt.createdBy && prompt.createdBy.toString() !== userId) {
        throw new ForbiddenException('You do not have permission to delete this prompt');
      }
    }

    const deletedPrompt = await this.promptModel.findByIdAndDelete(id).exec();
    if (!deletedPrompt) {
      throw new NotFoundException(`Prompt with ID "${id}" not found`);
    }
    return deletedPrompt;
  }

  async toggleLike(id: string, userId?: string): Promise<Prompt> {
    // If userId is provided, check if the prompt belongs to the user
    if (userId) {
      const prompt = await this.promptModel.findById(id).exec();
      if (!prompt) {
        throw new NotFoundException(`Prompt with ID "${id}" not found`);
      }

      if (prompt.createdBy && prompt.createdBy.toString() !== userId) {
        throw new ForbiddenException('You do not have permission to like/unlike this prompt');
      }
    }

    const prompt = await this.promptModel.findById(id).exec();
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID "${id}" not found`);
    }

    // Toggle the liked status
    prompt.liked = !prompt.liked;

    // Save the updated prompt
    return prompt.save();
  }
}

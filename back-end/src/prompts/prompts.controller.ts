import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPromptDto: CreatePromptDto, @Request() req) {
    // Add the user ID to the prompt
    const promptWithUser = {
      ...createPromptDto,
      createdBy: req.user.userId
    };
    return this.promptsService.create(promptWithUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    // Only return prompts created by the authenticated user
    return this.promptsService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.promptsService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updatePromptDto: UpdatePromptDto,
    @Request() req
  ) {
    return this.promptsService.update(id, updatePromptDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.promptsService.remove(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-like')
  toggleLike(@Param('id') id: string, @Request() req) {
    return this.promptsService.toggleLike(id, req.user.userId);
  }
}

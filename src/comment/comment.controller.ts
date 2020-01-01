import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  Get,
  Delete,
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { AuthGuard } from 'src/utils/auth.guard';
import { User } from 'src/user/user.decorator';
import { CommentDTO } from './comment.dto';

@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Post('idea/:id')
  @UseGuards(new AuthGuard())
  create(
    @Body() data: CommentDTO,
    @Param('id') idea: string,
    @User('id') user: string,
  ) {
    return this.commentService.create(user, idea, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  delete(@Param('id') id, @User('id') user: string) {
    return this.commentService.delete(id, user);
  }

  @Get('idea/:id')
  getCommentsByIdea(@Param('id') id) {
    return this.commentService.getCommentsByIdea(id);
  }

  @Get('user/:id')
  getCommentsByUser(@Param('id') id) {
    return this.commentService.getCommentsByUser(id);
  }
}

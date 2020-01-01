import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  UseGuards,
  Query,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';
import { ValidationPipe } from 'src/utils/validation.pipe';
import { AuthGuard } from 'src/utils/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('api/idea')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  findAll(@Query('page') page) {
    return this.ideaService.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ideaService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(new AuthGuard())
  create(@Body() data: Partial<IdeaDto>, @User('id') userId: string) {
    return this.ideaService.create(data, userId);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  update(
    @Param('id') id: string,
    @Body() data: Partial<IdeaDto>,
    @User('id') userId: string,
  ) {
    return this.ideaService.update(id, userId, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  delete(@Param('id') id: string, @User('id') userId: string) {
    return this.ideaService.delete(id, userId);
  }

  @Put('bookmark/:id')
  @UseGuards(new AuthGuard())
  bookmark(@Param('id') id: string, @User('id') userId: string) {
    return this.ideaService.bookmark(id, userId);
  }

  @Put('unbookmark/:id')
  @UseGuards(new AuthGuard())
  unBookmark(@Param('id') id: string, @User('id') userId: string) {
    return this.ideaService.unBookmark(id, userId);
  }

  @Put('upvote/:id')
  @UseGuards(new AuthGuard())
  upVote(@Param('id') id: string, @User('id') userId: string) {
    return this.ideaService.upVote(id, userId);
  }

  @Put('downvote/:id')
  @UseGuards(new AuthGuard())
  downVote(@Param('id') id: string, @User('id') userId: string) {
    return this.ideaService.downVote(id, userId);
  }
}

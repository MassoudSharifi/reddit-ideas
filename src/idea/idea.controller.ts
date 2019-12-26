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
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';
import { ValidationPipe } from 'src/utils/validation.pipe';
import { AuthGuard } from 'src/utils/auth.guard';

@Controller('api/idea')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  findAll() {
    return this.ideaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ideaService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(new AuthGuard)
  create(@Body() data: Partial<IdeaDto>) {
    return this.ideaService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<IdeaDto>) {
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ideaService.delete(id);
  }
}

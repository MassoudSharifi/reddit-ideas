import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaService } from './idea.service';
import { IdeaEntity } from './idea.entity';
import { IdeaController } from './idea.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity])],
  providers: [IdeaService],
  controllers: [IdeaController],
})
export class IdeaModule {}

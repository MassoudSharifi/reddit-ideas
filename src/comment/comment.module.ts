import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentEntity } from './comment.entity';
import { UserEntity } from 'src/user/user.entity';
import { IdeaEntity } from 'src/idea/idea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, UserEntity, IdeaEntity])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}

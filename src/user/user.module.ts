import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { CommentService } from 'src/comment/comment.service';
import { CommentEntity } from 'src/comment/comment.entity';
import { IdeaEntity } from 'src/idea/idea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CommentEntity, IdeaEntity])],
  providers: [UserService, UserResolver, CommentService],
  controllers: [UserController],
})
export class UserModule {}

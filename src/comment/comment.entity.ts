import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';

import { UserEntity } from 'src/user/user.entity';
import { IdeaEntity } from 'src/idea/idea.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  comment: string;

  @CreateDateColumn()
  created: Date;

  @ManyToOne(
    _ => UserEntity,
    author => author.id,
    { cascade: true },
  )
  @JoinTable()
  author: UserEntity;

  @ManyToOne(
    _ => IdeaEntity,
    idea => idea.comments,
  )
  idea: IdeaEntity;
}

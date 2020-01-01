import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from 'src/comment/comment.entity';

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;

  @ManyToOne(
    _ => UserEntity,
    author => author.id,
  )
  author: UserEntity;

  @ManyToMany(_ => UserEntity, { cascade: true })
  @JoinTable()
  upVotes: UserEntity[];

  @ManyToMany(_ => UserEntity, { cascade: true })
  @JoinTable()
  downVotes: UserEntity[];

  @OneToMany(
    _ => CommentEntity,
    comment => comment.idea,
    { cascade: true },
  )
  comments: CommentEntity[];
}

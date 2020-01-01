import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentEntity } from './comment.entity';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity)
    private readonly ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(comment: CommentEntity) {
    return {
      ...comment,
      idea: comment.idea && comment.idea.idea,
      author: comment.author && comment.author.username,
    };
  }

  async findAll() {
    const comments = await this.commentRepository.find({
      relations: ['idea', 'author'],
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async create(userId, ideaId, data) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
    const comment = await this.commentRepository.save({
      ...data,
      idea,
      author: user,
    });

    return this.toResponseObject(comment);
  }

  async delete(id, authorId) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) {
      throw new HttpException("Comment doesn't exist", HttpStatus.NOT_FOUND);
    }
    if (comment.author.id !== authorId) {
      throw new HttpException(
        'You are unauthorized to delete this comment',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.commentRepository.delete(comment);
  }

  async getCommentsByIdea(id) {
    const comments = await this.commentRepository.find({
      where: { idea: { id } },
      relations: ['author', 'idea'],
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async getCommentsByUser(id) {
    const comments = await this.commentRepository.find({
      where: { author: { id } },
      relations: ['author', 'idea'],
    });

    return comments.map(comment => this.toResponseObject(comment));
  }
}

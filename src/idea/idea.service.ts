import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IdeaEntity } from './idea.entity';
import { IdeaDto } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(idea) {
    return { ...idea, user: idea.user && idea.user.toResponseObject(false) };
  }

  async findAll() {
    const ideas = await this.ideaRepository.find({ relations: ['user'] });
    return ideas.map(idea => this.toResponseObject(idea));
  }

  async findOne(id: string) {
    const idea = await this.ideaRepository.findOne(
      { id },
      { relations: ['user'] },
    );

    return idea && this.toResponseObject(idea);
  }

  async create(data: Partial<IdeaDto>, userId) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = await this.ideaRepository.save({ ...data, user });

    return this.toResponseObject(idea);
  }

  async update(id: string, userId: string, data: Partial<IdeaDto>) {
    const idea = await this.findOne(id);
    if (idea.user.id !== userId) {
      throw new HttpException(
        'Unauthorized operation',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.ideaRepository.update(id, data);
  }

  async delete(id: string, userId: string) {
    const idea = await this.findOne(id);
    if (idea.user.id !== userId) {
      throw new HttpException(
        'Unauthorized operation',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.ideaRepository.delete(id);
  }
}

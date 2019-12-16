import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IdeaEntity } from './idea.entity';
import { IdeaDto } from './idea.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
  ) {}

  async findAll() {
    return await this.ideaRepository.find();
  }

  async findOne(id: string) {
    return await this.ideaRepository.findOne({ id });
  }

  async create(data: Partial<IdeaDto>) {
    return await this.ideaRepository.save(data);
  }

  async update(id: string, data: Partial<IdeaDto>) {
    return await this.ideaRepository.update(id, data);
  }

  async delete(id: string) {
    return await this.ideaRepository.delete(id);
  }
}

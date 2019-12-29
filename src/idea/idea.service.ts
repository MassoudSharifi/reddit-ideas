import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IdeaEntity } from './idea.entity';
import { IdeaDto } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';
import { Votes } from 'src/utils/votes.enum';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(idea) {
    return {
      ...idea,
      author: idea.author && idea.author.toResponseObject(false),
    };
  }

  private async ensureOwnership(ideaId, userId) {
    const idea = await this.findOne(ideaId);
    if (idea.author.id !== userId) {
      throw new HttpException(
        'Unauthorized operation',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
      idea[vote].filter(voter => voter.id === user.id).length > 0
    ) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
      await this.ideaRepository.save(idea);
    } else if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
      idea[vote].push(user);
      await this.ideaRepository.save(idea);
    } else {
      throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
    }

    return idea;
  }

  async findAll() {
    const ideas = await this.ideaRepository.find({ relations: ['author'] });
    return ideas.map(idea => this.toResponseObject(idea));
  }

  async findOne(id: string) {
    const idea = await this.ideaRepository.findOne(
      { id },
      { relations: ['author'] },
    );

    if (!idea) {
      throw new HttpException("Idea doesn't exits", HttpStatus.NOT_FOUND);
    }

    return idea && this.toResponseObject(idea);
  }

  async create(data: Partial<IdeaDto>, userId) {
    const author = await this.userRepository.findOne({ where: { id: userId } });
    const idea = await this.ideaRepository.save({ ...data, author });

    return this.toResponseObject(idea);
  }

  async update(id: string, userId: string, data: Partial<IdeaDto>) {
    this.ensureOwnership(id, userId);
    return await this.ideaRepository.update(id, data);
  }

  async delete(id: string, userId: string) {
    this.ensureOwnership(id, userId);
    return await this.ideaRepository.delete(id);
  }

  async bookmark(id: string, userId: string) {
    const idea = await this.findOne(id);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (
      user.bookmarks &&
      user.bookmarks.filter(({ id }) => id === idea.id).length
    ) {
      throw new HttpException('Already bookmarked', HttpStatus.NOT_ACCEPTABLE);
    } else {
      user.bookmarks.push(idea);
      return await this.userRepository.save(user);
    }
  }

  async unBookmark(id: string, userId: string) {
    const idea = await this.findOne(id);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });
    const newBookmarkedIdeas =
      user.bookmarks && user.bookmarks.filter(({ id }) => id !== idea.id);

    if (
      newBookmarkedIdeas &&
      newBookmarkedIdeas.length === user.bookmarks.length
    ) {
      throw new HttpException(
        "The idea wasn't be bookmarked",
        HttpStatus.NOT_ACCEPTABLE,
      );
    } else {
      user.bookmarks = newBookmarkedIdeas;
      return await this.userRepository.save(user);
    }
  }

  async upVote(id: string, userId: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upVotes', 'downVotes'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    idea = await this.vote(idea, user, Votes.UP);

    return idea;
  }

  async downVote(id: string, userId: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upVotes', 'downVotes'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    idea = await this.vote(idea, user, Votes.DOWN);

    return idea;
  }
}

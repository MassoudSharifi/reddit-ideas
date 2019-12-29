import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UserDTO, UserRegisterDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserRegisterDTO[]> {
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
    });
    return users.map(user => user.toResponseObject());
  }

  async login(data: UserDTO): Promise<UserRegisterDTO> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['ideas', 'bookmarks'],
    });

    if (!user || !(await user.isValidPassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }

  async register(data: UserDTO): Promise<UserRegisterDTO> {
    const { username } = data;
    const isUserExists = await this.userRepository.findOne({
      where: { username },
    });
    if (isUserExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    try {
      const user = await this.userRepository.save(data);
      return user.toResponseObject();
    } catch {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

import { Controller, Body, Post, Get } from '@nestjs/common';

import { UserService } from './user.service';
import { UserDTO, UserRegisterDTO } from './user.dto';
import { UserEntity } from './user.entity';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('login')
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('register')
  register(@Body() data: UserDTO): Promise<UserRegisterDTO> {
    const entity = Object.assign(new UserEntity(), data);
    return this.userService.register(entity);
  }
}

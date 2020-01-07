import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Context,
  Mutation,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/auth.guard';
import { UserDTO } from './user.dto';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

  @Query()
  users() {
    return this.userService.findAll();
  }

  @Query()
  async user(@Args('username') username: string) {
    return await this.userService.findOne(username);
  }

  @ResolveProperty()
  async comments(@Parent() user) {
    const { id } = user;
    return this.commentService.getCommentsByUser(id);
  }

  @Query()
  @UseGuards(new AuthGuard())
  async whoami(@Context('user') user) {
    const { username } = user;
    return await this.userService.findOne(username);
  }

  @Mutation()
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const user: UserDTO = { username, password };
    return await this.userService.login(user);
  }

  @Mutation()
  async register(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const user: UserDTO = { username, password };
    return await this.userService.register(user);
  }
}

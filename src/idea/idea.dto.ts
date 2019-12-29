import { IsString } from 'class-validator';
import { UserEntity } from 'src/user/user.entity';

export class IdeaDto {
  @IsString()
  idea: string;

  @IsString()
  description: string;

  upVotes?: UserEntity[];

  downVotes?: UserEntity[];
}

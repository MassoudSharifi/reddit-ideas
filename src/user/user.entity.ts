import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserRegisterDTO } from './user.dto';

@Entity('user')
@Unique(['username'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  username: string;

  @Column('text')
  password: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(
    _ => IdeaEntity,
    idea => idea.user,
  )
  ideas: IdeaEntity[];

  @BeforeInsert()
  private async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async isValidPassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(withToken = true) {
    const { username, created, id } = this;
    let responseObject: UserRegisterDTO = {
      id,
      username,
      created,
    };

    if (withToken) {
      responseObject.token = this.token;
    }

    if (this.ideas) {
      responseObject.ideas = this.ideas;
    }

    return responseObject;
  }

  private get token(): string {
    const { id, username } = this;
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import User from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsernameCheckingService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async checkIfUserWithUsernameExists(username: string): Promise<User> {
    const user = await this.getUserByUsername(username);

    if (isNil(user)) {
      throw new NotFoundException('User with specified username not found.');
    }

    return user;
  }

  private async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();

    return user;
  }
}

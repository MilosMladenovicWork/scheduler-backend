import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register-user-request.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { Optional } from 'utility-types';

@Injectable()
export class RegisterUserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async registerUser({
    username,
    email,
    password,
  }: RegisterUserDto): Promise<Optional<User, 'password'>> {
    const hashedPassword = await this.hashPassword(password);

    const savedUser: Optional<User, 'password'> =
      await this.usersRepository.save(
        this.usersRepository.create({
          username,
          email,
          password: hashedPassword,
        }),
      );

    return savedUser;
  }

  async hashPassword(password: string): Promise<string> {
    const rounds = 10;
    const hash = await bcrypt.hash(password, rounds);
    return hash;
  }
}

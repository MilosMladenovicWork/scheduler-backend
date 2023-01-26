import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register-user-request.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/database/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Optional } from 'utility-types';
import { PgErrors } from 'src/database/types/pg-errors.enum';

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

    try {
      const savedUser: Optional<User, 'password'> =
        await this.usersRepository.save(
          this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
          }),
        );
      return savedUser;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if ((e.driverError.code = PgErrors.UNIQUE_CONSTRAINT_ERROR)) {
          throw new ConflictException('Username or email already exists');
        }
      }
      throw e;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const rounds = 10;
    const hash = await bcrypt.hash(password, rounds);
    return hash;
  }
}

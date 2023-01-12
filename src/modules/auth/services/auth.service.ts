import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { Optional } from 'utility-types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Optional<User, 'password'> | null> {
    const user = await this.usersRepository.findOne({
      select: { id: true, email: true, password: true, username: true },
      where: { email },
    });

    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.password);

      if (passwordMatches) {
        const userWithoutPassword: Optional<User, 'password'> = user;

        delete userWithoutPassword.password;

        return userWithoutPassword;
      }
    }
    return null;
  }

  async login({ userId, username }: { userId: string; username: string }) {
    const payload = { username, sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

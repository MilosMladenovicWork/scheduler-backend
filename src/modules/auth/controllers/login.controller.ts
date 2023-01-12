import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import User from 'src/database/entities/user.entity';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { LocalAuthGuard } from '../local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth/login')
export class LoginController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() { user }: Request & { user: User }) {
    return this.authService.login({
      userId: user.id,
      username: user.username,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async profile(@Request() { user }: Request & { user: User }) {
    return user;
  }
}

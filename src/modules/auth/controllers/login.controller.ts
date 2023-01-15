import { Controller, Post, UseGuards, Get } from '@nestjs/common';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import User from 'src/database/entities/user.entity';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { LocalAuthGuard } from '../local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth/login')
export class LoginController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@UserDecorator() user: User) {
    return this.authService.login({
      userId: user.id,
      username: user.username,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async profile(@UserDecorator() user: User) {
    return user;
  }
}

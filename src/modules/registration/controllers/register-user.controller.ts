import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import User from 'src/database/entities/user.entity';
import { RegisterUserDto } from '../dtos/register-user-request.dto';
import { RegisterUserService } from '../services/regiser-user.service';
import { Optional } from 'utility-types';

@Controller('register')
export class RegisterUserController {
  constructor(private readonly registerUserService: RegisterUserService) {}

  @Post()
  registerUser(
    @Body(ValidationPipe) registerUserDto: RegisterUserDto,
  ): Promise<Optional<User, 'password'>> {
    return this.registerUserService.registerUser(registerUserDto);
  }
}

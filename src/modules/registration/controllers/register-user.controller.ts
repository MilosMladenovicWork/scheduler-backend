import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import User from 'src/database/entities/user.entity';
import { RegisterUserDto } from '../dtos/register-user-request.dto';
import { RegisterUserService } from '../services/regiser-user.service';
import { Optional } from 'utility-types';
import { Response } from 'src/common/dtos/response.dto';

@Controller('register')
export class RegisterUserController {
  constructor(private readonly registerUserService: RegisterUserService) {}

  @Post()
  async registerUser(
    @Body(ValidationPipe) registerUserDto: RegisterUserDto,
  ): Promise<Response<Optional<User, 'password'>>> {
    return new Response(
      await this.registerUserService.registerUser(registerUserDto),
    );
  }
}

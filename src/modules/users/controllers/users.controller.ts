import {
  Controller,
  Get,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import { JwtUser } from 'src/modules/auth/types/jwt-user.type';
import { Response } from 'src/common/dtos/response.dto';
import User from 'src/database/entities/user.entity';
import { UserGettingService } from '../services/user-getting.service';
import { GetUserParamDto } from '../dtos/get-user-param.dto';

@Controller('users')
export class UsersController {
  constructor(private userGettingService: UserGettingService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getOne(
    @Param(ValidationPipe)
    getUserParamDto: GetUserParamDto,
    @UserDecorator() user: JwtUser,
  ): Promise<Response<User>> {
    const userData = await this.userGettingService.getOne({
      userId: user.userId,
      getUserParamDto,
    });

    return new Response(userData);
  }
}

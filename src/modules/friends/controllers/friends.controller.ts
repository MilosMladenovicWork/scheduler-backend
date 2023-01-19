import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import { JwtUser } from 'src/modules/auth/types/jwt-user.type';
import { ArrayResponse, Response } from 'src/common/dtos/response.dto';
import { FriendGettingService } from '../services/friend-getting.service';
import { GetFriendsQueryDto } from '../dtos/get-friends-query.dto';
import User from 'src/database/entities/user.entity';
import { GetFriendParamDto } from '../dtos/get-friend-param.dto';

@Controller('friends')
export class FriendsController {
  constructor(private friendGettingService: FriendGettingService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query(ValidationPipe)
    getFriendsQueryDto: GetFriendsQueryDto,
    @UserDecorator() user: JwtUser,
  ): Promise<ArrayResponse<User[]>> {
    const paginatedFriends = await this.friendGettingService.getAll({
      userId: user.userId,
      getFriendsQueryDto,
    });

    return new ArrayResponse(paginatedFriends.items, {
      pagination: { count: paginatedFriends.count },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getOne(
    @Param(ValidationPipe)
    getFriendParamDto: GetFriendParamDto,
    @UserDecorator() user: JwtUser,
  ): Promise<Response<User>> {
    const friendUser = await this.friendGettingService.getOne({
      userId: user.userId,
      getFriendParamDto,
    });

    return new Response(friendUser);
  }
}

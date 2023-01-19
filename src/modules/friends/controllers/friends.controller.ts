import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import { JwtUser } from 'src/modules/auth/types/jwt-user.type';
import { ArrayResponse } from 'src/common/dtos/response.dto';
import { FriendGettingService } from '../services/friend-getting.service';
import { GetFriendsQueryDto } from '../dtos/get-friends-query.dto';
import User from 'src/database/entities/user.entity';

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
    const paginatedRequests = await this.friendGettingService.getAll({
      userId: user.userId,
      getFriendsQueryDto,
    });

    return new ArrayResponse(paginatedRequests.items, {
      pagination: { count: paginatedRequests.count },
    });
  }
}

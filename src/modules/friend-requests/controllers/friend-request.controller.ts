import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import { JwtUser } from 'src/modules/auth/types/jwt-user.type';
import { SendFriendRequestDto } from '../dtos/send-friend-request.dto';
import { FriendRequestSendingService } from '../services/friend-request-sending.service';
import FriendRequest from 'src/database/entities/friend-request.entity';

@Controller('friend-request')
export class FriendRequestController {
  constructor(
    private friendRequestSendingService: FriendRequestSendingService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  send(
    @Body(ValidationPipe) sendFriendRequestDto: SendFriendRequestDto,
    @UserDecorator() user: JwtUser,
  ): Promise<FriendRequest> {
    return this.friendRequestSendingService.sendFriendRequest({
      userId: user.userId,
      sendFriendRequestDto,
    });
  }
}

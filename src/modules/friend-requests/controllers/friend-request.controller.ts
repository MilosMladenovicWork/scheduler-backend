import {
  Body,
  Controller,
  Param,
  Patch,
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
import { FriendRequestRespondingService } from '../services/friend-request-responding.service';
import { RespondToFriendRequestDto } from '../dtos/respond-to-friend-request.dto';
import { RespondToFriendRequestParamsDto } from '../dtos/respond-to-friend-request-params.dto';

@Controller('friend-request')
export class FriendRequestController {
  constructor(
    private friendRequestSendingService: FriendRequestSendingService,
    private friendRequestRespondingService: FriendRequestRespondingService,
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

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/response')
  update(
    @Param(ValidationPipe)
    respondToFriendRequestParamsDto: RespondToFriendRequestParamsDto,
    @Body(ValidationPipe) respondToFriendRequestDto: RespondToFriendRequestDto,
    @UserDecorator() user: JwtUser,
  ): Promise<FriendRequest> {
    return this.friendRequestRespondingService.respondToFriendRequest({
      userId: user.userId,
      respondToFriendRequestDto,
      respondToFriendRequestParamsDto,
    });
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { UpdateApprovedFriendRequestParamsDto } from '../dtos/update-approved-friend-request-params.dto';
import { UpdateApprovedFriendRequestDto } from '../dtos/update-approved-friend-request.dto';
import { FriendRequestUpdatingService } from '../services/friend-request-updating.service';
import { GetFriendRequestsQueryDto } from '../dtos/get-friend-requests-query.dto';
import { FriendRequestGettingService } from '../services/friend-request-getting.service';
import { ArrayResponse } from 'src/common/dtos/response.dto';

@Controller('friend-requests')
export class FriendRequestController {
  constructor(
    private friendRequestSendingService: FriendRequestSendingService,
    private friendRequestRespondingService: FriendRequestRespondingService,
    private friendRequestUpdatingService: FriendRequestUpdatingService,
    private friendRequestGettingService: FriendRequestGettingService,
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

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updateApproved(
    @Param(ValidationPipe)
    updateApprovedFriendRequestParamsDto: UpdateApprovedFriendRequestParamsDto,
    @Body(ValidationPipe)
    updateApprovedFriendRequestDto: UpdateApprovedFriendRequestDto,
    @UserDecorator() user: JwtUser,
  ): Promise<FriendRequest> {
    return this.friendRequestUpdatingService.updateApprovedFriendRequest({
      userId: user.userId,
      updateApprovedFriendRequestDto,
      updateApprovedFriendRequestParamsDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query(ValidationPipe)
    getFriendRequestsQueryDto: GetFriendRequestsQueryDto,
    @UserDecorator() user: JwtUser,
  ): Promise<ArrayResponse<FriendRequest[]>> {
    const paginatedRequests =
      await this.friendRequestGettingService.getAllPending({
        userId: user.userId,
        getFriendRequestsQueryDto,
      });

    return new ArrayResponse(paginatedRequests.items, {
      pagination: { count: paginatedRequests.count },
    });
  }
}

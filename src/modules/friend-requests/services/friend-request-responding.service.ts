import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FriendRequest from 'src/database/entities/friend-request.entity';
import { Repository } from 'typeorm';
import { RespondToFriendRequestParamsDto } from '../dtos/respond-to-friend-request-params.dto';
import { RespondToFriendRequestDto } from '../dtos/respond-to-friend-request.dto';
import { FriendRequestStatusEnum } from '../types/friend-request-status.enum';
import { FriendRequestCheckingService } from './friend-request-checking.service';

@Injectable()
export class FriendRequestRespondingService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    private friendRequestCheckingService: FriendRequestCheckingService,
  ) {}

  async respondToFriendRequest({
    userId,
    respondToFriendRequestDto: { status },
    respondToFriendRequestParamsDto: { id },
  }: {
    userId: string;
    respondToFriendRequestDto: RespondToFriendRequestDto;
    respondToFriendRequestParamsDto: RespondToFriendRequestParamsDto;
  }): Promise<FriendRequest> {
    const friendRequest =
      await this.friendRequestCheckingService.checkIfFriendRequestByIdAndReceiverUserIdExists(
        { id, userId },
      );

    if (friendRequest.status === FriendRequestStatusEnum.APPROVED) {
      throw new BadRequestException('Friend request is already approved.');
    }

    if (friendRequest.status === FriendRequestStatusEnum.REJECTED) {
      throw new BadRequestException('Friend request is already rejected.');
    }

    const newFriendRequest = await this.friendRequestRepository.save({
      id,
      status,
    });

    return newFriendRequest;
  }
}

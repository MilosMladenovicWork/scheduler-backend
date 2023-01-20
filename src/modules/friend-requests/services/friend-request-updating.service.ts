import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FriendRequest from 'src/database/entities/friend-request.entity';
import { Repository } from 'typeorm';
import { UpdateApprovedFriendRequestParamsDto } from '../dtos/update-approved-friend-request-params.dto';
import { UpdateApprovedFriendRequestDto } from '../dtos/update-approved-friend-request.dto';
import { FriendRequestStatusEnum } from '../types/friend-request-status.enum';
import { FriendRequestCheckingService } from './friend-request-checking.service';

@Injectable()
export class FriendRequestUpdatingService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    private friendRequestCheckingService: FriendRequestCheckingService,
  ) {}
  async updateApprovedFriendRequest({
    userId,
    updateApprovedFriendRequestDto: { status },
    updateApprovedFriendRequestParamsDto: { id },
  }: {
    userId: string;
    updateApprovedFriendRequestDto: UpdateApprovedFriendRequestDto;
    updateApprovedFriendRequestParamsDto: UpdateApprovedFriendRequestParamsDto;
  }): Promise<FriendRequest> {
    const friendRequest =
      await this.friendRequestCheckingService.checkIfFriendRequestByIdAndReceiverOrSenderUserIdExists(
        { id, userId },
      );

    if (friendRequest.status !== FriendRequestStatusEnum.APPROVED) {
      throw new BadRequestException(
        "Can't change status of not approved friend request.",
      );
    }

    const updatedFriendRequest = await this.friendRequestRepository.save({
      id,
      status,
    });

    return updatedFriendRequest;
  }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import FriendRequest from 'src/database/entities/friend-request.entity';
import { UsernameCheckingService } from 'src/modules/username/services/username-checking.service';
import { Repository } from 'typeorm';
import { SendFriendRequestDto } from '../dtos/send-friend-request.dto';
import { FriendRequestStatusEnum } from '../types/friend-request-status.enum';
import { FriendRequestCheckingService } from './friend-request-checking.service';

@Injectable()
export class FriendRequestSendingService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    private friendRequestCheckingService: FriendRequestCheckingService,
    private usernameCheckingService: UsernameCheckingService,
  ) {}

  async sendFriendRequest({
    userId,
    sendFriendRequestDto: { username },
  }: {
    userId: string;
    sendFriendRequestDto: SendFriendRequestDto;
  }): Promise<FriendRequest> {
    const { id: friendUserId } =
      await this.usernameCheckingService.checkIfUserWithUsernameExists(
        username,
      );

    const friendRequest =
      await this.friendRequestCheckingService.getExistingFriendRequest({
        userId,
        friendUserId,
      });

    if (isNil(friendRequest)) {
      const newFriendRequestEntity = await this.friendRequestRepository.create({
        senderId: userId,
        receiverId: friendUserId,
        status: FriendRequestStatusEnum.PENDING,
      });

      const newFriendRequest = await this.friendRequestRepository.save(
        newFriendRequestEntity,
      );

      return newFriendRequest;
    }

    if (friendRequest.status === FriendRequestStatusEnum.REJECTED) {
      const newFriendRequest = await this.friendRequestRepository.save({
        id: friendRequest.id,
        senderId: userId,
        receiverId: friendUserId,
        status: FriendRequestStatusEnum.PENDING,
      });

      return newFriendRequest;
    }

    throw new ConflictException('Friend request already exists.');
  }
}

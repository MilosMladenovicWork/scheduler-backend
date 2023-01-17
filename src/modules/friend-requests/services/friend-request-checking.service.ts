import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import FriendRequest from 'src/database/entities/friend-request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendRequestCheckingService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async checkIfFriendRequestAlreadyExists({
    userId,
    friendUserId,
  }: {
    userId: string;
    friendUserId: string;
  }): Promise<void> {
    const friendRequest = await this.getExistingFriendRequest({
      userId,
      friendUserId,
    });

    if (!isNil(friendRequest)) {
      throw new ConflictException('Friend request already exists.');
    }
  }

  private async getExistingFriendRequest({
    userId,
    friendUserId,
  }: {
    userId: string;
    friendUserId: string;
  }): Promise<FriendRequest | null> {
    const friendRequest = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .where(
        '(friendRequest.senderId = :userId AND friendRequest.receiverId = :friendUserId)',
        { userId, friendUserId },
      )
      .orWhere(
        '(friendRequest.senderId = :friendUserId AND friendRequest.receiverId = :userId)',
        { userId, friendUserId },
      )
      .getOne();

    return friendRequest;
  }
}

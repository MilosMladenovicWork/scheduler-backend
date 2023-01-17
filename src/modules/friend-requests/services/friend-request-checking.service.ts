import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import FriendRequest from 'src/database/entities/friend-request.entity';
import { Brackets, Repository } from 'typeorm';
import { FriendRequestStatusEnum } from '../types/friend-request-status.enum';

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

  async checkIfFriendRequestsAreApproved({
    userId,
    otherUserIds,
  }: {
    userId: string;
    otherUserIds: string[];
  }): Promise<void> {
    for (const otherUserId of otherUserIds) {
      if (userId === otherUserId) {
        continue;
      }
      const friendRequest = await this.getApprovedFriendRequest({
        userId,
        otherUserId,
      });

      if (isNil(friendRequest)) {
        throw new ConflictException(
          'Friend request with one of the users is not approved.',
        );
      }
    }
  }

  private async getApprovedFriendRequest({
    userId,
    otherUserId,
  }: {
    userId: string;
    otherUserId: string;
  }): Promise<FriendRequest | null> {
    const friendRequest = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .where('friendRequest.status = :approvedFriendRequestStatus', {
        approvedFriendRequestStatus: FriendRequestStatusEnum.APPROVED,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(friendRequest.senderId = :userId AND friendRequest.receiverId = :otherUserId)',
            { userId, otherUserId },
          ).orWhere(
            '(friendRequest.senderId = :otherUserId AND friendRequest.receiverId = :userId)',
            { userId, otherUserId },
          );
        }),
      )
      .getOne();

    return friendRequest;
  }
}

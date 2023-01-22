import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import User from 'src/database/entities/user.entity';
import { FriendRequestStatusEnum } from 'src/modules/friend-requests/types/friend-request-status.enum';
import { Repository } from 'typeorm';
import { GetUserParamDto } from '../dtos/get-user-param.dto';

@Injectable()
export class UserGettingService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getOne({
    userId,
    getUserParamDto: { userId: friendUserId },
  }: {
    userId: string;
    getUserParamDto: GetUserParamDto;
  }): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.username'])
      .leftJoin(
        'user.sentFriendRequests',
        'sentFriendRequests',
        'sentFriendRequests.receiverId = :userId',
        { userId },
      )
      .leftJoin(
        'user.receivedFriendRequests',
        'receivedFriendRequests',
        'receivedFriendRequests.senderId = :userId',
        { userId },
      )
      .where('user.id = :friendUserId', { friendUserId })
      .andWhere(
        '((sentFriendRequests.status = :approvedFriendRequestStatus OR receivedFriendRequests.status = :approvedFriendRequestStatus) OR (sentFriendRequests.status = :pendingFriendRequestStatus OR receivedFriendRequests.status = :pendingFriendRequestStatus))',
        {
          approvedFriendRequestStatus: FriendRequestStatusEnum.APPROVED,
          pendingFriendRequestStatus: FriendRequestStatusEnum.PENDING,
        },
      )
      .getOne();

    if (isNil(user)) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}

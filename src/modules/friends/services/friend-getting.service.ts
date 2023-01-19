import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { Pagination } from 'src/common/types/pagination.type';
import User from 'src/database/entities/user.entity';
import { FriendRequestStatusEnum } from 'src/modules/friend-requests/types/friend-request-status.enum';
import { Repository } from 'typeorm';
import { GetFriendParamDto } from '../dtos/get-friend-param.dto';
import { GetFriendsQueryDto } from '../dtos/get-friends-query.dto';

@Injectable()
export class FriendGettingService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll({
    userId,
    getFriendsQueryDto: { skip, take },
  }: {
    userId: string;
    getFriendsQueryDto: GetFriendsQueryDto;
  }): Promise<Pagination<User>> {
    const [users, count] = await this.userRepository
      .createQueryBuilder('user')
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
      .where('user.id != :userId', { userId })
      .andWhere(
        '(sentFriendRequests.status = :approvedFriendRequestStatus OR receivedFriendRequests.status = :approvedFriendRequestStatus)',
        {
          approvedFriendRequestStatus: FriendRequestStatusEnum.APPROVED,
        },
      )
      .take(take)
      .skip(skip)
      .orderBy('user.username', 'DESC')
      .getManyAndCount();

    return { items: users, count };
  }

  async getOne({
    userId,
    getFriendParamDto: { userId: friendUserId },
  }: {
    userId: string;
    getFriendParamDto: GetFriendParamDto;
  }): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
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
        '(sentFriendRequests.status = :approvedFriendRequestStatus OR receivedFriendRequests.status = :approvedFriendRequestStatus)',
        {
          approvedFriendRequestStatus: FriendRequestStatusEnum.APPROVED,
        },
      )
      .getOne();

    if (isNil(user)) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}

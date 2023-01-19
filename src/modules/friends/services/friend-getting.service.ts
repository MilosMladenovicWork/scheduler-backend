import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/common/types/pagination.type';
import User from 'src/database/entities/user.entity';
import { FriendRequestStatusEnum } from 'src/modules/friend-requests/types/friend-request-status.enum';
import { Repository } from 'typeorm';

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
    getFriendsQueryDto: any;
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
}

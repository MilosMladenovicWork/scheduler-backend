import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/common/types/pagination.type';
import FriendRequest from 'src/database/entities/friend-request.entity';
import { Repository } from 'typeorm';
import { GetFriendRequestsQueryDto } from '../dtos/get-friend-requests-query.dto';
import { FriendRequestStatusEnum } from '../types/friend-request-status.enum';

@Injectable()
export class FriendRequestGettingService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async getAllPending({
    userId,
    getFriendRequestsQueryDto: { skip, take },
  }: {
    userId: string;
    getFriendRequestsQueryDto: GetFriendRequestsQueryDto;
  }): Promise<Pagination<FriendRequest>> {
    const [friendRequests, count] = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .where(
        '(friendRequest.receiverId = :userId OR friendRequest.senderId = :userId)',
        { userId },
      )
      .andWhere('friendRequest.status = :pendingFriendRequestStatus', {
        pendingFriendRequestStatus: FriendRequestStatusEnum.PENDING,
      })
      .orderBy('friendRequest.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .getManyAndCount();

    return { items: friendRequests, count };
  }
}

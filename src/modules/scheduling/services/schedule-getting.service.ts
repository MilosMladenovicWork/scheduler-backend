import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import Schedule from 'src/database/entities/schedule.entity';
import { FriendRequestCheckingService } from 'src/modules/friend-requests/services/friend-request-checking.service';
import { Repository } from 'typeorm';
import { ScheduleParticipantUserStatus } from '../constants/schedule-participant-user-status.enum';
import { GetSchedulesQueryDto } from '../dtos/get-schedules-query.dto';

@Injectable()
export class ScheduleGettingService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private friendRequestCheckingService: FriendRequestCheckingService,
  ) {}

  async getAll(
    userId: string,
    { from, to, userIds }: GetSchedulesQueryDto,
  ): Promise<Schedule[]> {
    await this.friendRequestCheckingService.checkIfFriendRequestsAreApproved({
      userId,
      otherUserIds: userIds,
    });

    const otherUserIds = userIds.filter((queryUserId) => queryUserId != userId);

    const shouldGetCurrentUserSchedules = userIds.length > otherUserIds.length;

    let currentUserSchedules: Schedule[] = [];

    if (shouldGetCurrentUserSchedules) {
      currentUserSchedules = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .select([
          'schedule.id',
          'schedule.startDate',
          'schedule.endDate',
          'schedule.title',
          'schedule.description',
        ])
        .leftJoin('schedule.scheduleCreatorUsers', 'scheduleCreatorUsers')
        .addSelect('scheduleCreatorUsers.userId')
        .leftJoin(
          'schedule.scheduleParticipantUsers',
          'scheduleParticipantUsers',
        )
        .addSelect('scheduleParticipantUsers.userId')
        .where('schedule.startDate >= :from', { from })
        .andWhere('schedule.startDate < :to', { to })
        .andWhere(
          '(scheduleParticipantUsers.userId = :userId OR scheduleCreatorUsers.userId = :userId)',
          { userId },
        )
        .andWhere('scheduleParticipantUsers.status IN (:...scheduleStatuses)', {
          scheduleStatuses: [
            ScheduleParticipantUserStatus.PENDING,
            ScheduleParticipantUserStatus.ACCEPTED,
          ],
        })
        .getMany();
    }

    let otherUserSchedules: Schedule[] = [];

    if (!isEmpty(otherUserIds)) {
      otherUserSchedules = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .select(['schedule.id', 'schedule.startDate', 'schedule.endDate'])
        .leftJoin('schedule.scheduleCreatorUsers', 'scheduleCreatorUsers')
        .leftJoin(
          'schedule.scheduleParticipantUsers',
          'scheduleParticipantUsers',
        )
        .where('schedule.startDate >= :from', { from })
        .andWhere('schedule.startDate < :to', { to })
        .andWhere(
          '(scheduleParticipantUsers.userId != :userId AND scheduleCreatorUsers.userId != :userId)',
          { userId },
        )
        .andWhere(
          '(scheduleParticipantUsers.userId IN (:...userIds) OR scheduleCreatorUsers.userId IN (:...userIds))',
          { userIds: otherUserIds },
        )
        .andWhere('scheduleParticipantUsers.status = :acceptedScheduleStatus', {
          acceptedScheduleStatus: ScheduleParticipantUserStatus.ACCEPTED,
        })
        .getMany();
    }

    return [...currentUserSchedules, ...otherUserSchedules];
  }
}

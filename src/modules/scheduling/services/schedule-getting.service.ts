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

    const currentUserSchedules = await this.getCurrentUserSchedules({
      from,
      to,
      currentUserId: userId,
      userIds,
    });

    const otherUserIds = userIds.filter((queryUserId) => queryUserId != userId);

    const otherUserSchedules = await this.getOtherUserSchedules({
      from,
      to,
      userId,
      otherUserIds,
    });

    return [...currentUserSchedules, ...otherUserSchedules];
  }

  async getCurrentUserSchedules({
    from,
    to,
    userIds,
    currentUserId,
  }: {
    from: Date;
    to: Date;
    userIds: string[];
    currentUserId: string;
  }) {
    const shouldGetCurrentUserSchedules = userIds.some(
      (userId) => userId === currentUserId,
    );

    let currentUserSchedules: Schedule[] = [];

    if (shouldGetCurrentUserSchedules) {
      const currentUserSchedulesWithIds = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .leftJoin('schedule.scheduleCreatorUsers', 'scheduleCreatorUsers')
        .leftJoin(
          'schedule.scheduleParticipantUsers',
          'scheduleParticipantUsers',
        )
        .where('schedule.startDate >= :from', { from })
        .andWhere('schedule.startDate < :to', { to })
        .andWhere('scheduleParticipantUsers.userId = :currentUserId', {
          currentUserId,
        })
        .andWhere('scheduleParticipantUsers.status IN (:...scheduleStatuses)', {
          scheduleStatuses: [
            ScheduleParticipantUserStatus.PENDING,
            ScheduleParticipantUserStatus.ACCEPTED,
          ],
        })
        .getMany();

      if (!isEmpty(currentUserSchedulesWithIds)) {
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
          .addSelect([
            'scheduleParticipantUsers.userId',
            'scheduleParticipantUsers.status',
          ])
          .where('schedule.id IN (:...scheduleIds)', {
            scheduleIds: currentUserSchedulesWithIds.map(({ id }) => id),
          })
          .getMany();
      }
    }
    return currentUserSchedules;
  }

  async getOtherUserSchedules({
    from,
    to,
    userId,
    otherUserIds,
  }: {
    from: Date;
    to: Date;
    userId: string;
    otherUserIds: string[];
  }) {
    let otherUserSchedules: Schedule[] = [];

    if (!isEmpty(otherUserIds)) {
      const otherSchedulesWithIds = await this.scheduleRepository
        .createQueryBuilder('schedule')
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
        .andWhere(
          `NOT EXISTS (SELECT * FROM "schedule_participant_user" spu LEFT JOIN "schedule" s ON spu."scheduleId" = s."id" WHERE spu."userId" = :userId AND s."id" = schedule.id AND spu."status" IN (:...currentUserParticipationStatuses))`,
          {
            userId,
            currentUserParticipationStatuses: [
              ScheduleParticipantUserStatus.PENDING,
              ScheduleParticipantUserStatus.ACCEPTED,
            ],
          },
        )
        .andWhere('scheduleParticipantUsers.status = :acceptedScheduleStatus', {
          acceptedScheduleStatus: ScheduleParticipantUserStatus.ACCEPTED,
        })
        .getMany();

      if (!isEmpty(otherSchedulesWithIds)) {
        otherUserSchedules = await this.scheduleRepository
          .createQueryBuilder('schedule')
          .select(['schedule.id', 'schedule.startDate', 'schedule.endDate'])
          .leftJoin('schedule.scheduleCreatorUsers', 'scheduleCreatorUsers')
          .leftJoin(
            'schedule.scheduleParticipantUsers',
            'scheduleParticipantUsers',
          )
          .where('schedule.id IN (:...scheduleIds)', {
            scheduleIds: otherSchedulesWithIds.map(({ id }) => id),
          })
          .getMany();
      }
    }

    return otherUserSchedules;
  }
}

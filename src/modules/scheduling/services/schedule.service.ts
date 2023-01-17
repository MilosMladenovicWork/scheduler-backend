import { Injectable } from '@nestjs/common';
import ScheduleCreatorUser from 'src/database/entities/schedule-creator-user.entity';
import ScheduleParticipantUser from 'src/database/entities/schedule-participant-user.entity';
import Schedule from 'src/database/entities/schedule.entity';
import { DataSource, EntityManager } from 'typeorm';
import { ScheduleParticipantUserStatus } from '../constants/schedule-participant-user-status.enum';
import { ScheduleDto } from '../dtos/schedule-request.dto';
import { scheduleDateRangeFormatter } from '../utils/schedule-date-range.formatter';
import { ScheduleCheckingService } from './schedule-checking.service';

@Injectable()
export class ScheduleService {
  constructor(
    private dataSource: DataSource,
    private scheduleCheckingService: ScheduleCheckingService,
  ) {}

  async schedule(
    userId: string,
    { userIds, scheduleStartDate, scheduleEndDate }: ScheduleDto,
  ): Promise<Schedule> {
    await this.scheduleCheckingService.checkIfApprovedScheduleForSpecificTimeFrameExists(
      { userIds, scheduleStartDate, scheduleEndDate },
    );

    return await this.dataSource.transaction(async (manager) => {
      const scheduleEntity = manager.getRepository(Schedule).create({
        dateRange: scheduleDateRangeFormatter(
          scheduleStartDate,
          scheduleEndDate,
        ),
        startDate: scheduleStartDate,
        endDate: scheduleEndDate,
      });

      const schedule = await manager
        .getRepository(Schedule)
        .save(scheduleEntity);

      await this.createAndSaveScheduleUsers({
        scheduleId: schedule.id,
        creatorUserId: userId,
        participantUserIds: userIds,
        entityManager: manager,
      });

      return schedule;
    });
  }

  private async createAndSaveScheduleUsers({
    participantUserIds,
    creatorUserId,
    scheduleId,
    entityManager,
  }: {
    participantUserIds: string[];
    creatorUserId: string;
    scheduleId: string;
    entityManager: EntityManager;
  }): Promise<void> {
    const scheduleParticipantUserEntities = [];

    for (const participantUserId of participantUserIds) {
      const scheduleParticipantUserStatus =
        creatorUserId === participantUserId
          ? ScheduleParticipantUserStatus.ACCEPTED
          : ScheduleParticipantUserStatus.PENDING;

      const scheduleParticipantUserEntity = entityManager
        .getRepository(ScheduleParticipantUser)
        .create({
          scheduleId: scheduleId,
          status: scheduleParticipantUserStatus,
          userId: participantUserId,
        });

      scheduleParticipantUserEntities.push(scheduleParticipantUserEntity);
    }

    const scheduleParticipantPromise = entityManager
      .getRepository(ScheduleParticipantUser)
      .save(scheduleParticipantUserEntities);

    const scheduleCreatorUserEntity = entityManager
      .getRepository(ScheduleCreatorUser)
      .create({
        scheduleId: scheduleId,
        userId: creatorUserId,
      });

    const scheduleCreatorUserPromise = entityManager
      .getRepository(ScheduleCreatorUser)
      .save(scheduleCreatorUserEntity);

    await Promise.all([scheduleParticipantPromise, scheduleCreatorUserPromise]);
  }
}

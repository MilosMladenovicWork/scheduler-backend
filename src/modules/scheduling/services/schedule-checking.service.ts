import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import ScheduleParticipantUser from 'src/database/entities/schedule-participant-user.entity';
import Schedule from 'src/database/entities/schedule.entity';
import { Repository } from 'typeorm';
import { ScheduleParticipantUserStatus } from '../constants/schedule-participant-user-status.enum';
import { scheduleDateRangeFormatter } from '../utils/schedule-date-range.formatter';

@Injectable()
export class ScheduleCheckingService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(ScheduleParticipantUser)
    private scheduleParticipantUserRepository: Repository<ScheduleParticipantUser>,
  ) {}

  async checkIfApprovedScheduleForSpecificTimeFrameExists({
    userIds,
    scheduleStartDate,
    scheduleEndDate,
  }: {
    userIds: string[];
    scheduleStartDate: Date;
    scheduleEndDate: Date;
  }): Promise<void> {
    const schedule = await this.getApprovedScheduleForSpecificTimeFrame({
      userIds,
      scheduleStartDate,
      scheduleEndDate,
    });

    if (!isNil(schedule)) {
      throw new ConflictException(`Approved schedule  already exists.`);
    }
  }

  private async getApprovedScheduleForSpecificTimeFrame({
    userIds,
    scheduleStartDate,
    scheduleEndDate,
  }: {
    userIds: string[];
    scheduleStartDate: Date;
    scheduleEndDate: Date;
  }): Promise<Schedule | null> {
    const schedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoin('schedule.scheduleParticipantUsers', 'scheduleParticipantUsers')
      .andWhere('scheduleParticipantUsers.userId IN (:...userIds)', { userIds })
      .andWhere('scheduleParticipantUsers.status = :approvedScheduleStatus', {
        approvedScheduleStatus: ScheduleParticipantUserStatus.ACCEPTED,
      })
      .andWhere('schedule.dateRange && :newScheduleDateRange', {
        newScheduleDateRange: scheduleDateRangeFormatter(
          scheduleStartDate,
          scheduleEndDate,
        ),
      })
      .getOne();

    return schedule;
  }

  async checkIfParticipantExistsByUserIdAndScheduleId({
    userId,
    scheduleId,
  }: {
    userId: string;
    scheduleId: string;
  }): Promise<ScheduleParticipantUser> {
    const scheduleParticipant = await this.getParticipantByUserIdAndScheduleId({
      userId,
      scheduleId,
    });

    if (isNil(scheduleParticipant)) {
      throw new NotFoundException(`Participant to schedule not found.`);
    }

    return scheduleParticipant;
  }

  private async getParticipantByUserIdAndScheduleId({
    userId,
    scheduleId,
  }: {
    userId: string;
    scheduleId: string;
  }): Promise<ScheduleParticipantUser | null> {
    const schedule = await this.scheduleParticipantUserRepository
      .createQueryBuilder('scheduleParticipantUser')
      .andWhere('scheduleParticipantUser.userId = :userId', { userId })
      .andWhere('scheduleParticipantUser.scheduleId = :scheduleId', {
        scheduleId,
      })
      .getOne();

    return schedule;
  }
}

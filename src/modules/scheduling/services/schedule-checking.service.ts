import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import Schedule from 'src/database/entities/schedule.entity';
import { Repository } from 'typeorm';
import { ScheduleParticipantUserStatus } from '../constants/schedule-participant-user-status.enum';
import { scheduleDateRangeFormatter } from '../utils/schedule-date-range.formatter';

@Injectable()
export class ScheduleCheckingService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async checkIfApprovedScheduleForSpecificTimeFrameExists({
    userId,
    scheduleStartDate,
    scheduleEndDate,
  }: {
    userId: string;
    scheduleStartDate: Date;
    scheduleEndDate: Date;
  }): Promise<void> {
    const schedule = await this.getApprovedScheduleForSpecificTimeFrame({
      userId,
      scheduleStartDate,
      scheduleEndDate,
    });

    if (!isNil(schedule)) {
      throw new ConflictException(
        `Approved schedule with id: ${schedule.id} already exists.`,
      );
    }
  }

  private async getApprovedScheduleForSpecificTimeFrame({
    userId,
    scheduleStartDate,
    scheduleEndDate,
  }: {
    userId: string;
    scheduleStartDate: Date;
    scheduleEndDate: Date;
  }): Promise<Schedule | null> {
    const schedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoin('schedule.scheduleParticipantUsers', 'scheduleParticipantUsers')
      .andWhere('scheduleParticipantUsers.userId = :userId', { userId })
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
}

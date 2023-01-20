import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ScheduleParticipantUser from 'src/database/entities/schedule-participant-user.entity';
import { Repository } from 'typeorm';
import { ScheduleParticipantUserStatus } from '../constants/schedule-participant-user-status.enum';
import { UpdateScheduleParticipationParamsDto } from '../dtos/update-schedule-participation-params.dto';
import { UpdateScheduleParticipationDto } from '../dtos/update-schedule-participation.dto';
import { ScheduleCheckingService } from './schedule-checking.service';

@Injectable()
export class ScheduleParticipationUpdateService {
  constructor(
    @InjectRepository(ScheduleParticipantUser)
    private scheduleParticipantUserRepository: Repository<ScheduleParticipantUser>,
    private scheduleCheckingService: ScheduleCheckingService,
  ) {}

  async updateScheduleParticipation({
    userId,
    updateScheduleParticipationDto: { status },
    updateScheduleParticipationParamsDto: { id },
  }: {
    userId: string;
    updateScheduleParticipationDto: UpdateScheduleParticipationDto;
    updateScheduleParticipationParamsDto: UpdateScheduleParticipationParamsDto;
  }): Promise<ScheduleParticipantUser> {
    const scheduleParticipant =
      await this.scheduleCheckingService.checkIfParticipantExistsByUserIdAndScheduleId(
        { userId, scheduleId: id },
      );

    if (scheduleParticipant.status === ScheduleParticipantUserStatus.REJECTED) {
      throw new BadRequestException(
        'Schedule participation is already rejected.',
      );
    }

    const updatedFriendRequest =
      await this.scheduleParticipantUserRepository.save({
        id: scheduleParticipant.id,
        status,
      });

    return updatedFriendRequest;
  }
}

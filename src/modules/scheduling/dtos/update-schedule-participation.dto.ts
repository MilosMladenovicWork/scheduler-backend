import { IsIn } from 'class-validator';
import { ScheduleParticipantUserStatus } from '../constants/schedule-participant-user-status.enum';

export class UpdateScheduleParticipationDto {
  @IsIn([
    ScheduleParticipantUserStatus.ACCEPTED,
    ScheduleParticipantUserStatus.REJECTED,
  ])
  status: ScheduleParticipantUserStatus;
}

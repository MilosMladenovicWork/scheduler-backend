import { IsUUID } from 'class-validator';

export class UpdateScheduleParticipationParamsDto {
  @IsUUID()
  id: string;
}

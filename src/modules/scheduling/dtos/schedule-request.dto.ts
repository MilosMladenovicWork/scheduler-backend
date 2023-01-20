import { Type } from 'class-transformer';
import {
  IsUUID,
  IsDate,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class ScheduleDto {
  @IsUUID('all', { each: true })
  userIds: string[];

  @IsDate()
  @Type(() => Date)
  scheduleStartDate: Date;

  @IsDate()
  @Type(() => Date)
  // TODO: add validation for having greater end date than start date
  scheduleEndDate: Date;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}

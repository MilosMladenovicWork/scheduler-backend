import { Type } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';

export class GetSchedulesQueryDto {
  // TODO: set from and to max one week range
  @Type(() => Date)
  @IsDate()
  from: Date;

  @Type(() => Date)
  @IsDate()
  to: Date;

  @IsUUID('all', { each: true })
  userIds: string[];
}

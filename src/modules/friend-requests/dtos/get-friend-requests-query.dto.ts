import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class GetFriendRequestsQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Max(100)
  take: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip: number;
}

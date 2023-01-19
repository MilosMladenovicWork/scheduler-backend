import { IsUUID } from 'class-validator';

export class GetFriendParamDto {
  @IsUUID()
  userId: string;
}

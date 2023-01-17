import { IsUUID } from 'class-validator';

export class RespondToFriendRequestParamsDto {
  @IsUUID()
  id: string;
}

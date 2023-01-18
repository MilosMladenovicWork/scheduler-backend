import { IsUUID } from 'class-validator';

export class UpdateApprovedFriendRequestParamsDto {
  @IsUUID()
  id: string;
}

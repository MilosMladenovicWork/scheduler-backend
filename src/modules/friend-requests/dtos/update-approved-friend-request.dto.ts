import { IsIn } from 'class-validator';
import { FriendRequestStatusEnum } from '../types/friend-request-status.enum';

export class UpdateApprovedFriendRequestDto {
  @IsIn([FriendRequestStatusEnum.REJECTED])
  status: FriendRequestStatusEnum.REJECTED;
}

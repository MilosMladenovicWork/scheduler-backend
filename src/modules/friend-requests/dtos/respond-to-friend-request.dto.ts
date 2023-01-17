import { IsIn } from 'class-validator';
import { FriendRequestStatusEnum } from '../types/friend-request-status.enum';

export class RespondToFriendRequestDto {
  @IsIn([FriendRequestStatusEnum.APPROVED, FriendRequestStatusEnum.REJECTED])
  status: FriendRequestStatusEnum.APPROVED | FriendRequestStatusEnum.REJECTED;
}

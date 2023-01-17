import { FriendRequestStatusEnum } from '../../modules/friend-requests/types/friend-request-status.enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import User from './user.entity';

@Entity()
@Unique(['senderId', 'receiverId'])
class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: FriendRequestStatusEnum;

  @Column()
  senderId: string;

  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  sender: User;

  @Column()
  receiverId: string;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  receiver: User;
}

export default FriendRequest;

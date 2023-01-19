import { FriendRequestStatusEnum } from '../../modules/friend-requests/types/friend-request-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import User from './user.entity';

@Entity()
@Unique(['senderId', 'receiverId'])
class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: FriendRequestStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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

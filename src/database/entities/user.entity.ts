import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import FriendRequest from './friend-request.entity';
import ScheduleCreatorUser from './schedule-creator-user.entity';
import ScheduleParticipantUser from './schedule-participant-user.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @OneToMany(
    () => ScheduleCreatorUser,
    (scheduleCreatorUser) => scheduleCreatorUser.user,
  )
  scheduleCreatorUsers: ScheduleCreatorUser[];

  @OneToMany(
    () => ScheduleParticipantUser,
    (scheduleParticipantUser) => scheduleParticipantUser.user,
  )
  scheduleParticipantUsers: ScheduleParticipantUser[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];
}

export default User;

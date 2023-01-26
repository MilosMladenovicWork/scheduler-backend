import { ScheduleParticipantUserStatus } from '../../modules/scheduling/constants/schedule-participant-user-status.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Schedule from './schedule.entity';
import User from './user.entity';

@Entity()
class ScheduleParticipantUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: ScheduleParticipantUserStatus.PENDING })
  status: ScheduleParticipantUserStatus;

  @Column()
  scheduleId: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.scheduleParticipantUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.scheduleParticipantUsers)
  @JoinColumn({ name: 'userId' })
  user: User;
}

export default ScheduleParticipantUser;

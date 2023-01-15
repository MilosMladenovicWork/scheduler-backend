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
class ScheduleCreatorUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  scheduleId: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.scheduleCreatorUsers)
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.scheduleCreatorUsers)
  @JoinColumn({ name: 'userId' })
  user: User;
}

export default ScheduleCreatorUser;

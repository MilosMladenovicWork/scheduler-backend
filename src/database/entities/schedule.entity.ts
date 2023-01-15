import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import ScheduleCreatorUser from './schedule-creator-user.entity';
import ScheduleParticipantUser from './schedule-participant-user.entity';

@Entity()
class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'tsrange' })
  dateRange: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToMany(
    () => ScheduleCreatorUser,
    (scheduleCreatorUser) => scheduleCreatorUser.schedule,
  )
  scheduleCreatorUsers: ScheduleCreatorUser[];

  @OneToMany(
    () => ScheduleParticipantUser,
    (scheduleParticipantUser) => scheduleParticipantUser.schedule,
  )
  scheduleParticipantUsers: ScheduleParticipantUser[];
}

export default Schedule;

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ScheduleParticipantUser from 'src/database/entities/schedule-participant-user.entity';
import Schedule from 'src/database/entities/schedule.entity';
import { FriendRequestsModule } from '../friend-requests/friend-requests.module';
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleCheckingService } from './services/schedule-checking.service';
import { ScheduleGettingService } from './services/schedule-getting.service';
import { ScheduleParticipationUpdateService } from './services/schedule-participation-update.service';
import { ScheduleService } from './services/schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, ScheduleParticipantUser]),
    FriendRequestsModule,
  ],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    ScheduleCheckingService,
    ScheduleGettingService,
    ScheduleParticipationUpdateService,
  ],
})
export class SchedulingModule {}

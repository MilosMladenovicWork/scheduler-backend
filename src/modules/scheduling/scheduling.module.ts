import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Schedule from 'src/database/entities/schedule.entity';
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleCheckingService } from './services/schedule-checking.service';
import { ScheduleService } from './services/schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleCheckingService],
})
export class SchedulingModule {}

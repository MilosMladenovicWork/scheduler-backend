import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ScheduleDto } from '../dtos/schedule-request.dto';
import { ScheduleService } from '../services/schedule.service';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import Schedule from 'src/database/entities/schedule.entity';
import { JwtUser } from 'src/modules/auth/types/jwt-user.type';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  schedule(
    @Body(ValidationPipe) scheduleDto: ScheduleDto,
    @UserDecorator() user: JwtUser,
  ): Promise<Schedule> {
    return this.scheduleService.schedule(user.userId, scheduleDto);
  }
}

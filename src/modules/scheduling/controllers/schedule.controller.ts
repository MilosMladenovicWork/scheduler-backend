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
import { Response } from 'src/common/dtos/response.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async schedule(
    @Body(ValidationPipe) scheduleDto: ScheduleDto,
    @UserDecorator() user: JwtUser,
  ): Promise<Response<Schedule>> {
    return new Response(
      await this.scheduleService.schedule(user.userId, scheduleDto),
    );
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ScheduleDto } from '../dtos/schedule-request.dto';
import { ScheduleService } from '../services/schedule.service';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import Schedule from 'src/database/entities/schedule.entity';
import { JwtUser } from 'src/modules/auth/types/jwt-user.type';
import { ArrayResponse, Response } from 'src/common/dtos/response.dto';
import { GetSchedulesQueryDto } from '../dtos/get-schedules-query.dto';
import { ScheduleGettingService } from '../services/schedule-getting.service';
import ScheduleParticipantUser from 'src/database/entities/schedule-participant-user.entity';
import { ScheduleParticipationUpdateService } from '../services/schedule-participation-update.service';
import { UpdateScheduleParticipationParamsDto } from '../dtos/update-schedule-participation-params.dto';
import { UpdateScheduleParticipationDto } from '../dtos/update-schedule-participation.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly scheduleGettingService: ScheduleGettingService,
    private readonly scheduleParticipationUpdateService: ScheduleParticipationUpdateService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query(ValidationPipe)
    getSchedulesQueryDto: GetSchedulesQueryDto,
    @UserDecorator() user: JwtUser,
  ): Promise<ArrayResponse<Schedule[]>> {
    return new ArrayResponse(
      await this.scheduleGettingService.getAll(
        user.userId,
        getSchedulesQueryDto,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/participation')
  async updateApproved(
    @Param(ValidationPipe)
    updateScheduleParticipationParamsDto: UpdateScheduleParticipationParamsDto,
    @Body(ValidationPipe)
    updateScheduleParticipationDto: UpdateScheduleParticipationDto,
    @UserDecorator() user: JwtUser,
  ): Promise<Response<ScheduleParticipantUser>> {
    return new Response(
      await this.scheduleParticipationUpdateService.updateScheduleParticipation(
        {
          userId: user.userId,
          updateScheduleParticipationDto,
          updateScheduleParticipationParamsDto,
        },
      ),
    );
  }
}

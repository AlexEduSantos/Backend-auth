import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from 'src/auth/session.guard';
import { ScheduleService } from './schedule.service';
import {
  CreateDayDto,
  CreateScheduleDto,
  CreateTopicDto,
  UpdateScheduleDto,
} from './dts/schedule';

@UseGuards(SessionGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  // ======================
  // Schedule
  // ======================
  @Get()
  async getSchedule(@Request() req: any) {
    const userId = req.user.id;
    return this.scheduleService.getSchedule(userId);
  }

  @Post('createSchedule')
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(
    @Request() req: any,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.scheduleService.createSchedule(
      createScheduleDto,
      req.user.userId,
    );
  }

  @Put(':scheduleId')
  async updateSchedule(
    @Param('scheduleId', new ParseUUIDPipe()) scheduleId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(scheduleId, updateScheduleDto);
  }

  @Delete(':scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchedule(
    @Param('scheduleId', new ParseUUIDPipe()) scheduleId: string,
  ) {
    await this.scheduleService.deleteSchedule(scheduleId);
  }

  // ======================
  // DAY
  // ======================
  @Get('days/:dayId')
  async getDayById(@Param('dayId', new ParseUUIDPipe()) dayId: string) {
    return this.scheduleService.getDayById(dayId);
  }

  @Post(':scheduleId/days')
  @HttpCode(HttpStatus.CREATED)
  async createDay(
    @Param('scheduleId', new ParseUUIDPipe()) scheduleId: string,
    @Body() createDayDto: CreateDayDto,
  ) {
    return this.scheduleService.createDay(scheduleId, createDayDto);
  }

  @Put('days/:dayId')
  async updateDay(
    @Param('dayId', new ParseUUIDPipe()) dayId: string,
    @Body() updateDayDto: CreateDayDto,
  ) {
    return this.scheduleService.updateDay(dayId, updateDayDto);
  }

  @Delete('days/:dayId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDay(@Param('dayId', new ParseUUIDPipe()) dayId: string) {
    await this.scheduleService.deleteDay(dayId);
  }

  // ======================
  // TOPIC
  // ======================
  @Get('topics/:topicId')
  async getTopicById(@Param('topicId', new ParseUUIDPipe()) topicId: string) {
    return this.scheduleService.getTopicById(topicId);
  }

  @Post('days/:dayId/topics')
  @HttpCode(HttpStatus.CREATED)
  async createTopic(
    @Param('dayId', new ParseUUIDPipe()) dayId: string,
    @Body() createTopicDto: CreateTopicDto,
  ) {
    return this.scheduleService.createTopic(createTopicDto, dayId);
  }

  @Put('topics/:topicId')
  async updateTopic(
    @Param('topicId', new ParseUUIDPipe()) topicId: string,
    @Body() updateTopicDto: CreateTopicDto,
  ) {
    return this.scheduleService.updateTopic(topicId, updateTopicDto);
  }

  @Put('topics/:topicId/status')
  async toggleTopicStatus(
    @Param('topicId', new ParseUUIDPipe()) topicId: string,
  ) {
    return this.scheduleService.toggleTopicStatus(topicId);
  }

  @Delete('topics/:topicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTopic(@Param('topicId', new ParseUUIDPipe()) topicId: string) {
    await this.scheduleService.deleteTopic(topicId);
  }
}

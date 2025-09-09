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
    const userId = req.user.id;
    return this.scheduleService.createSchedule(createScheduleDto, userId);
  }

  @Put(':scheduleId')
  async updateSchedule(
    @Param('scheduleId', new ParseUUIDPipe()) scheduleId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const updatedSchedule = await this.scheduleService.updateSchedule(
      scheduleId,
      updateScheduleDto,
    );

    return {
      message: 'Cronograma atualizado com sucesso.',
      status: 'success',
      data: updatedSchedule,
    };
  }

  @Delete(':scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchedule(
    @Param('scheduleId', new ParseUUIDPipe()) scheduleId: string,
  ) {
    const deletedSchedule =
      await this.scheduleService.deleteSchedule(scheduleId);

    return {
      message: 'Cronograma excluido com sucesso.',
      status: 'success',
    };
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
    const updatedDay = this.scheduleService.updateDay(dayId, updateDayDto);

    return {
      message: 'Dia atualizado com sucesso.',
      status: 'success',
      data: updatedDay,
    };
  }

  @Delete('days/:dayId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDay(@Param('dayId', new ParseUUIDPipe()) dayId: string) {
    const deletedDay = await this.scheduleService.deleteDay(dayId);

    return {
      message: 'Dia excluido com sucesso.',
      status: 'success',
    };
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
    const updatedTopic = await this.scheduleService.updateTopic(
      topicId,
      updateTopicDto,
    );

    return {
      message: 'Tópico atualizado com sucesso.',
      status: 'success',
      data: updatedTopic,
    };
  }

  @Put('topics/:topicId/status')
  async toggleTopicStatus(
    @Param('topicId', new ParseUUIDPipe()) topicId: string,
  ) {
    const statusUpdateTopic =
      await this.scheduleService.toggleTopicStatus(topicId);

    return {
      message: 'Tópico atualizado com sucesso.',
      status: 'success',
      data: statusUpdateTopic,
    };
  }

  @Delete('topics/:topicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTopic(@Param('topicId', new ParseUUIDPipe()) topicId: string) {
    const deletedTopic = await this.scheduleService.deleteTopic(topicId);

    return {
      message: 'Tópico excluido com sucesso.',
      status: 'success',
    };
  }
}

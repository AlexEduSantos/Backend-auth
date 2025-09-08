import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateDayDto,
  CreateScheduleDto,
  CreateTopicDto,
  UpdateScheduleDto,
} from './dts/schedule';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async getSchedule(userId: string) {
    return this.prisma.schedule.findMany({
      where: { userId },
      orderBy: { testDay: 'desc' },
      include: {
        days: { include: { topics: true } },
      },
    });
  }

  async createSchedule(data: CreateScheduleDto, userId: string) {
    try {
      const { days, ...scheduleData } = data;

      return await this.prisma.schedule.create({
        data: {
          ...scheduleData,
          testDay: new Date(scheduleData.testDay),
          studyStartDate: new Date(scheduleData.studyStartDate),
          studyEndDate: new Date(scheduleData.studyEndDate),
          days: {
            create: days.map((day) => ({
              date: new Date(day.date),
              startTime: day.startTime,
              endTime: day.endTime,
              topics: {
                create: day.topics.map((topic) => ({
                  name: topic.name,
                  weight: topic.weight,
                  duration: topic.duration,
                  status: topic.status ?? false,
                })),
              },
            })),
          },
          userId,
        },
        include: { days: { include: { topics: true } } },
      });
    } catch (error) {
      console.error('Erro ao criar cronograma:', error);
      throw new InternalServerErrorException(
        'Não foi possível criar o cronograma.',
      );
    }
  }

  async updateSchedule(scheduleId: string, updateData: UpdateScheduleDto) {
    try {
      return await this.prisma.schedule.update({
        where: { id: scheduleId },
        data: {
          ...updateData,
          testDay: new Date(updateData.testDay),
          studyStartDate: new Date(updateData.studyStartDate),
          studyEndDate: new Date(updateData.studyEndDate),
        },
        include: { days: { include: { topics: true } } },
      });
    } catch (error) {
      console.error('Erro ao atualizar cronograma:', error);
      throw new InternalServerErrorException(
        'Não foi possível atualizar o cronograma.',
      );
    }
  }

  async deleteSchedule(scheduleId: string) {
    const existingSchedule = await this.prisma.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!existingSchedule) {
      throw new NotFoundException('Cronograma não encontrado.');
    }

    await this.prisma.schedule.delete({
      where: { id: scheduleId },
    });
  }

  // ======================
  // DAY
  // ======================
  async getDayById(dayId: string) {
    const day = await this.prisma.day.findUnique({
      where: { id: dayId },
      include: { topics: true },
    });
    if (!day) throw new NotFoundException('Dia não encontrado.');
    return day;
  }

  async createDay(scheduleId: string, dayData: CreateDayDto) {
    try {
      const existingSchedule = await this.prisma.schedule.findUnique({
        where: { id: scheduleId },
      });

      if (!existingSchedule) {
        throw new NotFoundException('Cronograma não encontrado.');
      }

      const existingDay = await this.prisma.day.findUnique({
        where: {
          scheduleId_date: {
            date: dayData.date,
            scheduleId,
          },
        },
      });

      if (existingDay) {
        throw new ConflictException('Dia já existe.');
      }

      return await this.prisma.day.create({
        data: {
          ...dayData,
          date: new Date(dayData.date),
          schedule: { connect: { id: scheduleId } },
          topics: undefined,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error('Erro ao criar dia:', error);
      throw new InternalServerErrorException('Não foi possível criar o dia.');
    }
  }

  async updateDay(dayId: string, updateDayDto: CreateDayDto) {
    try {
      return await this.prisma.day.update({
        where: { id: dayId },
        data: {
          ...updateDayDto,
          date: new Date(updateDayDto.date),
          topics: undefined,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar dia:', error);
      throw new InternalServerErrorException(
        'Não foi possível atualizar o dia.',
      );
    }
  }

  async deleteDay(dayId: string) {
    const existingDay = await this.prisma.day.findUnique({
      where: { id: dayId },
    });

    if (!existingDay) {
      throw new NotFoundException('Dia não encontrado.');
    }

    await this.prisma.day.delete({
      where: { id: dayId },
    });
  }

  // ======================
  // TOPIC
  // ======================
  async getTopicById(topicId: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });
    if (!topic) throw new NotFoundException('Tópico não encontrado.');
    return topic;
  }

  async createTopic(topicData: CreateTopicDto, dayId: string) {
    try {
      const existingDay = await this.prisma.day.findUnique({
        where: { id: dayId },
      });
      if (!existingDay) {
        throw new NotFoundException('Dia não encontrado.');
      }

      return await this.prisma.topic.create({
        data: {
          ...topicData,
          day: { connect: { id: dayId } },
          status: topicData.status ?? false,
        },
      });
    } catch (error) {
      console.error('Erro ao criar tópico:', error);
      throw new InternalServerErrorException(
        'Não foi possível criar o tópico.',
      );
    }
  }

  async updateTopic(topicId: string, updateTopicDto: CreateTopicDto) {
    try {
      return await this.prisma.topic.update({
        where: { id: topicId },
        data: updateTopicDto,
      });
    } catch (error) {
      console.error('Erro ao atualizar tópico:', error);
      throw new InternalServerErrorException(
        'Não foi possível atualizar o tópico.',
      );
    }
  }

  async deleteTopic(topicId: string) {
    const existingTopic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!existingTopic) {
      throw new NotFoundException('Tópico não encontrado.');
    }

    await this.prisma.topic.delete({
      where: { id: topicId },
    });
  }

  async toggleTopicStatus(topicId: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });
    if (!topic) {
      throw new NotFoundException('Tópico nao encontrado.');
    }
    return await this.prisma.topic.update({
      where: { id: topicId },
      data: { status: !topic.status },
    });
  }
}

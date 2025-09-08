import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsNumber()
  @Min(0)
  duration: number;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}

export class CreateDayDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTopicDto)
  topics: CreateTopicDto[];
}

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  testDay: string;

  @IsDateString()
  studyStartDate: string;

  @IsDateString()
  studyEndDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDayDto)
  days: CreateDayDto[];
}

export class UpdateScheduleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  testDay: string;

  @IsDateString()
  studyStartDate: string;

  @IsDateString()
  studyEndDate: string;
}

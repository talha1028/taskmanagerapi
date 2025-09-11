import { IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDTO {
  @ApiProperty({
    description: 'Title of the task',
    example: 'Finish NestJS project',
  })
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the task',
    example: 'Complete all endpoints and DTO validations',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Current status of the task',
    example: TaskStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    description: 'Priority level of the task',
    example: TaskPriority.HIGH,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Due date of the task in ISO format',
    example: '2025-09-10T14:48:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}

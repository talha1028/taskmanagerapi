import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TaskPriority, TaskStatus } from "../entities/task.entity";

export class CreateTaskDTO {
  @ApiProperty({
    example: "Finish project report",
    description: "Title of the task",
  })
  @IsNotEmpty({ message: "Title is required" })
  @IsString()
  @MaxLength(100, { message: "Title must not exceed 100 characters" })
  title: string;

  @ApiProperty({
    example: "Complete the final report for submission",
    description: "Optional task description",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "Description must not exceed 500 characters" })
  description?: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    description: "Status of the task",
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: "Status must be either 'pending' or 'completed'" })
  status?: TaskStatus;

  @ApiProperty({
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    description: "Priority of the task",
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: "Priority must be 'low', 'medium', or 'high'" })
  priority?: TaskPriority;

  @ApiProperty({
    example: "2025-09-30",
    description: "Due date of the task (YYYY-MM-DD format)",
  })
  @IsOptional()
  @IsDateString({}, { message: "Due date must be a valid date string (YYYY-MM-DD)" })
  dueDate?: string;
}

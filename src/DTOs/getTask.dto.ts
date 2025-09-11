import { IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTaskDto {
  @ApiPropertyOptional({ example: 5, description: 'Task ID' })
  @IsInt()
  taskId: number;

  @ApiPropertyOptional({ example: 2, description: 'User ID' })
  @IsInt()
  userId: number;
}

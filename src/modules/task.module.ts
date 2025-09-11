import { Module } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { TaskController } from '../controllers/task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task,User])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}


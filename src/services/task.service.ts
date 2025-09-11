import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskPriority, TaskStatus } from '../entities/task.entity';
import { CreateTaskDTO } from 'src/DTOs/createtask.dto';
import { UpdateTaskDTO } from 'src/DTOs/updateTask.dto';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) { }

  async createTask(dto: CreateTaskDTO, userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    const task = this.taskRepo.create({
      ...dto,
      status: dto.status ?? TaskStatus.PENDING,
      priority: dto.priority ?? TaskPriority.MEDIUM,
      user, // ✅ attach the managed entity
    });

    return this.taskRepo.save(task);
  }



  async updateTask(id: number, updateTask: UpdateTaskDTO, userId: number) {
    if (!updateTask || Object.keys(updateTask).length === 0) {
      throw new BadRequestException('Update body cannot be empty');
    }

    const task = await this.taskRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Task not found or you are not authorized');
    }

    this.taskRepo.merge(task, updateTask);
    return await this.taskRepo.save(task);
  }



async findtask(taskid: number){
  return this.taskRepo.findOneBy({ id: taskid })
}
  async deleteTask(id: number, user: { userId: number; role: string }) {
  const task = await this.taskRepo.findOne({
    where: { id },
    relations: ['user'],
  });

  if (!task) {
    throw new Error('Task not found');
  }

  // ✅ Allow if user owns the task OR if they are admin
  if (task.user.id !== user.userId && user.role !== 'admin') {
    throw new Error('Not authorized to delete this task');
  }

  return this.taskRepo.remove(task);
}


  async findAllForUser(userId: number) {
  return this.taskRepo.find({
    where: { user: { id: userId } },
  });
}
}

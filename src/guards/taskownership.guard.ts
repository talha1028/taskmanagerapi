import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const taskId = Number(request.params?.id);

    // 🚨 If no :id in the route (e.g. /tasks/me), skip guard
    if (!taskId || isNaN(taskId)) {
      return true;
    }

    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // ✅ Allow if user owns the task or is admin
    if (task.user.id === user.userId || user.role === 'admin') {
      return true;
    }

    throw new ForbiddenException('You do not own this task');
  }
}

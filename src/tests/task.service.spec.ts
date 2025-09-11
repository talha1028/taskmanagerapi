import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../services/task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus, TaskPriority } from '../entities/task.entity';
import { User } from '../entities/user.entity';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepoMock: any;
  let userRepoMock: any;

  beforeEach(async () => {
    // Mock repositories
    taskRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };

    userRepoMock = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getRepositoryToken(Task), useValue: taskRepoMock },
        { provide: getRepositoryToken(User), useValue: userRepoMock },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should create a new task', async () => {
    const dto = { title: 'Test Task', description: 'Desc' };
    const mockUser = { id: 1, name: 'John Doe' };
    const mockTask = { id: 1, ...dto, status: TaskStatus.PENDING, priority: TaskPriority.MEDIUM, user: mockUser };

    userRepoMock.findOneBy.mockResolvedValue(mockUser);
    taskRepoMock.create.mockReturnValue(mockTask);
    taskRepoMock.save.mockResolvedValue(mockTask);

    const result = await service.createTask(dto, 1);

    expect(userRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(taskRepoMock.create).toHaveBeenCalledWith({
      ...dto,
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      user: mockUser,
    });
    expect(taskRepoMock.save).toHaveBeenCalledWith(mockTask);
    expect(result).toEqual(mockTask);
  });

  it('should update task if user is authorised', async () => {
    const mockUserId = 1;
    const mockTask = { id: 1, title: 'Old Task', description: 'Old', user: { id: mockUserId } };
    const updateDto = { title: 'Updated Task' };
    const updatedTask = { ...mockTask, ...updateDto };

    taskRepoMock.findOne.mockResolvedValue(mockTask);
    taskRepoMock.save.mockResolvedValue(updatedTask);

    const result = await service.updateTask(1, updateDto, mockUserId);

    expect(taskRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1, user: { id: mockUserId } },
      relations: ['user'],
    });
    expect(taskRepoMock.save).toHaveBeenCalledWith(updatedTask);
    expect(result).toEqual(updatedTask);
  });

  it('should throw error if updating task not found', async () => {
    taskRepoMock.findOne.mockResolvedValue(null);
    await expect(service.updateTask(1, { title: 'x' }, 1)).rejects.toThrow('Task not found or you are not authorized');
  });
});

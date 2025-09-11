import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDTO } from './createtask.dto';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {}

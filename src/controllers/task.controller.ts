import {
    UseGuards,
    Controller,
    Post,
    Body,
    Request,
    Get,
    Param,
    Delete,
    Patch,
    Query,
    ParseIntPipe
} from '@nestjs/common';
import { TaskService } from 'src/services/task.service';
import { CreateTaskDTO } from 'src/DTOs/createtask.dto';
import { UpdateTaskDTO } from 'src/DTOs/updateTask.dto';
import { GetTaskDto } from 'src/DTOs/getTask.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { TaskOwnershipGuard } from 'src/guards/taskownership.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Post('create')
    create(@Body() dto: CreateTaskDTO, @Request() req) {
        console.log('create task hit')
        return this.taskService.createTask(dto, req.user.userId);
    }

    // ✅ Ownership check required
    @UseGuards(JwtAuthGuard, TaskOwnershipGuard)
    @ApiBearerAuth('access-token')
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTaskDTO,
        @Request() req,
    ) {
        return this.taskService.updateTask(id, dto, req.user.userId);    }

    // ✅ Only JWT needed
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('me')
    findMyTasks(@Request() req) {
        return this.taskService.findAllForUser(req.user.userId);
    }

    @UseGuards(JwtAuthGuard, TaskOwnershipGuard)
    @ApiBearerAuth('access-token')
    @Get(':id')
    findtask(
        @Param('id') id: string
    ) {
        return this.taskService.findtask(Number(id))
    }



    @UseGuards(JwtAuthGuard, TaskOwnershipGuard)
    @ApiBearerAuth('access-token')
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.taskService.deleteTask(id, req.user);
    }


}

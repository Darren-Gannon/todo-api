import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('board/:boardId/task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) { }

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(boardId, createTaskDto);
  }

  @Get()
  findAll(
    @Param('boardId') boardId: string,
  ) {
    return this.taskService.findAll(boardId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Param('boardId') boardId: string,
  ) {
    return this.taskService.findOne(boardId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Param('boardId') boardId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(boardId, id, updateTaskDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Param('boardId') boardId: string,
  ) {
    return this.taskService.remove(boardId, id);
  }
}

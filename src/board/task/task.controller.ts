import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOAuth2 } from '@nestjs/swagger';
import { Auth, AuthPayload } from '../../authz/auth.decorator';

@Controller('board/:boardId/task')
@ApiOAuth2([], 'Auth0')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) { }

  @Post()
  create(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(boardId, createTaskDto);
  }

  @Get()
  findAll(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
  ) {
    return this.taskService.findAll(boardId);
  }

  @Get(':id')
  findOne(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
    @Param('boardId') boardId: string,
  ) {
    return this.taskService.findOne(boardId, id);
  }

  @Patch(':id')
  update(
    @Auth() auth: AuthPayload,
    @Param('id') id: string, 
    @Param('boardId') boardId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(boardId, id, updateTaskDto);
  }

  @Delete(':id')
  remove(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
    @Param('boardId') boardId: string,
  ) {
    return this.taskService.remove(boardId, id);
  }
}

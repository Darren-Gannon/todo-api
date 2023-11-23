import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOAuth2 } from '@nestjs/swagger';
import { Auth, AuthPayload } from '../../authz/auth.decorator';
import { Permission } from 'src/authz/permission.guard';
import { BoardTaskPermissions } from './board-task-permissions.enum';

@Controller('board/:boardId/task')
@ApiOAuth2([], 'Auth0')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) { }

  @Post()
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { write } = BoardTaskPermissions(req.params.boardId);
    return [write];
  })
  create(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(boardId, createTaskDto);
  }

  @Get()
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { read } = BoardTaskPermissions(req.params.boardId);
    return [read];
  })
  findAll(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
  ) {
    return this.taskService.findAll(boardId);
  }

  @Get(':id')
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { read } = BoardTaskPermissions(req.params.boardId);
    return [read];
  })
  findOne(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
    @Param('boardId') boardId: string,
  ) {
    return this.taskService.findOne(boardId, id);
  }

  @Patch(':id')
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { write } = BoardTaskPermissions(req.params.boardId);
    return [write];
  })
  update(
    @Auth() auth: AuthPayload,
    @Param('id') id: string, 
    @Param('boardId') boardId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(boardId, id, updateTaskDto);
  }

  @Delete(':id')
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { write } = BoardTaskPermissions(req.params.boardId);
    return [write];
  })
  remove(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
    @Param('boardId') boardId: string,
  ) {
    return this.taskService.remove(boardId, id);
  }
}

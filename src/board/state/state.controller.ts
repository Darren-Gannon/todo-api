import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { Auth, AuthPayload } from '../../authz/auth.decorator';
import { ApiOAuth2 } from '@nestjs/swagger';
import { Permission } from 'src/authz/permission.guard';
import { BoardPermissions } from '../board-permissions.enum';
import { BoardStatePermissions } from './board-state-permissions.enum';

@Controller('board/:boardId/state')
@ApiOAuth2([], 'Auth0')
export class StateController {
  constructor(
    private readonly stateService: StateService,
  ) { }

  @Post()
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { write } = BoardStatePermissions(req.params.boardId);
    return [write];
  })
  create(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
    @Body() createStateDto: CreateStateDto,
  ) {
    return this.stateService.create(boardId, createStateDto);
  }

  @Post('many')
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { write } = BoardStatePermissions(req.params.boardId);
    return [write];
  })
  createMany(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
    @Body() createStateDtos: CreateStateDto[],
  ) {
    return this.stateService.createMany(boardId, createStateDtos);
  }

  @Get()
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { read } = BoardStatePermissions(req.params.boardId);
    return [read];
  })
  findAll(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
  ) {
    return this.stateService.findAll(boardId);
  }

  @Get(':id')
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { read } = BoardStatePermissions(req.params.boardId);
    return [read];
  })
  findOne(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
    @Param('boardId') boardId: string,
  ) {
    return this.stateService.findOne(boardId, id);
  }

  @Patch(':id')
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { write } = BoardStatePermissions(req.params.boardId);
    return [write];
  })
  update(
    @Auth() auth: AuthPayload,
    @Param('id') id: string, 
    @Param('boardId') boardId: string,
    @Body() updateStateDto: UpdateStateDto,
  ) {
    return this.stateService.update(boardId, id, updateStateDto);
  }

  @Delete(':id')
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { write } = BoardStatePermissions(req.params.boardId);
    return [write];
  })
  remove(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
    @Param('boardId') boardId: string,
  ) {
    return this.stateService.remove(boardId, id);
  }
}

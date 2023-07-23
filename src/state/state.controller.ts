import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Controller('board/:boardId/state')
export class StateController {
  constructor(
    private readonly stateService: StateService,
  ) { }

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Body() createStateDto: CreateStateDto,
  ) {
    return this.stateService.create(boardId, createStateDto);
  }

  @Get()
  findAll(
    @Param('boardId') boardId: string,
  ) {
    return this.stateService.findAll(boardId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Param('boardId') boardId: string,
  ) {
    return this.stateService.findOne(boardId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Param('boardId') boardId: string,
    @Body() updateStateDto: UpdateStateDto,
  ) {
    return this.stateService.update(boardId, id, updateStateDto);
  }

  @Patch()
  swapStates(
    @Param('boardId') boardId: string,
    @Body('aId') aId: string,
    @Body('bId') bId: string,
  ) {
    return this.stateService.swapStates(boardId, aId, bId);
  }



  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Param('boardId') boardId: string,
  ) {
    return this.stateService.remove(boardId, id);
  }
}

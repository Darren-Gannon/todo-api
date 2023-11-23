import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Auth, AuthPayload } from '../authz/auth.decorator';
import { ApiOAuth2 } from '@nestjs/swagger';

@Controller('board')
@ApiOAuth2([], 'Auth0')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
  ) { }

  @Post()
  create(
    @Auth() auth: AuthPayload,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return this.boardService.create(createBoardDto, auth);
  }

  @Get()
  findAll(
    @Auth() auth: AuthPayload,
  ) {
    return this.boardService.findAll(auth);
  }

  @Get(':id')
  findOne(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
  ) {
    return this.boardService.findOne(id);
  }

  @Patch(':id')
  update(
    @Auth() auth: AuthPayload,
    @Param('id') id: string, 
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  remove(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
  ) {
    return this.boardService.remove(id, auth);
  }
}

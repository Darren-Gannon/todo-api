import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Auth, AuthPayload } from '../authz/auth.decorator';
import { ApiOAuth2 } from '@nestjs/swagger';
import { Permission } from 'src/authz/permission.guard';
import { BoardPermissions } from './board-permissions.enum';

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
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { read } = BoardPermissions(req.params.id);
    return [read];
  })
  findOne(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
  ) {
    return this.boardService.findOne(id);
  }

  @Patch(':id')
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { write } = BoardPermissions(req.params.id);
    return [write];
  })
  update(
    @Auth() auth: AuthPayload,
    @Param('id') id: string, 
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { write } = BoardPermissions(req.params.id);
    return [write];
  })
  remove(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
  ) {
    return this.boardService.remove(id, auth);
  }
}

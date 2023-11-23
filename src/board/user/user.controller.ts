import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiOAuth2 } from '@nestjs/swagger';
import { Auth, AuthPayload } from '../../authz/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { BoardUserPermissions } from './board-user-permissions.enum';
import { Permission } from 'src/authz/permission.guard';

@Controller('board/:boardId/user')
@ApiOAuth2([], 'Auth0')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { read } = BoardUserPermissions(req.params.boardId);
    return [read];
  })
  findAll(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
  ) {
    return this.userService.findAll(boardId, auth);
  }

  @Get(':id')
  @Permission(ctx => {
    const req = ctx.switchToHttp().getRequest();
    const { read } = BoardUserPermissions(req.params.boardId);
    return [read];
  })
  findOne(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
    @Param('id') id: string,
  ) {
    return this.userService.findOne(boardId, id, auth);
  }
}

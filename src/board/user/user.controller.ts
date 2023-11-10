import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiOAuth2 } from '@nestjs/swagger';
import { Auth, AuthPayload } from '../../authz/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('board/:boardId/user')
@ApiOAuth2([], 'Auth0')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
  ) {
    return this.userService.findAll(boardId, auth);
  }

  @Get(':id')
  findOne(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
    @Param('id') id: string,
  ) {
    return this.userService.findOne(boardId, id, auth);
  }
}

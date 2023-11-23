import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserInviteService } from './user-invite.service';
import { CreateUserInviteDto } from './dto/create-user-invite.dto';
import { UpdateUserInviteDto } from './dto/update-user-invite.dto';
import { ApiOAuth2 } from '@nestjs/swagger';
import { Auth, AuthPayload } from '../../authz/auth.decorator';

@Controller('')
@ApiOAuth2([], 'Auth0')
export class UserInviteController {
  constructor(private readonly userInviteService: UserInviteService) {}

  @Post('board/:boardId/user-invite')
  create(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
    @Body() createUserInviteDto: CreateUserInviteDto,
  ) {
    return this.userInviteService.create(boardId, createUserInviteDto, auth);
  }

  @Get('board/:boardId/user-invite')
  findAllForBoard(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
  ) {
    return this.userInviteService.findAllForBoard(boardId);
  }

  @Get('board/:boardId/user-invite/:id')
  findOneForBoard(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
    @Param('id') id: string,
  ) {
    return this.userInviteService.findOneForBoard(boardId, id);
  }

  @Patch('board/:boardId/user-invite/:id')
  updateForBoard(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
    @Param('id') id: string, 
    @Body() updateUserInviteDto: UpdateUserInviteDto,
  ) {
    return this.userInviteService.updateForBoard(boardId, id, updateUserInviteDto);
  }

  @Delete('board/:boardId/user-invite/:id')
  removeForBoard(
    @Auth() auth: AuthPayload,
    @Param('boardId') boardId: string,
    @Param('id') id: string,
  ) {
    return this.userInviteService.removeForBoard(boardId, id, auth);
  }

  @Get('user-invite')
  findAllForUser(
    @Auth() auth: AuthPayload,
  ) {
    return this.userInviteService.findAllForUser(auth);
  }

  @Get('user-invite/:id')
  findOneForUser(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
  ) {
    return this.userInviteService.findOneForUser(id, auth);
  }

  @Put('user-invite/:id')
  approveForUser(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
  ) {
    return this.userInviteService.approveForUser(id, auth);
  }

  @Delete('user-invite/:id')
  removeForUser(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
  ) {
    return this.userInviteService.removeForUser(id, auth);
  }
}

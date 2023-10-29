import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiOAuth2 } from '@nestjs/swagger';
import { Auth, AuthPayload } from '../authz/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiOAuth2([], 'Auth0')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  findAll(
    @Auth() auth: AuthPayload,
  ) {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
  ) {
    return this.userService.findOne(id, auth);
  }

  @Patch()
  update(
    @Auth() auth: AuthPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(updateUserDto, auth);
  }

  @Delete()
  remove(
    @Auth() auth: AuthPayload,
  ) {
    return this.userService.remove(auth);
  }
}

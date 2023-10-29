import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Auth, AuthPayload } from '../authz/auth.decorator';
import { ApiOAuth2 } from '@nestjs/swagger';

@Controller('notification')
@ApiOAuth2([], 'Auth0')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(
    @Auth() auth: AuthPayload,
  ) {
    return this.notificationService.findAll(auth);
  }

  @Get(':id')
  findOne(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
  ) {
    return this.notificationService.findOne(id, auth);
  }

  @Patch(':id')
  update(
    @Auth() auth: AuthPayload,
    @Param('id') id: string, 
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto, auth);
  }

  @Delete(':id')
  remove(
    @Auth() auth: AuthPayload,
    @Param('id') id: string,
  ) {
    return this.notificationService.remove(id, auth);
  }
}

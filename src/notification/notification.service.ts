import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthPayload } from '../authz/auth.decorator';
import { User } from '../user/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {

  constructor(
    @InjectModel(Notification) private readonly notificationModel: typeof Notification,
  ) { }

  create(createNotificationDto: CreateNotificationDto, forUsers: User['user_id'][], auth: AuthPayload) {
    return this.notificationModel.bulkCreate(forUsers.map(userId => ({
      ...createNotificationDto,
      userId,
    })));
  }

  findAll(auth: AuthPayload) {
    return this.notificationModel.findAll({
      where: {
        userId: auth.sub,
      }
    });
  }

  findOne(id: string, auth: AuthPayload) {
    return this.notificationModel.findOne({
      where: {
        id,
        userId: auth.sub,
      }
    });;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto, auth: AuthPayload) {
    const notification = await this.findOne(id, auth);
    return notification.update({
      read: updateNotificationDto.read,
    })
  }

  async remove(id: string, auth: AuthPayload) {
    const notification = await this.findOne(id, auth);
    await notification.destroy();
    return notification;
  }

  async removeForBoard(boardId: string, auth: AuthPayload) {
    const notifications = await this.notificationModel.destroy({
      where: {
        'data.board.id': boardId,
      },
    });
    return notifications;
  }
}

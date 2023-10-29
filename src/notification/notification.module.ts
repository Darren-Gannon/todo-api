import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './entities/notification.entity';

@Module({
  controllers: [
    NotificationController,
  ],
  providers: [
    NotificationService,
  ],
  imports: [
    SequelizeModule.forFeature([Notification]),
  ],
  exports: [
    NotificationService,
  ]
})
export class NotificationModule {}

import { Module } from '@nestjs/common';
import { UserInviteService } from './user-invite.service';
import { UserInviteController } from './user-invite.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserInvite } from './entities/user-invite.entity';
import { Board } from '../entities/board.entity';
import { NotificationModule } from '../../notification/notification.module';
import { AuthzManagementModule } from '../../authz-management';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [UserInviteController],
  providers: [UserInviteService],
  imports: [
    SequelizeModule.forFeature([UserInvite, Board]),
    NotificationModule,
    AuthzManagementModule.forFeature(),
    UserModule.forFeature(),
  ],
})
export class UserInviteModule {}

import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Board } from './entities/board.entity';
import { AuthzManagementModule } from '../authz-management/authz-management.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from './user/user.module';
import { UserInviteModule } from './user-invite/user-invite.module';
import { User } from './user/entities/user.entity';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
  imports: [
    SequelizeModule.forFeature([Board, User]),
    AuthzManagementModule.forFeature(),
    NotificationModule,
    UserModule.forFeature(),
    UserInviteModule,
  ],
  exports: [BoardService],
})
export class BoardModule {}

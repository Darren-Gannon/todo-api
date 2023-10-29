import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthzManagementModule } from '../authz-management';

@Module({
  imports: [
    AuthzManagementModule.forFeature(),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

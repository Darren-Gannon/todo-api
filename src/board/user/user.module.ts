import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthzManagementModule } from '../../authz-management';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { UserModuleConfig } from './user.module-config';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    AuthzManagementModule.forFeature(),
    SequelizeModule.forFeature([User])
  ],
  exports: [
    UserService,
  ]
})
export class UserModule extends createConfigurableDynamicRootModule<
UserModule,
UserModuleConfig
>(UserModuleConfig) {
    static forFeature() {
        return UserModule.externallyConfigured(UserModule, 0)
    }
}

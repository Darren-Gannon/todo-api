import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './authz.module-definition';
import { AuthzGuard } from './authz.guard';
import { PermissionGuard } from './permission.guard';

@Module({
    providers: [
        AuthzGuard,
        PermissionGuard,
    ],
    exports: [
        AuthzGuard,
        PermissionGuard,
    ],
})
export class AuthzModule extends ConfigurableModuleClass {
}

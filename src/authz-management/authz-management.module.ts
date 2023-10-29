import { Module } from '@nestjs/common';
import { AuthzManagementModuleConfig } from './authz-management.module-config';
import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { AuthenticationClient, ManagementClient } from 'auth0';
import { HttpModule } from '@nestjs/axios';
import { PermissionService } from './permission/permission.service';

@Module({
    imports: [
        HttpModule,
    ],
    providers: [
        {
            provide: ManagementClient,
            inject: [AuthzManagementModuleConfig],
            useFactory: (config: AuthzManagementModuleConfig) => new ManagementClient({
                domain: config.domain,
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                audience: `https://${config.domain}/api/v2/`,
            })
        },
        {
            provide: AuthenticationClient,
            inject: [AuthzManagementModuleConfig],
            useFactory: (config: AuthzManagementModuleConfig) => new AuthenticationClient({
                domain: config.domain,
                clientId: config.clientId,
            })
        },
        PermissionService,
    ],
    exports: [
        ManagementClient,
        PermissionService,
    ],
})
export class AuthzManagementModule extends createConfigurableDynamicRootModule<
AuthzManagementModule,
AuthzManagementModuleConfig
>(AuthzManagementModuleConfig) {
    static forFeature() {
        return AuthzManagementModule.externallyConfigured(AuthzManagementModule, 0)
    }
}

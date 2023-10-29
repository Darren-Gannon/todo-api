import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './authz.module-definition';
import { AuthzGuard } from './authz.guard';

@Module({
    providers: [
        AuthzGuard,
    ],
    exports: [
        AuthzGuard,
    ],
})
export class AuthzModule extends ConfigurableModuleClass {
}

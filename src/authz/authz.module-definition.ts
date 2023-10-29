import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AuthzConfig } from './authz-config';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AuthzConfig>().build();
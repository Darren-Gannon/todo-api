import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { auth } from 'express-oauth2-jwt-bearer';
import { MODULE_OPTIONS_TOKEN } from './authz.module-definition';
import { AuthzConfig } from './authz-config';

@Injectable()
export class AuthzGuard implements CanActivate {

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private config: AuthzConfig,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const jwtCheck = auth({
      audience: this.config.audience,
      issuerBaseURL: `https://${ this.config.domain }/`,
      tokenSigningAlg: 'RS256'
    })

    const ctx = context.switchToHttp();
    return new Promise((resolve, reject) => {
      
      jwtCheck(ctx.getRequest(), ctx.getResponse(), (err) => {
        if(err)
          resolve(false);
        resolve(true);
      })
    })
  }
}

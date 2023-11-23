import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredPermissionGenerators = this.reflector.getAllAndOverride<((ctx: ExecutionContext) => string[])[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissionGenerators)
      return true;

    if(context.getType() != 'http')
      throw new Error('PermissionGuard only supports http contexts');

    const requiredPermissions = requiredPermissionGenerators.map(generator => generator(context)).reduce((acc, val) => acc.concat(val), []);

    const req = context.switchToHttp().getRequest();
    const userPermissions: string[] = req.auth?.payload?.permissions ?? [];

    const hasAllPermissions = requiredPermissions.every(requiredPermission => userPermissions.includes(requiredPermission));
    
    return hasAllPermissions;
  }
}

const PERMISSIONS_KEY = 'permissions';
export const Permission = (...grants: ((ctx: ExecutionContext) => string[])[]) => SetMetadata(PERMISSIONS_KEY, grants);
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Auth = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.auth.payload;
    },
);

export class AuthPayload {
    iss: string;
    sub: string;
    aud: string;
    iat: number;
    exp: number;
    azp: string;
    scope: string;
}
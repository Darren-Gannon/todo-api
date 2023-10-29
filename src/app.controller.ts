import { Controller, Get } from '@nestjs/common';
import { ApiOAuth2, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Auth, AuthPayload } from './authz/auth.decorator';

@Controller()
@ApiOAuth2([], 'Auth0')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({
    description: 'The current date and time in the ISO standard',
  })
  @Get()
  getHello(
  ): string {
    return this.appService.getDate().toISOString();
  }
}

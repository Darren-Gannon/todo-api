import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthzGuard } from './authz/authz.guard';

export class DelayTimerGuard {

  constructor(
    private readonly delay: number,
  ) { }
  async canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), this.delay);
    });
  }
}
const BOOTSTRAP_LOGGER = new Logger('Bootstrap')
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(app.get(AuthzGuard));
  // app.useGlobalGuards(new DelayTimerGuard(2000));
  app.enableShutdownHooks();

  const config = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('To Do Api')
    .setVersion('1.0')
    .addTag('todo')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        implicit: {
          authorizationUrl: `https://${ config.get('AUTH0_DOMAIN') }/authorize?audience=${ config.get('AUTH0_AUDIENCE') }`,
          tokenUrl: config.get('AUTH0_AUDIENCE'),
          scopes: {
            openid: 'Open Id',
            profile: 'Profile',
            email: 'E-mail',
          },
        },
      },
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    }, 'Auth0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/', app, document, {
    swaggerOptions: {
      initOAuth: {
        // this will pre-fill the client id in the Swagger authorization form
        clientId: config.get('AUTH0_CLIENT_ID'),
      },
    },
  });

  const port = config.get('PORT');

  await app.listen(port);
}
bootstrap();

import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthzModule } from './authz/authz.module';
import { BoardModule } from './board/board.module';
import { StateModule } from './board/state/state.module';
import { TaskModule } from './board/task/task.module';
import { AuthzManagementModule } from './authz-management';
import { UserModule } from './user/user.module';
import { UserModule as BoardUserModule } from './board/user/user.module';
import { NotificationModule } from './notification/notification.module';

const DATABASE_LOGGER = new Logger('Database');

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().port().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        AUTH0_DOMAIN: Joi.string().required(),
        AUTH0_AUDIENCE: Joi.string().required(),
        AUTH0_CLIENT_ID: Joi.string().required(),
        AUTH0_CLIENT_SECRET: Joi.string().required(),
        AUTH0_RESOURCE_ID: Joi.string().required(),
      }),
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get('DATABASE_HOST'),
        port: config.get('DATABASE_PORT'),
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        autoLoadModels: true,
        logging: sql => DATABASE_LOGGER.verbose(sql),
        synchronize: true,
      })
    }),
    BoardModule,
    StateModule,
    TaskModule,
    AuthzModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        domain: config.get('AUTH0_DOMAIN'),
        audience: config.get('AUTH0_AUDIENCE'),
      })
    }),
    AuthzManagementModule.forRootAsync(AuthzManagementModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        domain: config.get('AUTH0_DOMAIN'),
        clientId: config.get('AUTH0_CLIENT_ID'),
        clientSecret: config.get('AUTH0_CLIENT_SECRET'),
        resourceId: config.get('AUTH0_RESOURCE_ID'),
      }),
    }),
    UserModule,
    BoardUserModule.forRootAsync(BoardUserModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        audience: config.get('AUTH0_AUDIENCE'),
      }),
    }),
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }

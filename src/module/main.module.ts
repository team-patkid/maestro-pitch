import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  activityMemberResource,
  activityResource,
  addressResource,
  categoryResource,
  logExperienceResource,
  usersResource,
} from 'src/adminjs/resource';
import { AppController } from 'src/app.controller';
import { ConfigService } from 'src/config/config.service';
import { ServiceExceptionFilter } from 'src/filter/service.exception.filter';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ClientModule } from './client/client.module';
import { DatabaseService } from './database/database.service';
import { UsersModule } from './users/users.module';

const DEFAULT_ADMIN = {
  email: ConfigService.getConfig().ADMIN.ID,
  password: ConfigService.getConfig().ADMIN.PASSWORD,
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

const AdminJSModule = import('adminjs');
const AdminJsTypeOrm = import('@adminjs/typeorm');
AdminJSModule.then(async (v) =>
  v.AdminJS.registerAdapter({
    Database: await AdminJsTypeOrm.then((v) => {
      return v.Database;
    }),
    Resource: await AdminJsTypeOrm.then((v) => {
      return v.Resource;
    }),
  }),
);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    AuthModule,
    ClientModule,
    UsersModule,
    CategoryModule,
    ActivityModule,
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              usersResource,
              activityResource,
              activityMemberResource,
              addressResource,
              categoryResource,
              logExperienceResource,
            ],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
          branding: {
            companyName: 'Maestro Pitch Admin',
          },
          locale: {
            translations: {
              labels: {
                UsersEntity: '유저',
              },
            },
          },
        }),
      }),
    ),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ServiceExceptionFilter,
    },
  ],
})
export class MainModule {}

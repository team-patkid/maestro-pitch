import { HttpStatus, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as Sentry from '@sentry/node';
import rTracer from 'cls-rtracer';
import helmet from 'helmet';
import moment from 'moment-timezone';
import morganBody from 'morgan-body';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { version } from '../package.json';
import { ConfigService } from './config/config.service';
import { setupSwagger } from './global/swagger';
import { LogProvider } from './log/logProvider';
import { MainModule } from './module/main.module';

async function bootstrap() {
  initializeTransactionalContext();

  moment.tz.setDefault('Asia/Seoul');

  const port = ConfigService.getConfig().PORT;

  const app = await NestFactory.create<NestExpressApplication>(
    MainModule,
    new ExpressAdapter(),
    { cors: true },
  );

  // 버전 관리
  app.setGlobalPrefix(ConfigService.getConfig().API_VERSION, {
    exclude: [{ path: '/health', method: RequestMethod.GET }],
  });

  // 문서 모듈
  setupSwagger(app);

  app.use(rTracer.expressMiddleware());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableShutdownHooks();

  // 에러 모듈
  Sentry.init({
    dsn: ConfigService.getConfig().SENTRY_DSN,
    enabled: true,
    release: version,
    environment: ConfigService.getConfig().ENV,
    attachStacktrace: true,
  });

  // request, response 로그 관리
  morganBody(app.getHttpAdapter().getInstance(), {
    noColors: true,
    prettify: false,
    includeNewLine: false,
    logRequestBody: true,
    logAllReqHeader: true,
    stream: {
      write: (message: string) => {
        let convertMessage: Record<string, any>;
        let method: string;
        try {
          if (message.includes('Request Body')) {
            convertMessage = JSON.parse(
              message.replace('\n', '').replace('Request Body: ', ''),
            );
            method = 'Request Body';
          } else if (message.includes('Response Body')) {
            convertMessage = JSON.parse(
              message.replace('\n', '').replace('Response Body: ', ''),
            );
            method = 'Response Body';
          } else {
            convertMessage = { message };
            method = 'Http';
          }
        } catch {
          convertMessage = { message };
          method = 'Http';
        }

        LogProvider.info(convertMessage, method);
        return true;
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      dismissDefaultMessages: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
      validationError: {
        target: true,
        value: true,
      },
    }),
  );

  await app.listen(port);

  console.info(
    `Server ${ConfigService.getConfig().ENV} running on port ${port}`,
    'APP',
  );
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as Sentry from '@sentry/node';
import rTracer from 'cls-rtracer';
import moment from 'moment-timezone';
import morganBody from 'morgan-body';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { version } from '../package.json';
import { ConfigService } from './config/config.service';
import { setupSwagger } from './global/swagger';
import { LogProvider } from './log/logProvider';
import { MainModule } from './module/main.module';
import helmet from 'helmet';

async function bootstrap() {
  initializeTransactionalContext();

  moment.tz.setDefault('Asia/Seoul');

  const port = ConfigService.getConfig().PORT;

  const app = await NestFactory.create<NestExpressApplication>(
    MainModule,
    new ExpressAdapter(),
    { cors: true },
  );

  app.setGlobalPrefix(ConfigService.getConfig().API_VERSION);

  setupSwagger(app);
  app.use(rTracer.expressMiddleware());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableShutdownHooks();

  Sentry.init({
    dsn: ConfigService.getConfig().SENTRY_DSN,
    enabled: true,
    release: version,
    environment: ConfigService.getConfig().ENV,
    attachStacktrace: true,
  });

  morganBody(app.getHttpAdapter().getInstance(), {
    noColors: true,
    prettify: false,
    includeNewLine: false,
    logRequestBody: true,
    logAllReqHeader: true,
    stream: {
      write: (message: string) => {
        LogProvider.info({ message }, 'Request Data');
        return true;
      },
    },
  });

  await app.listen(port);

  console.info(
    `Server ${ConfigService.getConfig().ENV} running on port ${port}`,
    'APP',
  );
}
bootstrap();

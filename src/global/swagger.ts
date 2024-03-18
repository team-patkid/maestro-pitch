import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ConfigService } from 'src/config/config.service';
import { AuthHeader } from 'src/module/auth/enum/auth.enum';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Maestro Api Document')
    .setDescription('Maestro Api Document')
    .setVersion(ConfigService.getConfig().API_VERSION)
    .addBearerAuth(
      {
        name: 'Authorization',
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'User Authorization Token',
      },
      AuthHeader.BEARER,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  // SwaggerModule.setup('/api', app, document);
}

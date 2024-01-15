import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from 'src/config/config.service';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Maestro Api Document')
    .setDescription('Maestro Api Document')
    .setVersion(ConfigService.getConfig().API_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api', app, document);
}

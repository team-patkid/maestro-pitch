import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/repository/repository.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [RepositoryModule],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}

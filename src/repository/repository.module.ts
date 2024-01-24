import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogExperienceEntity } from './entity/log-experience.entity';
import { UsersEntity } from './entity/users.entity';
import { LogExperienceRepositoryService } from './service/log-experience.repository.service';
import { UsersRepositoryService } from './service/users.repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, LogExperienceEntity])],
  providers: [UsersRepositoryService, LogExperienceRepositoryService],
  exports: [UsersRepositoryService, LogExperienceRepositoryService],
})
export class RepositoryModule {}

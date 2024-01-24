import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { UsersRepositoryService } from './service/users.repository.service';
import { LogExperienceRepositoryService } from './service/log-experience.repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersRepositoryService, LogExperienceRepositoryService],
  exports: [UsersRepositoryService, LogExperienceRepositoryService],
})
export class RepositoryModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from './entity/activity.entity';
import { AddressEntity } from './entity/address.entity';
import { CategoryEntity } from './entity/category.entity';
import { LogExperienceEntity } from './entity/log-experience.entity';
import { UsersEntity } from './entity/users.entity';
import { ActivityRepositoryService } from './service/activity.repository.service';
import { AddressRepositoryService } from './service/address.repository.service';
import { CategoryRepositoryService } from './service/category.repository.service';
import { LogExperienceRepositoryService } from './service/log-experience.repository.service';
import { UsersRepositoryService } from './service/users.repository.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      LogExperienceEntity,
      AddressEntity,
      CategoryEntity,
      ActivityEntity,
    ]),
  ],
  providers: [
    UsersRepositoryService,
    LogExperienceRepositoryService,
    AddressRepositoryService,
    CategoryRepositoryService,
    ActivityRepositoryService,
  ],
  exports: [
    UsersRepositoryService,
    LogExperienceRepositoryService,
    AddressRepositoryService,
    CategoryRepositoryService,
    ActivityRepositoryService,
  ],
})
export class RepositoryModule {}

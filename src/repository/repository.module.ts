import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from './entity/activity.entity';
import { ActivityMemberEntity } from './entity/activity.member.entity';
import { AddressEntity } from './entity/address.entity';
import { CategoryEntity } from './entity/category.entity';
import { LogExperienceEntity } from './entity/log-experience.entity';
import { UsersEntity } from './entity/users.entity';
import { ActivityMemberRepositoryService } from './service/activity.member.activity.service';
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
      ActivityMemberEntity,
    ]),
  ],
  providers: [
    UsersRepositoryService,
    LogExperienceRepositoryService,
    AddressRepositoryService,
    CategoryRepositoryService,
    ActivityRepositoryService,
    ActivityMemberRepositoryService,
  ],
  exports: [
    UsersRepositoryService,
    LogExperienceRepositoryService,
    AddressRepositoryService,
    CategoryRepositoryService,
    ActivityRepositoryService,
    ActivityMemberRepositoryService,
  ],
})
export class RepositoryModule {}

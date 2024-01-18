import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { UsersRepositoryService } from './service/users.repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersRepositoryService],
  exports: [UsersRepositoryService],
})
export class RepositoryModule {}

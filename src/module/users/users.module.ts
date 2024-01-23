import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/repository/repository.module';
import { AuthModule } from '../auth/auth.module';
import { ClientModule } from '../client/client.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [RepositoryModule, AuthModule, ClientModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

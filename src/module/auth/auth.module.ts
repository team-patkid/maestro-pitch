import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from '../client/client.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ClientModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

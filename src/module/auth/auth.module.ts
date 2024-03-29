import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';
import { ClientModule } from '../client/client.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Global()
@Module({
  imports: [
    ClientModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: ConfigService.getConfig().JWT.SECRET,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

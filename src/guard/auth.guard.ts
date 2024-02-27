import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ErrorCode, ErrorStatus } from 'src/exception/enum/error.enum';
import { HttpError } from 'src/exception/service.error';
import { AuthService } from 'src/module/auth/auth.service';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      throw new HttpError(
        ErrorCode.UNAUTHORIZED,
        ErrorStatus[ErrorCode.UNAUTHORIZED],
      );
    }
    const user = await this.authService.decodeJwt(token);
    if (!user) {
      throw new HttpError(
        ErrorCode.UNAUTHORIZED,
        ErrorStatus[ErrorCode.UNAUTHORIZED],
      );
    }
    request.userEntity = user;
    request.token = token;
    return true;
  }
}

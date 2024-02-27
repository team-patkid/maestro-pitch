import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ErrorCode, ErrorStatus } from 'src/exception/enum/error.enum';
import { HttpError } from 'src/exception/service.error';
import { AuthService } from 'src/module/auth/auth.service';
import { UsersEntity } from 'src/repository/entity/users.entity';
import { TypeUsersStatus } from 'src/repository/enum/users.repository.enum';
import { UsersRepositoryService } from 'src/repository/service/users.repository.service';

export class NormalGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,

    @Inject(UsersRepositoryService)
    private readonly usersRepositoryService: UsersRepositoryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const jwt =
      request.headers.authorization === undefined
        ? null
        : request.headers.authorization.split(' ')[1];

    if (!jwt)
      throw new HttpError(
        ErrorCode.UNAUTHORIZED,
        ErrorStatus[ErrorCode.UNAUTHORIZED],
      );

    const payload = await this.authService.decodeJwt<UsersEntity>(jwt);

    const userInfo = await this.usersRepositoryService.findUsersInfoById(
      payload.id,
    );

    if (!userInfo || userInfo.status !== TypeUsersStatus.NORMAL) {
      throw new HttpError(
        ErrorCode.NOT_NORMAL_USER,
        ErrorStatus[ErrorCode.NOT_NORMAL_USER],
      );
    }

    request.userEntity = userInfo;
    request.token = jwt;

    return true;
  }
}

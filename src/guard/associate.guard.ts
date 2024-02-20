import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ErrorCode, ErrorStatus } from 'src/exception/enum/error.enum';
import { HttpError } from 'src/exception/service.error';
import { AuthService } from 'src/module/auth/auth.service';
import { UsersEntity } from 'src/repository/entity/users.entity';
import { TypeUsersStatus } from 'src/repository/enum/users.repository.enum';
import { UsersRepositoryService } from 'src/repository/service/users.repository.service';

@Injectable()
export class AssociateGuard implements CanActivate {
  constructor(
    @Inject(UsersRepositoryService)
    private readonly usersRepositoryService: UsersRepositoryService,

    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const jwt = request.headers.authorization.split(' ')[1];

    if (!jwt)
      throw new HttpError(
        ErrorCode.UNAUTHORIZED,
        ErrorStatus[ErrorCode.UNAUTHORIZED],
      );

    const payload = await this.authService.decodeJwt<UsersEntity>(jwt);

    const userInfo = await this.usersRepositoryService.getUsersInfo(
      plainToClass(UsersEntity, { id: payload.id }),
    );

    if (userInfo.status === TypeUsersStatus.NORMAL)
      throw new HttpError(
        ErrorCode.ALREADY_AUTHENTICATED,
        ErrorStatus[ErrorCode.ALREADY_AUTHENTICATED],
      );

    if (userInfo.status !== TypeUsersStatus.ASSOCIATE)
      throw new HttpError(
        ErrorCode.NOT_ASSOCIATE_USER,
        ErrorStatus[ErrorCode.NOT_ASSOCIATE_USER],
      );

    request.userEntity = userInfo;
    request.token = jwt;

    return true;
  }
}

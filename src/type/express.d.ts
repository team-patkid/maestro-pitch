import { UsersEntity } from 'src/repository/entity/users.entity';

declare global {
  namespace Express {
    interface Request {
      userEntity: UsersEntity;
      token: string;
    }
  }
}

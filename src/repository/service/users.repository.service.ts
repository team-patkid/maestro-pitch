import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/exception/enum/error.enum';
import { ServiceError } from 'src/exception/service.error';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entity/users.entity';

@Injectable()
export class UsersRepositoryService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async getUsersInfo(entity: UsersEntity): Promise<UsersEntity> {
    const result = await this.userRepository.findOneBy({ ...entity });

    if (!result) throw new ServiceError(ErrorCode.NOT_FOUND_CONTENT);

    return result;
  }

  async findUsersInfo(dto: UsersEntity): Promise<UsersEntity | null> {
    const result = await this.userRepository.findOneBy({ ...dto });

    return result;
  }

  async insertUserInfo(dto: UsersEntity): Promise<UsersEntity> {
    const insertResult = await this.userRepository.insert(dto);

    const result = await this.userRepository.findOne({
      where: { id: insertResult.identifiers[0].id },
    });

    if (!result) throw new ServiceError(ErrorCode.NOT_FOUND_CONTENT);

    return result;
  }

  async updateUserInfo(
    where: UsersEntity,
    update: UsersEntity,
  ): Promise<UsersEntity> {
    await this.userRepository.update(
      Object.fromEntries(Object.entries(where).filter(([_, value]) => value)),
      update,
    );

    const result = await this.userRepository.findOne({
      where: { ...where },
    });

    if (!result) throw new ServiceError(ErrorCode.NOT_FOUND_CONTENT);

    return result;
  }
}

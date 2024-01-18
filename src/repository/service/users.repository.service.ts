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

  async getMaestroPitchUsersInfo(dto: UsersEntity): Promise<UsersEntity> {
    const result = await this.userRepository.findOneBy({ ...dto });

    if (!result) throw new ServiceError(ErrorCode.NOT_FOUND_CONTENT);

    return result;
  }

  async findMaestroPitchUsersInfo(
    dto: UsersEntity,
  ): Promise<UsersEntity | null> {
    const result = await this.userRepository.findOneBy({ ...dto });

    return result;
  }

  async upsertMaestroPitchUserInfo(dto: UsersEntity): Promise<UsersEntity> {
    const result = await this.userRepository.save(dto);

    return result;
  }

  async updateMaestroPitchUserInfo(
    where: UsersEntity,
    update: UsersEntity,
  ): Promise<UsersEntity> {
    await this.userRepository.update({ ...where }, update);

    const result = await this.userRepository.findOne({
      where: { ...where },
    });
    if (!result) throw new ServiceError(ErrorCode.NOT_FOUND_CONTENT);

    return result;
  }
}

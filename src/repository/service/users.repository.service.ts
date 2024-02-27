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

  async getUsersInfoById(id: number): Promise<UsersEntity> {
    const result = await this.userRepository.findOne({
      where: { id },
      relations: ['address'],
    });

    if (!result) throw new ServiceError(ErrorCode.NOT_FOUND_CONTENT);

    return result;
  }

  async findUsersInfoById(id: number): Promise<UsersEntity | null> {
    const result = await this.userRepository.findOne({
      where: { id },
      relations: ['address'],
    });

    return result;
  }

  async findUsersInfoByKakaoPk(kakaoPk: string): Promise<UsersEntity | null> {
    const result = await this.userRepository.findOne({
      where: { kakaoPk },
      relations: ['address'],
    });

    return result;
  }

  async insertUserInfo(dto: UsersEntity): Promise<UsersEntity> {
    console.log('DTO ::: ', dto);
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

    const result = await this.findUsersInfoById(where.id);

    if (!result) throw new ServiceError(ErrorCode.NOT_FOUND_CONTENT);

    return result;
  }
}

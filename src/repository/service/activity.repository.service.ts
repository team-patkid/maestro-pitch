import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ActivityEntity } from '../entity/activity.entity';
import { TypeActivityStatus } from '../enum/activity.repository.enum';

@Injectable()
export class ActivityRepositoryService {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activityRepository: Repository<ActivityEntity>,
  ) {}

  async findAndCountAll(): Promise<[ActivityEntity[], number]> {
    const findAndCount = this.activityRepository.findAndCount({
      where: {
        status: In([TypeActivityStatus.NORMAL, TypeActivityStatus.DONE]),
      },
      relations: ['activityMember'],
    });

    return findAndCount;
  }

  async findAndCountAllByCategoryId(
    categoryId: number,
  ): Promise<[ActivityEntity[], number]> {
    const findAndCount = this.activityRepository.findAndCount({
      where: {
        status: In([TypeActivityStatus.NORMAL, TypeActivityStatus.DONE]),
        categoryId,
      },
      relations: ['activityMember'],
    });

    return findAndCount;
  }

  async postActivity(entity: ActivityEntity): Promise<boolean> {
    const result = await this.activityRepository.save(entity);

    return !!result;
  }
}

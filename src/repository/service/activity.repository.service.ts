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

  async findAll(): Promise<ActivityEntity[]> {
    return this.activityRepository.find({
      where: {
        statuts: In([TypeActivityStatus.NORMAL, TypeActivityStatus.DONE]),
      },
      relations: ['user', 'category'],
    });
  }
}

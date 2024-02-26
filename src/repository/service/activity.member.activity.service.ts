import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityMemberEntity } from '../entity/activity.member.entity';

@Injectable()
export class ActivityMemberRepositoryService {
  constructor(
    @InjectRepository(ActivityMemberEntity)
    private readonly activityMemberRepository: Repository<ActivityMemberEntity>,
  ) {}

  async bulkInsert(activityMember: ActivityMemberEntity[]) {
    await this.activityMemberRepository.insert(activityMember);
  }
}

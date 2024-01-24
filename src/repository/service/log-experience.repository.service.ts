import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Between, Repository } from 'typeorm';
import { LogExperienceEntity } from '../entity/log-experience.entity';
import { TypeLogExperienceActivity } from '../enum/log-experience.repository.enum';

@Injectable()
export class LogExperienceRepositoryService {
  constructor(
    @InjectRepository(LogExperienceEntity)
    private readonly logExperienceRepository: Repository<LogExperienceEntity>,
  ) {}

  async insertLogExperience(entity: LogExperienceEntity) {
    await this.logExperienceRepository.insert(entity);
  }

  async findLoginExperienceInToday(
    userId: number,
  ): Promise<LogExperienceEntity> {
    const result = await this.logExperienceRepository.findOneBy({
      userId,
      activity: TypeLogExperienceActivity.LOGIN,
      inputDate: Between(
        new Date(new Date().setUTCHours(0, 0, 0, 0)),
        new Date(new Date().setUTCHours(23, 59, 59)),
      ),
    });

    return plainToInstance(LogExperienceEntity, result);
  }
}

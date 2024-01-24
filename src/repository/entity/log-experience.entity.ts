import { plainToInstance } from 'class-transformer';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  MaestroLogExperienceActivityPoint,
  TypeLogExperienceActivity,
  TypeLogExperienceOperation,
  TypeLogExperienceStatus,
} from '../enum/log-experience.repository.enum';
import { UsersEntity } from './users.entity';

@Entity('log_experience')
export class LogExperienceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int4')
  userId: number;

  @Column('int4', { nullable: false })
  point: number;

  @Column('enum', {
    enum: TypeLogExperienceActivity,
    default: TypeLogExperienceActivity.LOGIN,
    nullable: false,
  })
  activity: TypeLogExperienceActivity;

  @Column('enum', {
    enum: TypeLogExperienceOperation,
    default: TypeLogExperienceOperation.PLUS,
    nullable: false,
  })
  operation: TypeLogExperienceOperation;

  @Column('enum', {
    enum: TypeLogExperienceStatus,
    default: TypeLogExperienceStatus.NORMAL,
    nullable: false,
  })
  status: TypeLogExperienceStatus;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  inputDate: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;

  @Column('text', { nullable: true })
  comment: string;

  static from(
    userId: number,
    point: number,
    activity: TypeLogExperienceActivity,
    operation: TypeLogExperienceOperation,
  ): LogExperienceEntity {
    return plainToInstance(this, {
      userId,
      point,
      activity,
      operation,
    });
  }

  setLoginExperienceInfo(userId: number) {
    this.userId = userId;
    this.point =
      MaestroLogExperienceActivityPoint[TypeLogExperienceActivity.LOGIN];
    this.activity = TypeLogExperienceActivity.LOGIN;
    this.operation = TypeLogExperienceOperation.PLUS;
  }

  @BeforeInsert()
  async updateExperiencePoint() {
    const userEntity = await UsersEntity.findOneBy({ id: this.userId });

    if (userEntity) {
      userEntity.experience += this.point;

      await userEntity.save();
    }
  }
}

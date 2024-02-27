import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  TypeActivityMemberStatus,
  TypeActivityMemberType,
} from '../enum/activity.member.enum';
import { IActivityMemberContent } from '../interface/activity.member.repository.dto.impl';
import { ActivityEntity } from './activity.entity';
import { UsersEntity } from './users.entity';

@Entity('activity_member')
export class ActivityMemberEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'activity_id' })
  activityId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column('jsonb', {
    nullable: false,
    comment: `
    각 활동에 필요한 유저 정보 (축구, 야구, 탁구, 등)
    example: { position: 'GK', backNumber: 1, how: 'left', style: 'ST' }
  `,
  })
  content: IActivityMemberContent;

  @Column('enum', {
    enum: TypeActivityMemberType,
    default: TypeActivityMemberType.NORMAL,
    nullable: false,
  })
  type: TypeActivityMemberType;

  @Column('enum', {
    enum: TypeActivityMemberStatus,
    default: TypeActivityMemberStatus.WAIT,
    nullable: false,
  })
  status: TypeActivityMemberStatus;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  inputDate: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;

  @ManyToOne(() => ActivityEntity, (activity) => activity.activityMember, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: process.env.NODE_ENV !== 'test',
  })
  @JoinColumn({ name: 'activity_id' })
  activity: ActivityEntity;

  @ManyToOne(() => UsersEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: process.env.NODE_ENV !== 'test',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypeActivityStatus } from '../enum/activity.repository.enum';
import { IActivityContent } from '../interface/activity.repository.dto.impl';
import { ActivityMemberEntity } from './activity.member.entity';
import { CategoryEntity } from './category.entity';
import { UsersEntity } from './users.entity';

@Entity('activity')
export class ActivityEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => UsersEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column('varchar', { length: 100, nullable: false })
  title: string;

  @Column('varchar', { length: 255, nullable: false })
  place: string;

  @Column('varchar', { length: 2000, nullable: false })
  placeUrl: string;

  @Column('varchar', { length: 255, nullable: false })
  x: string;

  @Column('varchar', { length: 255, nullable: false })
  y: string;

  @Column('int4', { nullable: false })
  participantsMax: number;

  @Column('jsonb', {
    nullable: false,
    comment: `
      각 활동에 필요한 정보 (축구, 야구, 탁구 등) 
      example:
        축구: {
            categoryId: 1
            type: full, half, foot, education
            formation: 3142, 343, 352, 41212, 4141, 4231, 424, 433, 4411, 442, 532, 541
          }
    `,
  })
  content: IActivityContent;

  @Column('enum', {
    enum: TypeActivityStatus,
    default: TypeActivityStatus.NORMAL,
  })
  status: TypeActivityStatus;

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

  @OneToMany(
    () => ActivityMemberEntity,
    (activityMember) => activityMember.activity,
  )
  activityMember?: ActivityMemberEntity[];
}

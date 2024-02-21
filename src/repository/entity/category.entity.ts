import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypeMaestroCategoryStatus } from '../enum/category.enum';

@Entity('category')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255, nullable: false })
  title: string;

  @Column('varchar', { length: 2000, nullable: false })
  description: string;

  @Column('varchar', { length: 2000, nullable: false })
  video: string;

  @Column('varchar', { length: 2000, nullable: false })
  image: string;

  @Column('varchar', { length: 2000, nullable: false })
  logo: string;

  @Column('boolean', { default: false, nullable: false })
  isHot: boolean;

  @Column('int4', { nullable: false })
  sort: number;

  @Column('enum', {
    enum: TypeMaestroCategoryStatus,
    default: TypeMaestroCategoryStatus.NORMAL,
    nullable: false,
  })
  status: TypeMaestroCategoryStatus;

  @CreateDateColumn({
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  inputDate: Date;

  @UpdateDateColumn({
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;
}

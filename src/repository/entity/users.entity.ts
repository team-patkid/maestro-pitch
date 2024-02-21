import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  TypeUsersGender,
  TypeUsersSns,
  TypeUsersStatus,
} from '../enum/users.repository.enum';
import { AddressEntity } from './address.entity';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { nullable: true, length: 100 })
  email?: string;

  @Column('varchar', { nullable: true, length: 10 })
  name?: string;

  @Column('varchar', { nullable: true, length: 15 })
  contact?: string;

  @Column('int8', { nullable: false, default: 0 })
  experience: number;

  @Column('enum', {
    enum: TypeUsersGender,
    default: TypeUsersGender.NONE,
    nullable: false,
  })
  gender: TypeUsersGender;

  @Column('enum', { enum: TypeUsersSns, nullable: false })
  sns: TypeUsersSns;

  @Column('enum', {
    enum: TypeUsersStatus,
    default: TypeUsersStatus.ASSOCIATE,
    nullable: false,
  })
  status: TypeUsersStatus;

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

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  visitDate?: Date;

  @Column('varchar', { length: 15, nullable: true })
  kakaoPk?: string;

  @Column('text', { nullable: true })
  comment?: string;

  @OneToMany(() => AddressEntity, (address) => address.user)
  address?: Array<AddressEntity>;
}

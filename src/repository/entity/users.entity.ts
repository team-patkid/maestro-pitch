import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  TypeUsersGender,
  TypeUsersSns,
  TypeUsersStatus,
} from '../enum/users.repository.enum';

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

  @Column('enum', { enum: TypeUsersSns, nullable: true })
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
  })
  visitDate: Date;

  @Column('varchar', { length: 15, nullable: true })
  kakaoPk?: number;

  @Column('text', { nullable: true })
  comment?: string;

  toObject(): Record<string, any> {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      contact: this.contact,
      experience: this.experience,
      gender: this.gender,
      sns: this.sns,
      status: this.status,
      inputDate: this.inputDate,
      updateDate: this.updateDate,
      visitDate: this.visitDate,
      kakaoPk: this.kakaoPk,
      comment: this.comment,
    };
  }
}

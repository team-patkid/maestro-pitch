import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypeAddressStatus } from '../enum/address.repository.enum';
import { UsersEntity } from './users.entity';

@Entity('address')
export class AddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  userId: number;

  @Column('varchar', { length: 255 })
  address: string;

  @Column('enum', {
    enum: TypeAddressStatus,
    default: TypeAddressStatus.NORMAL,
  })
  status: TypeAddressStatus;

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

  @ManyToOne(() => UsersEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
    createForeignKeyConstraints: process.env.NODE_ENV === 'test',
  })
  user: UsersEntity;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomStatus } from './enum';
import { StatusModel } from './status.entity';
import { UserModel } from './user.entity';

@Entity({ name: 'rooms' })
export class RoomModel {
  @PrimaryGeneratedColumn({
    name: 'room_id',
  })
  roomId?: number;

  @Column()
  name: string;

  @Column()
  address?: string;

  @Column('int')
  capacity: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  price: number;

  @Column('point')
  location: string;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.PENDING,
  })
  status: RoomStatus;

  @Column({
    nullable: true,
  })
  description: string;

  @Column()
  image: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  rating: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'status_id',
    nullable: true,
  })
  statusId: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @ManyToOne(() => UserModel, (user) => user.rooms)
  @JoinColumn({ name: 'owner' })
  user?: UserModel;

  @OneToMany(() => StatusModel, (status) => status.room)
  @JoinColumn({ name: 'status_id' })
  roomStatus?: StatusModel[];
}

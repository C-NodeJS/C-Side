import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Geometry, Point } from 'geojson';
import { RoomStatus } from './enum';
import { UserModel } from './user.entity';

@Entity({ name: 'rooms' })
export class RoomModel {
  @PrimaryGeneratedColumn()
  room_id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column('int')
  capacity: number;

  @Column()
  price: number;

  @Column('point')
  location: string;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.Pending,
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
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @ManyToOne(() => UserModel, (user) => user.rooms)
  @JoinColumn({ name: 'owner' })
  user?: UserModel;
}

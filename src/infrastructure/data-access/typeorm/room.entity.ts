import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomStatus } from './enum';
import { UserModel } from './user.entity';
import { RoomDetailResponseDTO } from '../../../application/room/dto/manage_room.dto';

@Entity({ name: 'rooms' })
export class RoomModel {
  @PrimaryGeneratedColumn({
    name: 'room_id',
  })
  roomId: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column('int')
  capacity: number;

  @Column({
    nullable: true,
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

  @ManyToOne(() => UserModel, (user) => user.rooms)
  @JoinColumn({ name: 'owner' })
  user?: UserModel;

  toRoomDetailResponseDTO(): RoomDetailResponseDTO {

  }
}

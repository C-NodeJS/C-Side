import { RoleModel } from './role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomModel } from './room.entity';

@Entity({ name: 'users' })
export class UserModel {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  address?: string;

  @Column({
    nullable: true,
  })
  phone?: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    name: 'is_active',
    type: 'smallint',
    width: 1,
    nullable: true,
  })
  isActive?: number;

  @Column({
    nullable: true,
  })
  avatar?: string;

  @OneToMany(() => RoomModel, (room) => room.user)
  rooms?: RoomModel[];

  @ManyToOne(() => RoleModel, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role_id: RoleModel;
}

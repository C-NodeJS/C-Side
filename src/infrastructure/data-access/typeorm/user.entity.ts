import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { RoomModel } from './room.entity';
import { RoleModel } from './role.entity';

@Entity({ name: 'users' })
export class UserModel {
  @PrimaryGeneratedColumn({
    name: 'user_id',
  })
  userId: number;

  @IsNotEmpty()
  @Column({
    name: 'user_name',
    nullable: true,
    unique: true,
  })
  userName: string;

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
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  avatar?: string;

  @Column({
    name: 'role_id',
    nullable: true,
  })
  roleId: number;

  @OneToMany(() => RoomModel, (room) => room.user)
  rooms?: RoomModel[];

  @ManyToOne(() => RoleModel, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: RoleModel;
}

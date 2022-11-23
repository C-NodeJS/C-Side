import { PasswordTransformer } from './../../../application/common/password.transformer';
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
  @PrimaryGeneratedColumn()
  user_id: number;

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
  name?: string;

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
    transformer: new PasswordTransformer(),
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

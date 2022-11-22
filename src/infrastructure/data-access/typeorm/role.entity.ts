import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionModel } from './permission.entity';
import { UserModel } from './user.entity';

@Entity({ name: 'roles' })
export class RoleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    // unique: true,
  })
  name: string;

  users: UserModel[];

  @ManyToMany(() => PermissionModel, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  permissions: PermissionModel[];
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.entity';

@Entity({ name: 'roles' })
export class RoleModel {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @OneToMany(() => UserModel, (user) => user.role_id)
  users: UserModel[];
}

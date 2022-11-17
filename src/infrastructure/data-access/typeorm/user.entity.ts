import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordTransformer } from './../../../application/common/password.transformer';

@Entity({ name: 'users' })
export class UserModel {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    nullable: true,
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

  // TODO add role_id field later...
}
